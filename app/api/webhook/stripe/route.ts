import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db"; // Importe l'instance globale ici
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is missing');
    return new NextResponse('Webhook Error: STRIPE_WEBHOOK_SECRET missing', { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    console.error('[stripe-webhook] signature verification failed', error?.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log('[stripe-webhook] event received', event.type);

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId ?? session?.client_reference_id;

    console.log('[stripe-webhook] checkout.session.completed', {
      orderId,
      sessionId: session?.id,
    });

    if (orderId) {
      const existing = await prisma.order.findUnique({ where: { id: orderId } });
      console.log('[stripe-webhook] order lookup by id', {
        orderId,
        found: Boolean(existing),
        currentStatus: existing?.status,
        currentStripeSessionId: existing?.stripeSessionId,
      });
    }

    const amount = typeof session?.amount_total === 'number'
      ? session.amount_total / 100
      : undefined;

    const customerEmail =
      session?.customer_details?.email ?? session?.customer_email ?? undefined;

    const customerName = session?.metadata?.customerName ?? undefined;
    const nfcLink = session?.metadata?.nfcLink ?? undefined;

    try {
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            stripeSessionId: session.id,
            status: "PAID",
            customerEmail: customerEmail ?? undefined,
            customerName: customerName ?? undefined,
            amount: amount ?? undefined,
            nfcLink: nfcLink ?? undefined,
          },
        });
        const updated = await prisma.order.findUnique({ where: { id: orderId } });
        console.log('[stripe-webhook] order updated to PAID', {
          orderId,
          status: updated?.status,
          stripeSessionId: updated?.stripeSessionId,
        });
      } else {
        await prisma.order.update({
          where: { stripeSessionId: session.id },
          data: {
            status: "PAID",
            customerEmail: customerEmail ?? undefined,
            customerName: customerName ?? undefined,
            amount: amount ?? undefined,
            nfcLink: nfcLink ?? undefined,
          },
        });
        console.log('[stripe-webhook] order updated to PAID by stripeSessionId', session?.id);
      }
    } catch (e: any) {
      const code = e?.code;
      if (code === 'P2025') {
        console.warn('[stripe-webhook] order not found for session; skipping update', {
          orderId,
          stripeSessionId: session?.id,
        });

        if (orderId && session?.id) {
          try {
            await prisma.order.update({
              where: { stripeSessionId: session.id },
              data: {
                status: "PAID",
                customerEmail: customerEmail ?? undefined,
                customerName: customerName ?? undefined,
                amount: amount ?? undefined,
                nfcLink: nfcLink ?? undefined,
              },
            });
            console.log('[stripe-webhook] fallback update to PAID by stripeSessionId succeeded', {
              stripeSessionId: session.id,
              originalOrderId: orderId,
            });
          } catch (fallbackErr: any) {
            console.warn('[stripe-webhook] fallback update by stripeSessionId failed', {
              stripeSessionId: session?.id,
              code: fallbackErr?.code,
              message: fallbackErr?.message,
            });
          }
        }
      } else {
        console.error('[stripe-webhook] unexpected error updating order', e);
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}