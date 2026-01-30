// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from "@/lib/db";


export async function POST(request: NextRequest) {
  try {
    const { identifier, email, password } = await request.json();
    const rawIdentifier = String(identifier ?? email ?? '').trim();


    // Validation des champs
    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: 'Login/email et mot de passe requis' },
        { status: 400 }
      );
    }


    // Recherche de l'utilisateur
    const identLower = rawIdentifier.toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ login: rawIdentifier }, { email: identLower }],
      },
      select: {
        id: true,
        name: true,
        login: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });


    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    // Vérification des droits admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      );
    }

    // Retourner les informations utilisateur (sans le mot de passe)
    const { password: _password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      session: {
        access_token: 'generated_token_here', // À remplacer par JWT ou session réelle
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}