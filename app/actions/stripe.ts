"use server"

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

type CreateCheckoutSessionInput = {
  firstName: string;
  lastName: string;
  email: string;

  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  cardName?: string;
  nfcLink: string;
  cardMessage?: string;
  support?: string;
  logoUrl?: string;
  logoScale?: number;
  logoColor?: string;
  secondaryText?: string;
  productId: string;
  amount: number;
  quantity?: number;
  items?: Array<{ productId: string; quantity: number }>;
};

function normalizeInput(payload: unknown): CreateCheckoutSessionInput {
  if (
    payload &&
    typeof payload === 'object' &&
    'get' in payload &&
    typeof (payload as any).get === 'function'
  ) {
    const formData = payload as any;
    const customerNameRaw = String(formData.get('customerName') ?? '').trim();
    const [firstName, ...rest] = customerNameRaw.split(' ').filter(Boolean);
    const lastName = rest.join(' ');

    const email = String(formData.get('email') ?? '').trim();
    const nfcLink = String(formData.get('nfcLink') ?? '').trim();

    const productId = String(formData.get('productId') ?? '1');
    const quantityRaw = formData.get('quantity');
    const quantity = typeof quantityRaw === 'string' && quantityRaw.trim() !== ''
      ? Number(quantityRaw)
      : 1;
    const amountRaw = formData.get('amount');
    const amount = typeof amountRaw === 'string' && amountRaw.trim() !== ''
      ? Number(amountRaw)
      : 29.9;

    const itemsRaw = formData.get('items');
    const items = Array.isArray(itemsRaw)
      ? itemsRaw.map((item: any) => ({ productId: item.productId, quantity: item.quantity }))
      : undefined;

    return {
      firstName: firstName || 'Client',
      lastName: lastName || '',
      email,
      nfcLink,
      productId,
      amount,
      quantity,
      items,
      phone: String(formData.get('phone') ?? '') || undefined,
      address: String(formData.get('address') ?? '') || undefined,
      city: String(formData.get('city') ?? '') || undefined,
      postalCode: String(formData.get('postalCode') ?? '') || undefined,
      country: String(formData.get('country') ?? '') || undefined,
      cardName: String(formData.get('cardName') ?? '') || undefined,
      cardMessage: String(formData.get('cardMessage') ?? '') || undefined,
      support: String(formData.get('support') ?? '') || undefined,
      logoUrl: String(formData.get('logoUrl') ?? '') || undefined,
      logoScale: Number(formData.get('logoScale') ?? '') || undefined,
      logoColor: String(formData.get('logoColor') ?? '') || undefined,
      secondaryText: String(formData.get('secondaryText') ?? '') || undefined,
    };
  }

  return payload as CreateCheckoutSessionInput;
}

const productIdToCardType: Record<string, string> = {
  '1': 'PVC_PRO',
  '2': 'METAL_PREMIUM',
  '3': 'BAMBOO_ECO',
};

const productCatalog: Record<
  string,
  {
    amount: number;
    cardType: string;
    priceEnvKeys: string[];
  }
> = {
  '1': {
    amount: 29.9,
    cardType: 'PVC_PRO',
    priceEnvKeys: ['STRIPE_PRICE_ID_PVC_PRO', 'STRIPE_PRICE_ID'],
  },
  '2': {
    amount: 79.9,
    cardType: 'METAL_PREMIUM',
    priceEnvKeys: ['STRIPE_PRICE_ID_METAL_PREMIUM'],
  },
  '3': {
    amount: 49.9,
    cardType: 'BAMBOO_ECO',
    priceEnvKeys: ['STRIPE_PRICE_ID_BAMBOO_ECO'],
  },
};

function resolvePriceId(productId: string) {
  const catalogEntry = productCatalog[productId] ?? productCatalog['1'];

  for (const key of catalogEntry.priceEnvKeys) {
    const value = process.env[key];
    if (value && value !== 'TON_PRICE_ID_ICI') return value;
  }

  return null;
}

