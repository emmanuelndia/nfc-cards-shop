"use client";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { BackButton } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = 
    formData.firstName.trim() !== "" && 
    formData.lastName.trim() !== "" && 
    formData.email.trim() !== "" && 
    formData.password.trim() !== "" && 
    isChecked;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        title: "Formulaire incomplet",
        text: "Veuillez remplir tous les champs et accepter les conditions.",
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        customClass: { container: "z-[999999]" },
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "ADMIN" // Premier utilisateur sera admin
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Erreur d'inscription",
          text: data.error || "Une erreur est survenue lors de l'inscription.",
          position: "top",
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          customClass: { container: "z-[999999]" },
        });
        return;
      }

      // Inscription réussie
      Swal.fire({
        icon: "success",
        title: "Compte créé avec succès!",
        text: `Bienvenue ${formData.firstName}! Votre compte administrateur a été créé.`,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        customClass: { container: "z-[999999]" },
      });

      // Redirection vers la page de connexion
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error("Erreur d'inscription:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur réseau",
        text: "Impossible de contacter le serveur. Vérifiez votre connexion.",
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        customClass: { container: "z-[999999]" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    Swal.fire({
      icon: "info",
      title: "Bientôt disponible",
      text: "L'inscription avec Google sera disponible prochainement.",
      position: "top",
      timer: 3000,
      showConfirmButton: false,
      toast: true,
    });
  };

  const handleTwitterSignUp = () => {
    Swal.fire({
      icon: "info",
      title: "Bientôt disponible",
      text: "L'inscription avec X (Twitter) sera disponible prochainement.",
      position: "top",
      timer: 3000,
      showConfirmButton: false,
      toast: true,
    });
  };

  return (
    <div className="w-full max-w-md overflow-y-auto no-scrollbar">
      <BackButton className="mb-8 w-full max-w-md" />

      <div className="inline-flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
        <div>
          <div className="text-sm font-semibold tracking-tight text-zinc-900">NFC.PRO</div>
          <div className="text-xs text-zinc-500">Créer un compte</div>
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Inscription</h1>
        <p className="mt-2 text-sm text-zinc-600">Créez votre compte administrateur pour gérer les commandes.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label>
                Prénom<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="sm:col-span-1">
              <Label>
                Nom<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label>
              Email<span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label>
              Mot de passe<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Créez un mot de passe sécurisé"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                disabled={isLoading}
              >
                {showPassword ? (
                  <FaEyeSlash className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <FaEye className="fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Minimum 8 caractères avec des lettres et chiffres
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              className="w-5 h-5 mt-1"
              checked={isChecked}
              onChange={setIsChecked}
              disabled={isLoading}
            />
            <p className="inline-block font-normal text-sm text-zinc-600">
              En créant un compte, vous acceptez les{' '}
              <span className="font-medium text-zinc-900">Conditions Générales</span> et notre{' '}
              <span className="font-medium text-zinc-900">Politique de Confidentialité</span>.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white transition rounded-2xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Création du compte...
                </span>
              ) : (
                "Créer un compte"
              )}
            </button>
          </div>

          <div className="text-sm text-zinc-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
              Se connecter
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs text-zinc-600">
              <strong>Premier compte admin</strong> : ce formulaire crée un compte administrateur.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}