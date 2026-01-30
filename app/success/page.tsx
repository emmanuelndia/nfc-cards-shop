// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/react";
import { CheckCircle, Package, Mail, Download, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface OrderDetails {
  id: string;
  status: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  nfcLink: string;
  cardName: string;
  cardMessage: string;
  support: string;
  logoUrl: string;
  logoScale: string;
  logoColor: string;
  supportColor: string;
  textColor: string;
  secondaryText: string;
  createdAt: string;
  stripeSessionId: string;
  estimatedDelivery: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clear } = useCart();

  useEffect(() => {
    if (sessionId) {
      clear();
      fetchOrderDetails();
    }
  }, [sessionId, clear]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Commande non trouvée');
      }
      
      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      console.error('Erreur récupération commande:', err);
      setError('Impossible de récupérer les détails de votre commande');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`/api/orders/${sessionId}/invoice`);
      const htmlContent = await response.text();
      
      // Créer un blob et télécharger
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${order?.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement facture:', err);
    }
  };

  const duplicateOrder = () => {
    if (!order) return;
    
    // Rediriger vers la page de checkout avec les paramètres de personnalisation
    const params = new URLSearchParams({
      product: '1', // À adapter selon votre produit
      support: order.support,
      cardName: order.cardName,
      cardMessage: order.cardMessage,
      nfcLink: order.nfcLink,
      textColor: order.textColor,
      secondaryText: order.secondaryText,
    });
    
    window.location.href = `/checkout?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-lg text-gray-600 mb-8">{error}</p>
          <Link href="/">
            <Button color="primary" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paiement confirmé ! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre commande. Votre carte NFC personnalisée est en préparation.
          </p>
        </div>

        {/* Carte personnalisée - Aperçu final */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Votre carte NFC personnalisée</h2>
          
          <div className={`rounded-2xl border shadow-xl overflow-hidden mx-auto`} style={{ 
            backgroundColor: order.support === "WHITE" ? (order.logoColor || "#FFFFFF") : (order.supportColor || "#000000"),
            borderColor: order.support === "WHITE" ? (order.supportColor || "#000000") : undefined,
            maxWidth: "400px"
          }}>
            <div className={`p-6`} style={{
              color: order.textColor || (order.support === "WHITE" ? "#000000" : "#FFFFFF")
            }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    Aperçu
                  </div>
                  <div className="mt-1 text-sm opacity-70">Support: {order.support}</div>
                </div>
                <div 
                  className="h-10 w-10 rounded-xl" 
                  style={{ 
                    backgroundColor: order.support === "WHITE" ? (order.logoColor || "#FFFFFF") : (order.supportColor || "#000000"),
                    borderColor: order.support === "WHITE" ? (order.supportColor || "#000000") : undefined
                  }}
                />
              </div>

              <div className="mt-6 flex items-center gap-6">
                {order.logoUrl ? (
                  <img
                    src={order.logoUrl}
                    alt="Logo"
                    className="h-16 w-16 rounded-xl bg-white/90 object-contain p-2 flex-shrink-0"
                    style={{ 
                      transform: `scale(${Math.min(Number(order.logoScale) || 1, 1.2)})`, 
                      transformOrigin: "left center",
                      maxWidth: "64px",
                      borderColor: order.support === "WHITE" ? (order.supportColor || "#000000") : undefined
                    }}
                  />
                ) : (
                  <div className={`h-16 w-16 rounded-xl border flex items-center justify-center text-xs flex-shrink-0`} style={{
                    borderColor: order.support === "WHITE" ? (order.supportColor || "#000000") : undefined,
                    color: order.support === "WHITE" ? "#6b7280" : "#d1d5db"
                  }}>
                    Logo
                  </div>
                )}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="text-lg font-bold truncate">
                    {order.cardName || "Nom sur la carte"}
                  </div>
                  <div className="text-sm truncate">
                    {order.secondaryText || "Texte secondaire"}
                  </div>
                  <div className="text-xs mt-2 truncate">
                    {order.nfcLink || "Lien NFC"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Récapitulatif commande */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif de votre commande</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">Numéro de commande</div>
                  <div className="text-sm text-gray-500">{order.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">€{(order.amount / 100).toFixed(2)}</div>
                <div className="text-sm text-green-600 font-medium">Payé</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="font-medium mb-2">Détails de la personnalisation</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Support:</span> {order.support}
                </div>
                <div>
                  <span className="text-gray-500">Nom:</span> {order.cardName}
                </div>
                {order.secondaryText && (
                  <div>
                    <span className="text-gray-500">Texte secondaire:</span> {order.secondaryText}
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Lien NFC:</span> {order.nfcLink}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="font-medium mb-2">Client</div>
              <div className="text-gray-600">{order.customerName}</div>
              <div className="text-gray-500 text-sm">{order.customerEmail}</div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="font-medium mb-2">Livraison estimée</div>
              <div className="text-gray-600">
                {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions prioritaires */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              color="primary"
              className="bg-gradient-to-r from-blue-600 to-purple-600 py-6"
              startContent={<Download className="h-4 w-4" />}
              onClick={downloadInvoice}
            >
              Télécharger la facture
            </Button>
            
            <Button
              variant="bordered"
              className="border-gray-300 py-6"
              startContent={<RefreshCw className="h-4 w-4" />}
              onClick={duplicateOrder}
            >
              Commander identique
            </Button>
          </div>
        </div>

        {/* Prochaines étapes */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prochaines étapes</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <div className="font-medium">Téléchargement de la facture</div>
                <div className="text-gray-600 text-sm">
                  Votre facture est disponible pour téléchargement
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <div className="font-medium">Préparation de la carte</div>
                <div className="text-gray-600 text-sm">
                  Notre équipe personnalise votre carte NFC (2-3 jours)
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <div className="font-medium">Expédition et suivi</div>
                <div className="text-gray-600 text-sm">
                  Vous recevrez un email avec le numéro de suivi
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="flex-1">
            <Button
              fullWidth
              variant="bordered"
              className="border-gray-300 py-6"
            >
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:support@nfc-cards.fr" className="text-blue-600 hover:underline">
            support@nfc-cards.fr
          </a>
        </div>
      </div>
    </div>
  );
}