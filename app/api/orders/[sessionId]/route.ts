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

    // Récupérer la commande par sessionId
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        id: true,
        status: true,
        amount: true,
        customerName: true,
        customerEmail: true,
        nfcLink: true,
        nfcNameOnCard: true,
        support: true,
        logoUrl: true,
        logoScale: true,
        logoColor: true,
        secondaryText: true,
        createdAt: true,
        stripeSessionId: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Calculer la date de livraison estimée (5 jours ouvrés)
    const estimatedDelivery = new Date(order.createdAt);
    let daysAdded = 0;
    while (daysAdded < 5) {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);
      const dayOfWeek = estimatedDelivery.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Pas weekend
        daysAdded++;
      }
    }

    // Mapper les champs pour correspondre à l'interface attendue
    const mappedOrder = {
      ...order,
      cardName: order.nfcNameOnCard || "",
      cardMessage: "", // Champ non existant dans le schéma
      supportColor: "#000000", // Valeur par défaut
      textColor: "#000000", // Valeur par défaut
      estimatedDelivery: estimatedDelivery.toISOString(),
    };

    return NextResponse.json(mappedOrder);
  } catch (error) {
    console.error("Erreur récupération commande:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
