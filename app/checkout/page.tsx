"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Shield,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/components/features/products/catalog";
import OrderSummary, {
  type OrderSummaryItem,
} from "@/components/features/checkout/OrderSummary";
import CheckoutStepOne from "@/components/features/checkout/CheckoutStepOne";
import CheckoutStepTwo from "@/components/features/checkout/CheckoutStepTwo";
import type { CheckoutErrors, CheckoutFormState, CheckoutTouched } from "@/components/features/checkout/types";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const normalizePhone = (phone: string) => phone.replace(/[^0-9+]/g, "");
const isValidPhone = (phone: string) => {
  const p = normalizePhone(phone);
  const digits = p.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
};
const isValidPostalCode = (postalCode: string) => /^[0-9]{4,6}$/.test(postalCode.trim());
const isValidUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const validateField = (field: keyof CheckoutFormState, value: string) => {
  const v = value ?? "";

  switch (field) {
    case "firstName":
      return v.trim().length >= 2 ? null : "Prénom requis (min. 2 caractères).";
    case "lastName":
      return v.trim().length >= 2 ? null : "Nom requis (min. 2 caractères).";
    case "email":
      return isValidEmail(v) ? null : "Email invalide.";
    case "phone":
      return isValidPhone(v) ? null : "Téléphone invalide (9 à 15 chiffres).";
    case "address":
      return v.trim().length >= 6 ? null : "Adresse requise (min. 6 caractères).";
    case "city":
      return v.trim().length >= 2 ? null : "Ville requise.";
    case "postalCode":
      return isValidPostalCode(v) ? null : "Code postal invalide (4 à 6 chiffres).";
    case "country":
      return v.trim() ? null : "Pays requis.";
    case "nfcLink":
      return isValidUrl(v) ? null : "URL invalide (http(s)://...).";
    case "cardName":
      return v.trim().length >= 2 ? null : "Nom sur la carte requis.";
    case "cardMessage":
      return null;
    default:
      return null;
  }
};

