"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AnimatedCardsHero() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/7 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative h-[360px]"
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-0.6, 0.6, -0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ y: -4, scale: 1.015 }}
          className="absolute left-0 top-6 w-[260px]"
        >
          <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_18px_55px_-35px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_26px_70px_-40px_rgba(0,0,0,0.45)]">
            <Image
              src="/cards/nfc-premium.jpg"
              alt="Carte NFC Métal Premium"
              fill
              className="object-cover"
              sizes="260px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0.8, -0.4, 0.8] }}
          transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ y: -4, scale: 1.015 }}
          className="absolute right-0 top-0 w-[300px]"
        >
          <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_18px_55px_-35px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_26px_70px_-40px_rgba(0,0,0,0.45)]">
            <Image
              src="/cards/nfc-pvc.jpg"
              alt="Carte NFC PVC Pro"
              fill
              className="object-cover"
              sizes="300px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, 0.4, 0] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ y: -4, scale: 1.015 }}
          className="absolute left-1/2 top-[165px] w-[280px] -translate-x-1/2"
        >
          <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_18px_55px_-35px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_26px_70px_-40px_rgba(0,0,0,0.45)]">
            <Image
              src="/cards/nfc-bois.jpg"
              alt="Carte NFC Bambou Éco"
              fill
              className="object-cover"
              sizes="280px"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -bottom-1 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-full bg-zinc-900/10 blur-2xl"
        />
      </motion.div>
    </div>
  );
}
