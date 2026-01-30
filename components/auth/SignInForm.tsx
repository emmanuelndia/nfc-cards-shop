"use client";

import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { BackButton } from "@/components/ui/button";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = identifier.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: "error",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs.",
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
      // Appel à votre API d'authentification
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/signin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Erreur de connexion",
          text: data.error || "Email ou mot de passe incorrect.",
          position: "top",
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          customClass: { container: "z-[999999]" },
        });
        return;
      }

      // Connexion réussie
      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        position: "top",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        customClass: { container: "z-[999999]" },
      });

      // Stocker les infos dans localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token || data.session?.access_token || '');
      localStorage.setItem("role", data.user.role);
      
      // Stocker dans les cookies avec des options complètes
      const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; ${cookieOptions}`;
      document.cookie = `role=${data.user.role}; ${cookieOptions}`;
      document.cookie = `token=${data.token || data.session?.access_token || ''}; ${cookieOptions}`;
      
      // Attendre un peu pour que les cookies soient bien définis
      setTimeout(() => {
        // Redirection selon le rôle
        if (data.user.role === "ADMIN" || data.user.role === "SUPERADMIN") {
          window.location.href = "/admin"; // Utiliser window.location pour recharger la page
        } else {
          window.location.href = "/user";
        }
      }, 500);
    } catch (error) {
      console.error("Erreur de connexion:", error);
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

  return (
    <div className="w-full max-w-md">
      <BackButton className="mb-8 w-full max-w-md" />

      <div className="inline-flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
        <div>
          <div className="text-sm font-semibold tracking-tight text-zinc-900">NFC.PRO</div>
          <div className="text-xs text-zinc-500">Espace administration</div>
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Connexion</h1>
        <p className="mt-2 text-sm text-zinc-600">Accédez au panneau d’administration.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-5">
          <div>
            <Label>
              Login ou Email <span className="text-error-500">*</span>
            </Label>
            <Input
              name="identifier"
              placeholder="login ou email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label>
              Mot de passe <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
                minLength={6}
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
          </div>

          <div>
            <Button
              className="
                w-full 
                bg-zinc-900
                hover:!bg-zinc-800
                text-white
                disabled:!bg-zinc-900/50
                disabled:cursor-not-allowed
                disabled:hover:!bg-zinc-900/50
                transition-colors duration-200
              "
              size="sm"
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </div>

          <div className="pt-2 text-sm text-zinc-600">
            Besoin d’un accès ? Contactez l’administrateur.
          </div>
        </div>
      </form>
    </div>
  );
}