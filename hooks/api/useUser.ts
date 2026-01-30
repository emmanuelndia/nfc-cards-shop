"use client";
import { useEffect, useState } from "react";

/**
 * Hook useUser
 * - lit le token dans localStorage("token")
 * - appelle GET /api/profile avec Authorization: Bearer <token>
 * - renvoie { user, loading, error } si besoin (ici on renvoie l'objet user pour compatibilité)
 */
export default function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/profile", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // si 401/403 ou autre, on vide l'user
          setUser(null);
          const txt = await res.text();
          setError(`HTTP ${res.status} - ${txt}`);
          return;
        }

        const json = await res.json();
        // Ton controller renvoie { status: true, message: "...", user: $user }
        const u = json?.user ?? json;
        setUser(u);
      } catch (err: any) {
        console.error("useUser error:", err);
        setError(err?.message || "Erreur réseau");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // retourne un objet pour plus de souplesse
  return { user, loading, error };
}