export async function createCheckoutSession(input: unknown) {
  const isFormAction =
    input && typeof input === 'object' && 'get' in input && typeof (input as any).get === 'function';

  const normalized = normalizeInput(input);
  const clampQty = (value: unknown) => {
    const n = Number(value ?? 1);
    if (!Number.isFinite(n)) return 1;
    const v = Math.floor(n);
    if (v < 1) return 1;
    if (v > 99) return 99;
    return v;
  };

  const rawItems = Array.isArray((normalized as any).items) ? ((normalized as any).items as any[]) : null;
  const cartItems = rawItems
    ? rawItems
        .filter((x) => x && typeof x === 'object')
        .map((x) => ({ productId: String((x as any).productId ?? ''), quantity: clampQty((x as any).quantity) }))
        .filter((x) => x.productId)
    : [];

  const singleQuantity = clampQty((normalized as any).quantity ?? 1);
  const effectiveItems = cartItems.length > 0
    ? cartItems
    : [{ productId: normalized.productId, quantity: singleQuantity }];

  const lineItems = effectiveItems.map((i) => {
    const catalogEntry = productCatalog[i.productId] ?? productCatalog['1'];
    const priceId = resolvePriceId(i.productId);
    if (!priceId || priceId === 'TON_PRICE_ID_ICI') {
      throw new Error(`L'ID du prix Stripe n'est pas configuré pour le produit ${i.productId}.`);
    }
    return {
      productId: i.productId,
      cardType: catalogEntry.cardType,
      unitAmount: catalogEntry.amount,
      quantity: i.quantity,
      stripe: { price: priceId, quantity: i.quantity },
    };
  });

  const totalQuantity = lineItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = lineItems.reduce((sum, i) => sum + i.unitAmount * i.quantity, 0);

  const primaryCardType = lineItems[0]?.cardType ?? 'PVC_PRO';
  const primaryPriceId = lineItems[0]?.stripe.price;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL; // On récupère l'URL ici

  console.log('[Stripe] createCheckoutSession', {
    productId: normalized.productId,
    priceId: primaryPriceId,
    baseUrl,
  });

  // Vérifications de sécurité
  if (!baseUrl) {
    throw new Error("L'URL de base (NEXT_PUBLIC_APP_URL) n'est pas configurée.");
  }

  if (!normalized.email) {
    throw new Error("Email manquant. Impossible de créer la commande.");
  }
  if (!normalized.nfcLink) {
    throw new Error("Lien NFC manquant. Impossible de créer la commande.");
  }

  const customerName = `${normalized.firstName} ${normalized.lastName}`.trim();
  const customerEmail = normalized.email;
  const nfcLink = normalized.nfcLink;
  const cardType = primaryCardType ?? productIdToCardType[normalized.productId] ?? 'PVC_PRO';

  const support = String((normalized as any).support ?? 'WHITE').toUpperCase();
  const logoUrl = typeof (normalized as any).logoUrl === 'string' ? (normalized as any).logoUrl : undefined;
  const logoScaleRaw = (normalized as any).logoScale;
  const logoScale = typeof logoScaleRaw === 'number' && Number.isFinite(logoScaleRaw) ? logoScaleRaw : undefined;
  const logoColor = typeof (normalized as any).logoColor === 'string' ? (normalized as any).logoColor : undefined;
  const secondaryText = typeof (normalized as any).secondaryText === 'string' ? (normalized as any).secondaryText : undefined;

  const addressParts = [normalized.address, normalized.postalCode, normalized.city, normalized.country]
    .filter(Boolean)
    .join(', ');

  const order = await prisma.order.create({
    data: {
      amount: totalAmount,
      currency: 'eur',
      status: 'PENDING',
      customerName,
      customerEmail,
      address: addressParts || null,
      cardType,
      support,
      nfcLink,
      nfcNameOnCard: normalized.cardName || null,
      logoUrl: logoUrl || null,
      logoScale: logoScale ?? null,
      logoColor: logoColor || null,
      secondaryText: secondaryText || null,
      quantity: totalQuantity,
      items: {
        create: lineItems.map((i) => ({
          productId: i.productId,
          cardType: i.cardType,
          unitAmount: i.unitAmount,
          quantity: i.quantity,
        })),
      },
    },
  });

  let session;

  try {
    session = await stripe.checkout.sessions.create({
      line_items: lineItems.map((i) => i.stripe),
      mode: 'payment',
      customer_email: customerEmail,
      client_reference_id: order.id,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        orderId: order.id,
        nfcLink,
        customerName,
        quantity: String(totalQuantity),
        support,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });
  } catch (err: any) {
    const stripeMessage =
      err?.raw?.message || err?.message || 'Erreur Stripe inconnue';
    const stripeType = err?.type || err?.rawType;
    const stripeCode = err?.code || err?.raw?.code;

    console.error('Erreur Stripe:', {
      message: stripeMessage,
      type: stripeType,
      code: stripeCode,
    });

    throw new Error(
      `Erreur lors de la création de la session Stripe: ${stripeMessage}`,
    );
  }

  if (!session?.url) throw new Error("Impossible de générer l'URL de paiement.");

  if (isFormAction) {
    redirect(session.url);
  }

  return { url: session.url, orderId: order.id, stripeSessionId: session.id };
}