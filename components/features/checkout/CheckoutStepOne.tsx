import Link from "next/link";
import React from "react";
import { ArrowLeft, Upload, Palette } from "lucide-react";
import type { CheckoutErrors, CheckoutFormState, CheckoutTouched } from "./types";

type CheckoutStepOneProps = {
  formData: CheckoutFormState;
  errors: CheckoutErrors;
  touched: CheckoutTouched;
  setFieldValue: (field: keyof CheckoutFormState, value: string) => void;
  touchField: (field: keyof CheckoutFormState) => void;
  goToStep: (step: number) => void;
  onLogoSelected: (file: File) => Promise<void>;
  logoUploading: boolean;
};

export default function CheckoutStepOne({
  formData,
  errors,
  touched,
  setFieldValue,
  touchField,
  goToStep,
  onLogoSelected,
  logoUploading,
}: CheckoutStepOneProps) {
  
  // Fonction utilitaire pour gérer le changement de support et les resets de couleurs associés
  const handleSupportChange = (supportType: string) => {
    setFieldValue("support", supportType);

    if (supportType === "BLACK") {
      // Si Noir : Fond noir forcé, Texte blanc, Pas de carré couleur (logoColor vide ou transparent)
      setFieldValue("supportColor", "#000000");
      setFieldValue("textColor", "#FFFFFF");
      setFieldValue("logoColor", ""); 
    } else if (supportType === "WOOD") {
      // Si Bois : Couleur bois (ex: SaddleBrown), Texte noir, Pas de carré couleur
      setFieldValue("supportColor", "#8B4513"); 
      setFieldValue("textColor", "#000000");
      setFieldValue("logoColor", "");
    } else {
      // Si Blanc : Retour aux défauts (Fond blanc, Texte noir, Carré bleu par ex)
      setFieldValue("supportColor", "#FFFFFF");
      setFieldValue("textColor", "#000000");
      setFieldValue("logoColor", "#1E40AF");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h3>

      {/* --- FORMULAIRE INFOS PERSO (Inchangé) --- */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            value={formData.firstName}
            onChange={(e) => setFieldValue("firstName", e.target.value)}
            onBlur={() => touchField("firstName")}
            placeholder="Jean"
            autoComplete="given-name"
            className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
              touched.firstName && errors.firstName
                ? "border-red-300 focus:ring-red-500"
                : "border-zinc-300 focus:ring-accent-500"
            }`}
          />
          {touched.firstName && errors.firstName && (
            <div className="mt-1 text-xs text-red-600">{errors.firstName}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            value={formData.lastName}
            onChange={(e) => setFieldValue("lastName", e.target.value)}
            onBlur={() => touchField("lastName")}
            placeholder="Dupont"
            autoComplete="family-name"
            className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
              touched.lastName && errors.lastName
                ? "border-red-300 focus:ring-red-500"
                : "border-zinc-300 focus:ring-accent-500"
            }`}
          />
          {touched.lastName && errors.lastName && (
            <div className="mt-1 text-xs text-red-600">{errors.lastName}</div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFieldValue("email", e.target.value)}
          onBlur={() => touchField("email")}
          placeholder="jean@example.com"
          autoComplete="email"
          className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
            touched.email && errors.email
              ? "border-red-300 focus:ring-red-500"
              : "border-zinc-300 focus:ring-accent-500"
          }`}
        />
        {touched.email && errors.email && (
          <div className="mt-1 text-xs text-red-600">{errors.email}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
        <input
          value={formData.phone}
          onChange={(e) => setFieldValue("phone", e.target.value)}
          onBlur={() => touchField("phone")}
          placeholder="+33 6 12 34 56 78"
          autoComplete="tel"
          className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
            touched.phone && errors.phone
              ? "border-red-300 focus:ring-red-500"
              : "border-zinc-300 focus:ring-accent-500"
          }`}
        />
        {touched.phone && errors.phone && (
          <div className="mt-1 text-xs text-red-600">{errors.phone}</div>
        )}
      </div>

      <div className="pt-2">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Personnalisation de la carte</h3>

        <div className="grid gap-6">
          {/* SÉLECTION DU SUPPORT */}
          <div>
            <div className="text-sm font-medium text-gray-700">Choisissez votre support</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                { value: "WHITE", label: "Blanc" },
                { value: "BLACK", label: "Noir" },
                { value: "WOOD", label: "Bois" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  // Utilisation du nouveau handler pour reset les couleurs
                  onClick={() => handleSupportChange(opt.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    formData.support === opt.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* MODIFICATION : Affichage conditionnel.
              Les couleurs de support et de fond (carré) ne sont visibles QUE si WHITE.
          */}
          {formData.support === "WHITE" && (
            <>
              {/* COULEUR DU SUPPORT (Visible seulement si WHITE) */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Couleur des bords du logo
                </div>
                <div className="flex items-center gap-2">
                  {[
                    "#FFFFFF", "#000000", "#1E40AF", "#DC2626", "#059669", "#D97706", "#7C3AED", "#EC4899", "#6B7280"
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFieldValue("supportColor", color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
                        formData.supportColor === color ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "border-zinc-300"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Couleur du support ${color}`}
                    />
                  ))}
                  <Palette className="w-5 h-5 text-zinc-400 ml-2" />
                </div>
                <div className="mt-2 text-xs text-zinc-500">Personnalisez la couleur de la carte</div>
              </div>

              {/* COULEUR DU FOND / CARRÉ (Visible seulement si WHITE) */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Couleur du support
                </div>
                <div className="flex items-center gap-2">
                  {[
                    "#FFFFFF", "#000000", "#1E40AF", "#DC2626", "#059669", "#D97706", "#7C3AED", "#EC4899", "#6B7280"
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFieldValue("logoColor", color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
                        formData.logoColor === color ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "border-zinc-300"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Couleur ${color}`}
                    />
                  ))}
                  <Palette className="w-5 h-5 text-zinc-400 ml-2" />
                </div>
                <div className="mt-2 text-xs text-zinc-500">Choisissez la couleur du carré décoratif</div>
              </div>
            </>
          )}

          {/* COULEUR DU TEXTE (Toujours visible pour tous les supports) */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Couleur du texte</div>
            <div className="flex items-center gap-2">
              {[
                "#000000", "#FFFFFF", "#1E40AF", "#DC2626", "#059669", "#D97706", "#7C3AED", "#EC4899", "#6B7280"
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFieldValue("textColor", color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
                    formData.textColor === color ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "border-zinc-300"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Couleur du texte ${color}`}
                />
              ))}
              <Palette className="w-5 h-5 text-zinc-400 ml-2" />
            </div>
            <div className="mt-2 text-xs text-zinc-500">Choisissez la couleur du texte (sauf logo)</div>
          </div>

          {/* UPLOAD LOGO (Inchangé) */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ajoutez votre logo</label>
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={logoUploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onLogoSelected(f);
                    e.currentTarget.value = "";
                  }}
                  className="hidden"
                  id="logo-upload-input"
                />
                <button
                  type="button"
                  disabled={logoUploading}
                  onClick={() => document.getElementById("logo-upload-input")?.click()}
                  className="inline-flex items-center justify-center w-full gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {logoUploading ? "Upload en cours…" : formData.logoUrl ? "Changer le logo" : "Choisir un logo"}
                </button>
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Formats acceptés: png, jpg, webp, svg (max 3MB)
              </div>
              {formData.logoUrl ? (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="h-12 w-12 rounded-lg border border-zinc-200 bg-white object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFieldValue("logoUrl", "")}
                    className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
                  >
                    Retirer
                  </button>
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Taille du logo</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={formData.logoScale}
                onChange={(e) => setFieldValue("logoScale", e.target.value)}
                className="mt-3 w-full"
              />
              <div className="mt-2 text-xs text-zinc-500">{formData.logoScale}x</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Texte secondaire (optionnel)</label>
            <input
              value={formData.secondaryText}
              onChange={(e) => setFieldValue("secondaryText", e.target.value)}
              placeholder="Poste / Société"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Adresse de livraison</h4>

      {/* --- FORMULAIRE ADRESSE (Inchangé) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Adresse</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFieldValue("address", e.target.value)}
          onBlur={() => touchField("address")}
          rows={3}
          className={`mt-1 w-full resize-none rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
            touched.address && errors.address
              ? "border-red-300 focus:ring-red-500"
              : "border-zinc-300 focus:ring-accent-500"
          }`}
        />
        {touched.address && errors.address && (
          <div className="mt-1 text-xs text-red-600">{errors.address}</div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ville</label>
          <input
            value={formData.city}
            onChange={(e) => setFieldValue("city", e.target.value)}
            onBlur={() => touchField("city")}
            placeholder="Paris"
            autoComplete="address-level2"
            className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
              touched.city && errors.city
                ? "border-red-300 focus:ring-red-500"
                : "border-zinc-300 focus:ring-accent-500"
            }`}
          />
          {touched.city && errors.city && (
            <div className="mt-1 text-xs text-red-600">{errors.city}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Code postal</label>
          <input
            value={formData.postalCode}
            onChange={(e) => setFieldValue("postalCode", e.target.value)}
            onBlur={() => touchField("postalCode")}
            placeholder="75001"
            inputMode="numeric"
            autoComplete="postal-code"
            className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
              touched.postalCode && errors.postalCode
                ? "border-red-300 focus:ring-red-500"
                : "border-zinc-300 focus:ring-accent-500"
            }`}
          />
          {touched.postalCode && errors.postalCode && (
            <div className="mt-1 text-xs text-red-600">{errors.postalCode}</div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pays</label>
        <select
          value={formData.country}
          onChange={(e) => setFieldValue("country", e.target.value)}
          onBlur={() => touchField("country")}
          className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
            touched.country && errors.country
              ? "border-red-300 focus:ring-red-500"
              : "border-zinc-300 focus:ring-accent-500"
          }`}
        >
          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Suisse">Suisse</option>
          <option value="Luxembourg">Luxembourg</option>
        </select>
        {touched.country && errors.country && (
          <div className="mt-1 text-xs text-red-600">{errors.country}</div>
        )}
      </div>

      <h4 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Configuration NFC</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700">Lien à encoder (URL)</label>
        <input
          value={formData.nfcLink}
          onChange={(e) => setFieldValue("nfcLink", e.target.value)}
          onBlur={() => touchField("nfcLink")}
          placeholder="https://votrelien.com"
          inputMode="url"
          autoComplete="url"
          className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 ${
            touched.nfcLink && errors.nfcLink
              ? "border-red-300 focus:ring-red-500"
              : "border-zinc-300 focus:ring-accent-500"
          }`}
        />
        <div className="mt-1 text-xs text-gray-500">Le lien qui s'ouvrira lorsque la carte sera scannée</div>
        {touched.nfcLink && errors.nfcLink && (
          <div className="mt-1 text-xs text-red-600">{errors.nfcLink}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message sur la carte (optionnel)</label>
        <textarea
          value={formData.cardMessage}
          onChange={(e) => setFieldValue("cardMessage", e.target.value)}
          onBlur={() => touchField("cardMessage")}
          placeholder="Votre message professionnel..."
          rows={3}
          className="mt-1 w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-accent-500"
        />
      </div>

      <div className="flex justify-between pt-6">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
        <button
          type="button"
          onClick={() => goToStep(2)}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}