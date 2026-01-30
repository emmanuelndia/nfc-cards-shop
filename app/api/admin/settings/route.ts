import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);

    const role = cookies.role;
    const r = String(role || '').toUpperCase();
    if (!r || (r !== 'ADMIN' && r !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const userRaw = cookies.user;
    if (!userRaw) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    let userCookie: any;
    try {
      userCookie = JSON.parse(decodeURIComponent(userRaw));
    } catch {
      return NextResponse.json({ error: 'Cookie utilisateur invalide' }, { status: 400 });
    }

    const { email, currentPassword, newPassword } = await request.json();

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: 'Mot de passe actuel requis' }, { status: 400 });
    }

    const userId = String(userCookie?.id || '');
    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur invalide' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true, role: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    if (String(user.role || '').toUpperCase() !== 'ADMIN' && String(user.role || '').toUpperCase() !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 401 });
    }

    const data: any = {};

    if (email !== undefined) {
      const emailStr = String(email).trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailStr)) {
        return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
      }
      data.email = emailStr;
    }

    if (newPassword !== undefined) {
      const pwd = String(newPassword);
      if (pwd.length < 8) {
        return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
      }
      data.password = await bcrypt.hash(pwd, 10);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true });
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
