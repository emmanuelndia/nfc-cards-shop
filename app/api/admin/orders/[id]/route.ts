import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

function parseCookies(cookieHeader: string | null) {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(';');
  for (const p of parts) {
    const [k, ...rest] = p.split('=');
    const key = k?.trim();
    if (!key) continue;
    out[key] = rest.join('=').trim();
  }
  return out;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);

    const role = cookies.role;
    const r = String(role || '').toUpperCase();
    if (!r || (r !== 'ADMIN' && r !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Admin order get error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);

    const role = cookies.role;
    const r = String(role || '').toUpperCase();
    if (!r || (r !== 'ADMIN' && r !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const status = String(body?.status || '').trim().toUpperCase();
    if (!status) {
      return NextResponse.json({ error: 'Statut requis' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error('Admin order patch error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
