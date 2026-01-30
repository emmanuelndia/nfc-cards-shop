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

function requireSuperAdmin(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  const role = String(cookies.role || '').toUpperCase();
  if (role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const forbidden = requireSuperAdmin(request);
    if (forbidden) return forbidden;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        login: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 2000,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const forbidden = requireSuperAdmin(request);
    if (forbidden) return forbidden;

    const body = await request.json();
    const name = String(body?.name || '').trim();
    const login = String(body?.login || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const role = String(body?.role || 'USER').trim().toUpperCase();

    if (!name || !login || !password) {
      return NextResponse.json({ error: 'Champs requis: name, login, password' }, { status: 400 });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
      }
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Mot de passe trop court (min 8)' }, { status: 400 });
    }

    if (!['USER', 'ADMIN', 'SUPERADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ login }, ...(email ? [{ email }] : [])],
      },
      select: { id: true, login: true, email: true },
    });
    if (existing) {
      return NextResponse.json({ error: 'Login ou email déjà utilisé' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        login,
        email,
        password: hashedPassword,
        role,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        login: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Admin users create error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
