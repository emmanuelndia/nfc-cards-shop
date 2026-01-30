import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID requis" }, { status: 400 });
    }

    // Récupérer la commande
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        id: true,
        amount: true,
        customerName: true,
        customerEmail: true,
        nfcNameOnCard: true,
        support: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Générer le contenu HTML de la facture
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture Commande ${order.id}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
            color: #1a202c;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        
        .invoice-header {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            padding: 40px;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .invoice-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        .invoice-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -5%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .invoice-title {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        
        .invoice-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .invoice-meta {
            display: flex;
            gap: 30px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .invoice-body {
            padding: 40px;
        }
        
        .invoice-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .info-box {
            background: #f8fafc;
            border-radius: 16px;
            padding: 30px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        
        .info-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .info-box h3 {
            color: #3b82f6;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-box h3::before {
            content: '';
            width: 4px;
            height: 16px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }
        
        .info-box p {
            color: #475569;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        
        .info-box .name {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }
        
        .info-box .email {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .product-details {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 40px;
            border: 1px solid #e2e8f0;
        }
        
        .product-details h3 {
            color: #1e293b;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .product-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .product-item {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        
        .product-item-label {
            font-size: 0.85rem;
            color: #64748b;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .product-item-value {
            font-size: 1rem;
            color: #1e293b;
            font-weight: 500;
        }
        
        .total-section {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 16px;
            padding: 30px;
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .total-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }
        
        .total-label {
            font-size: 1rem;
            opacity: 0.8;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .total-amount {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .total-status {
            display: inline-block;
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .invoice-footer {
            background: #f8fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-content {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.6;
        }
        
        .footer-brand {
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
            font-size: 1.1rem;
        }
        
        .footer-contact {
            margin-top: 12px;
        }
        
        .footer-contact a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .footer-contact a:hover {
            color: #2563eb;
        }
        
        @media (max-width: 768px) {
            .invoice-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .invoice-header {
                padding: 30px 20px;
            }
            
            .invoice-title {
                font-size: 2rem;
            }
            
            .invoice-body {
                padding: 30px 20px;
            }
            
            .total-amount {
                font-size: 2.5rem;
            }
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .invoice-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="header-content">
                <h1 class="invoice-title">Facture</h1>
                <p class="invoice-subtitle">Commande #${order.id}</p>
                <div class="invoice-meta">
                    <span>Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>Status: Payé</span>
                </div>
            </div>
        </div>

        <div class="invoice-body">
            <div class="invoice-grid">
                <div class="info-box">
                    <h3>Client</h3>
                    <p class="name">${order.customerName}</p>
                    <p class="email">${order.customerEmail}</p>
                </div>
                
                <div class="info-box">
                    <h3>Informations de livraison</h3>
                    <p>Standard (5-7 jours ouvrés)</p>
                    <p>France Métropolitaine</p>
                </div>
            </div>

            <div class="product-details">
                <h3>
                    <div class="product-icon">NFC</div>
                    Détails de votre commande
                </h3>
                <div class="product-grid">
                    <div class="product-item">
                        <div class="product-item-label">Produit</div>
                        <div class="product-item-value">Carte NFC Personnalisée</div>
                    </div>
                    <div class="product-item">
                        <div class="product-item-label">Support</div>
                        <div class="product-item-value">${order.support}</div>
                    </div>
                    <div class="product-item">
                        <div class="product-item-label">Nom sur carte</div>
                        <div class="product-item-value">${order.nfcNameOnCard || 'Non spécifié'}</div>
                    </div>
                    <div class="product-item">
                        <div class="product-item-label">Quantité</div>
                        <div class="product-item-value">1</div>
                    </div>
                </div>
            </div>

            <div class="total-section">
                <div class="total-label">Total à payer</div>
                <div class="total-amount">€${order.amount.toFixed(2)}</div>
                <div class="total-status">✓ Payé</div>
            </div>
        </div>

        <div class="invoice-footer">
            <div class="footer-content">
                <div class="footer-brand">NFC Cards Shop</div>
                <p>Merci pour votre confiance ! Votre carte NFC personnalisée est en cours de préparation.</p>
                <div class="footer-contact">
                    Contact: <a href="mailto:support@nfc-cards.fr">support@nfc-cards.fr</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Retourner le HTML (le frontend pourra convertir en PDF)
    return new Response(invoiceHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="facture-${order.id}.html"`,
      },
    });
  } catch (error) {
    console.error("Erreur génération facture:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
