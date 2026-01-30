// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Disable public signup cleanly without unreachable code and TypeScript errors.
 * Remove unused imports and Prisma disconnect.
 */
export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: 'Inscription désactivée. Contactez un administrateur.' },
    { status: 403 },
  );
}