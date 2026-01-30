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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = requireSuperAdmin(request);
    if (forbidden) return forbidden;

    const { id } = await params;
    const body = await request.json();

    const name = body?.name !== undefined ? String(body.name).trim() : undefined;
    const login = body?.login !== undefined ? String(body.login).trim() : undefined;
    const email = body?.email !== undefined ? String(body.email).trim().toLowerCase() : undefined;
    const role = body?.role !== undefined ? String(body.role).trim().toUpperCase() : undefined;
    const password = body?.password !== undefined ? String(body.password) : undefined;

    const data: any = {};
    if (name !== undefined) data.name = name;

    if (login !== undefined) {
      if (!login) {
        return NextResponse.json({ error: 'Login requis' }, { status: 400 });
      }
      data.login = login;
    }

    if (email !== undefined) {
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
        }
        data.email = email;
      } else {
        data.email = null;
      }
    }

    if (login !== undefined || email !== undefined) {
      const or: any[] = [];
      if (login !== undefined) or.push({ login });
      if (email !== undefined && email) or.push({ email });

      if (or.length > 0) {
        const existing = await prisma.user.findFirst({
          where: {
            OR: or,
            NOT: { id },
          },
          select: { id: true },
        });
        if (existing) {
          return NextResponse.json({ error: 'Login ou email déjà utilisé' }, { status: 409 });
        }
      }
    }

    if (role !== undefined) {
      if (!['USER', 'ADMIN', 'SUPERADMIN'].includes(role)) {
        return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
      }
      data.role = role;
    }

    if (password !== undefined) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'Mot de passe trop court (min 8)' }, { status: 400 });
      }
      data.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        login: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Admin users update error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const forbidden = requireSuperAdmin(request);
    if (forbidden) return forbidden;

    const { id } = await params;

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin users delete error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
