"use client";

import GridShape from "@/components/common/GridShape";
/* import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo"; */

import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

function BusinessCardAnimation() {
  return (
    <div className="relative z-10">
      <div className="card-float relative h-64 w-[420px] [perspective:1200px]">
        <div className="card-tilt relative h-full w-full rounded-[28px] border border-white/30 bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur">
          <div className="absolute inset-0 overflow-hidden rounded-[28px]">
            <div className="card-shimmer absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-60" />
          </div>

          <div className="relative flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold tracking-wider text-zinc-600">NFC.PRO</div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">Carte NFC</div>
              </div>
              <div className="nfc-pulse relative h-10 w-10 rounded-2xl bg-accent-600" />
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-900">Votre Nom</div>
              <div className="mt-1 text-sm text-zinc-600">Fonction · Société</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-600">
                <div className="rounded-xl bg-white/70 px-3 py-2">linkedin.com/in/…</div>
                <div className="rounded-xl bg-white/70 px-3 py-2">contact@…</div>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-xs text-zinc-600">Tap to share</div>
              <div className="h-10 w-10 rounded-xl bg-zinc-900/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3 text-center text-xs text-zinc-700">
        <div className="rounded-2xl border border-white/30 bg-white/60 px-3 py-3">NFC</div>
        <div className="rounded-2xl border border-white/30 bg-white/60 px-3 py-3">QR</div>
        <div className="rounded-2xl border border-white/30 bg-white/60 px-3 py-3">Stripe</div>
      </div>

      <style jsx>{`
        .card-float {
          animation: cardFloat 6s ease-in-out infinite;
        }
        .card-tilt {
          transform: rotateX(10deg) rotateY(-16deg);
          transform-style: preserve-3d;
          animation: cardTilt 7.5s ease-in-out infinite;
        }
        .card-shimmer {
          transform: skewX(-12deg);
          animation: shimmer 3.5s ease-in-out infinite;
        }
        .nfc-pulse::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 18px;
          border: 1px solid rgba(70, 95, 255, 0.55);
          animation: nfcPulse 2.4s ease-out infinite;
        }
        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes cardTilt {
          0%,
          100% {
            transform: rotateX(10deg) rotateY(-16deg);
          }
          50% {
            transform: rotateX(6deg) rotateY(-10deg);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-120%) skewX(-12deg);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          50% {
            transform: translateX(220%) skewX(-12deg);
            opacity: 0;
          }
          100% {
            transform: translateX(220%) skewX(-12deg);
            opacity: 0;
          }
        }
        @keyframes nfcPulse {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-screen flex flex-col lg:flex-row">
      <ThemeProvider>
        {/* Partie gauche : formulaire */}
        <div className="lg:w-1/2 w-full flex items-center justify-center p-6 bg-white dark:bg-gray-900">
          {children}
        </div>

        {/* Partie droite : gradient doux animé */}
        <div className="lg:w-1/2 w-full relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* Gradient animé adouci */}
          <div className="absolute inset-0 animate-gradient bg-gradient-to-tr from-blue-200 via-indigo-200 to-purple-200 bg-[length:400%_400%]"></div>

          {/* Formes SVG flottantes */}
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="float1" cx="50" cy="50" r="50" fill="rgba(255,255,255,0.15)" />
            <circle className="float2" cx="150" cy="150" r="40" fill="rgba(255,255,255,0.1)" />
            <circle className="float3" cx="120" cy="80" r="30" fill="rgba(255,255,255,0.08)" />
          </svg>

          {/* Grid shapes si besoin */}
          <GridShape />

          <BusinessCardAnimation />
        </div>

        
      </ThemeProvider>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradientShift 20s ease infinite;
        }

        @keyframes float1Anim {
          0% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(15px,-10px) rotate(45deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
        @keyframes float2Anim {
          0% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-10px,10px) rotate(-30deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
        @keyframes float3Anim {
          0% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(8px,15px) rotate(60deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }

        .float1 { animation: float1Anim 8s ease-in-out infinite; }
        .float2 { animation: float2Anim 10s ease-in-out infinite; }
        .float3 { animation: float3Anim 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