export default function CheckoutPage() {
  const { items: cartItems } = useCart();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") || "1";
  const qtyRaw = searchParams.get("qty") || "1";
  const quantity = (() => {
    const n = Number(qtyRaw);
    if (!Number.isFinite(n)) return 1;
    const v = Math.floor(n);
    if (v < 1) return 1;
    if (v > 99) return 99;
    return v;
  })();
  const selectedProduct = getProductById(productId) ?? getProductById("1");
  const checkoutItems = cartItems.length > 0 ? cartItems : [{ productId, quantity }];

  const summaryItems: OrderSummaryItem[] = checkoutItems
    .map((i) => {
      const p = getProductById(i.productId);
      if (!p) return null;
      const lineTotal = p.unitPrice * i.quantity;
      return {
        productId: i.productId,
        name: p.name,
        quantity: i.quantity,
        unitPrice: p.unitPrice,
        lineTotal,
      };
    })
    .filter(Boolean) as OrderSummaryItem[];

  const totalAmount = summaryItems.reduce((sum, it) => sum + it.lineTotal, 0);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    cardName: "",
    nfcLink: "",
    cardMessage: "",
    support: "WHITE",
    logoUrl: "",
    logoScale: "1",
    logoColor: "#FFFFFF",
    supportColor: "#000000",
    textColor: "#000000",
    secondaryText: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<CheckoutTouched>({});
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const supportTheme = useMemo(() => {
    const v = String(formData.support || "WHITE").toUpperCase();
    if (v === "BLACK") {
      return {
        cardClass: "bg-zinc-950 text-white",
        subtle: "text-zinc-300",
        border: "border-zinc-800",
      };
    }
    if (v === "WOOD") {
      return {
        cardClass: "bg-amber-50 text-zinc-900",
        subtle: "text-zinc-600",
        border: "border-amber-200",
      };
    }
    return {
      cardClass: "bg-white text-zinc-900",
      subtle: "text-zinc-600",
      border: "border-zinc-200",
    };
  }, [formData.support]);

  const uploadLogo = async (file: File) => {
    setLogoUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/uploads/logo", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload impossible");
      const url = String(json?.url ?? "");
      if (!url) throw new Error("URL logo manquante");
      setFieldValue("logoUrl", url);
    } catch (e) {
      console.error(e);
    } finally {
      setLogoUploading(false);
    }
  };

  const setFieldValue = (field: keyof CheckoutFormState, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const err = validateField(field, value);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: err ?? undefined }));
      return next;
    });
  };

  const touchField = (field: keyof CheckoutFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prevErrors) => {
      const err = validateField(field, formData[field]);
      return { ...prevErrors, [field]: err ?? undefined };
    });
  };

  const validateStep = (targetStep: number) => {
    const nextErrors: CheckoutErrors = {};

    if (targetStep >= 1) {
      const fields: (keyof CheckoutFormState)[] = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "postalCode",
        "country",
        "nfcLink",
      ];
      for (const f of fields) {
        const err = validateField(f, formData[f]);
        if (err) nextErrors[f] = err;
      }
    }

    if (targetStep >= 2) {
      const err = validateField("cardName", formData.cardName);
      if (err) nextErrors.cardName = err;
    }

    setErrors(nextErrors);
    setTouched((prev) => {
      const next: CheckoutTouched = { ...prev };
      for (const key of Object.keys(nextErrors) as (keyof CheckoutFormState)[]) {
        next[key] = true;
      }
      return next;
    });
    return Object.keys(nextErrors).length === 0;
  };

  const goToStep = (nextStep: number) => {
    const requiredValidationStep = nextStep <= 1 ? 1 : nextStep - 1;
    const ok = validateStep(requiredValidationStep);
    if (!ok) return;
    setStep(nextStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = validateStep(2);
    if (!ok) return;

    setLoading(true);

    try {
      const response = await createCheckoutSession({
        ...formData,
        productId,
        amount: selectedProduct?.unitPrice ?? 29.9,
        quantity,
        items: checkoutItems,
        support: formData.support,
        logoUrl: formData.logoUrl || undefined,
        logoScale: (() => {
          const n = Number(formData.logoScale);
          return Number.isFinite(n) ? n : undefined;
        })(),
        logoColor: formData.logoColor || undefined,
        secondaryText: formData.secondaryText || undefined,
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Étape 1</div>
                    <div className="font-semibold">Informations</div>
                  </div>
                </div>
                <div className="h-px flex-1 mx-4 bg-gray-200" />
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= 2
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Étape 2</div>
                    <div className="font-semibold">Paiement</div>
                  </div>
                </div>
                <div className="h-px flex-1 mx-4 bg-gray-200" />
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= 3
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Étape 3</div>
                    <div className="font-semibold">Confirmation</div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <CheckoutStepOne
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    touchField={touchField}
                    goToStep={goToStep}
                    onLogoSelected={uploadLogo}
                    logoUploading={logoUploading}
                  />
                ) : null}

                {step === 2 ? (
                  <CheckoutStepTwo
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    touchField={touchField}
                    setStep={setStep}
                    loading={loading}
                  />
                ) : null}
              </form>
            </div>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <OrderSummary items={summaryItems} total={totalAmount} />

              <div className={`rounded-2xl border shadow-xl overflow-hidden`} style={{ 
                backgroundColor: formData.support === "WHITE" ? (formData.logoColor || "#FFFFFF") : (formData.supportColor || "#000000"),
                borderColor: formData.support === "WHITE" ? (formData.supportColor || "#000000") : undefined
              }}>
                <div className={`p-6`} style={{
                  color: formData.textColor || (formData.support === "WHITE" ? "#000000" : "#FFFFFF")
                }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div 
                        className="text-xs font-semibold uppercase tracking-wide" 
                        style={{ 
                          color: formData.textColor || (formData.support === "WHITE" ? "#000000" : "#FFFFFF")
                        }}
                      >
                        Aperçu
                      </div>
                      <div className="mt-1 text-sm opacity-70">Support: {formData.support}</div>
                    </div>
                    <div 
                      className="h-10 w-10 rounded-xl" 
                      style={{ 
                        backgroundColor: formData.support === "WHITE" ? (formData.logoColor || "#FFFFFF") : (formData.supportColor || "#000000"),
                        borderColor: formData.support === "WHITE" ? (formData.supportColor || "#000000") : undefined
                      }}
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-6">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo"
                        className="h-16 w-16 rounded-xl bg-white/90 object-contain p-2 flex-shrink-0"
                        style={{ 
                          transform: `scale(${Math.min(Number(formData.logoScale) || 1, 1.2)})`, 
                          transformOrigin: "left center",
                          maxWidth: "64px",
                          borderColor: formData.support === "WHITE" ? (formData.supportColor || "#000000") : undefined
                        }}
                      />
                    ) : (
                      <div className={`h-16 w-16 rounded-xl border flex items-center justify-center text-xs flex-shrink-0`} style={{
                        borderColor: formData.support === "WHITE" ? (formData.supportColor || "#000000") : undefined,
                        color: formData.support === "WHITE" ? "#6b7280" : "#d1d5db"
                      }}>
                        Logo
                      </div>
                    )}
                    <div className="flex-1 space-y-1 min-w-0">
                      <div 
                        className="text-lg font-bold" 
                        style={{ 
                          color: formData.textColor || (formData.support === "WHITE" ? "#000000" : "#FFFFFF")
                        }}
                      >
                        {formData.cardName || "Nom sur la carte"}
                      </div>
                      <div 
                        className="text-sm" 
                        style={{ 
                          color: formData.textColor || (formData.support === "WHITE" ? "#000000" : "#FFFFFF")
                        }}
                      >
                        {formData.secondaryText || "Texte secondaire"}
                      </div>
                      <div 
                        className="text-xs mt-2" 
                        style={{ 
                          color: formData.textColor || (formData.support === "WHITE" ? "#000000" : "#FFFFFF")
                        }}
                      >
                        {formData.nfcLink || "Lien NFC"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-start">
                    <ArrowLeft className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">Retour possible avant la validation Stripe</span>
                  </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                  En cliquant sur "Payer maintenant", vous acceptez nos
                  <Link href="/terms" className="text-blue-600 hover:underline ml-1">
                    conditions générales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
