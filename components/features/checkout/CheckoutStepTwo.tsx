import React from "react";
import { CreditCard, Lock, Shield } from "lucide-react";
import type { CheckoutErrors, CheckoutFormState, CheckoutTouched } from "./types";

type CheckoutStepTwoProps = {
  formData: CheckoutFormState;
  errors: CheckoutErrors;
  touched: CheckoutTouched;
  setFieldValue: (field: keyof CheckoutFormState, value: string) => void;
  touchField: (field: keyof CheckoutFormState) => void;
  setStep: (step: number) => void;
  loading: boolean;
};

export default function CheckoutStepTwo({
  formData,
  errors,
  touched,
  setFieldValue,
  touchField,
  setStep,
  loading,
}: CheckoutStepTwoProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Paiement sécurisé</h3>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Paiement 100% sécurisé par Stripe</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nom sur la carte</label>
        <input
          value={formData.cardName}
          onChange={(e) => setFieldValue("cardName", e.target.value)}
          onBlur={() => touchField("cardName")}
          placeholder="Jean Dupont"
          className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
            touched.cardName && errors.cardName
              ? "border-red-300 focus:ring-red-500"
              : "border-zinc-300 focus:ring-accent-500"
          }`}
        />
        {touched.cardName && errors.cardName && (
          <div className="mt-1 text-xs text-red-600">{errors.cardName}</div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
        Le paiement se fait sur Stripe (redirection). Aucune saisie de carte n'est nécessaire sur ce site.
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-6">
        <Lock className="h-4 w-4" />
        <span>Vos données sont cryptées et protégées</span>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          ← Retour aux informations
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
        >
          Payer maintenant
          <CreditCard className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
