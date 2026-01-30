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

function getStringParam(value: string | null): string {
  return (value ?? '').trim();
}

function getIntParam(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

type SortKey = 'createdAt' | 'amount' | 'status';

type SortDir = 'asc' | 'desc';

function getSortKey(v: string): SortKey {
  if (v === 'amount') return 'amount';
  if (v === 'status') return 'status';
  return 'createdAt';
}

function getSortDir(v: string): SortDir {
  if (v === 'asc') return 'asc';
  return 'desc';
}

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);

    const role = cookies.role;
    const r = String(role || '').toUpperCase();
    if (!r || (r !== 'ADMIN' && r !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const url = new URL(request.url);

    const q = getStringParam(url.searchParams.get('q'));
    const status = 'PAID';
    const cardType = getStringParam(url.searchParams.get('cardType')).toUpperCase();
    const sort = getSortKey(getStringParam(url.searchParams.get('sort')));
    const dir = getSortDir(getStringParam(url.searchParams.get('dir')));

    const period = getStringParam(url.searchParams.get('period')).toLowerCase();
    const start = getStringParam(url.searchParams.get('start'));
    const end = getStringParam(url.searchParams.get('end'));

    const page = getIntParam(url.searchParams.get('page'), 1);
    const pageSizeRaw = getIntParam(url.searchParams.get('pageSize'), 20);
    const pageSize = Math.min(Math.max(pageSizeRaw, 5), 100);

    const where: any = {};

    where.status = status;

    if (cardType) {
      where.cardType = cardType;
    }

    if (period) {
      const now = Date.now();
      if (period === '7d') {
        where.createdAt = { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      } else if (period === '30d') {
        where.createdAt = { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
      } else if (period === '90d') {
        where.createdAt = { gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
      } else if (period === 'custom') {
        const range: any = {};
        if (start) {
          const d = new Date(start);
          if (!Number.isNaN(d.getTime())) range.gte = d;
        }
        if (end) {
          const d = new Date(end);
          if (!Number.isNaN(d.getTime())) range.lte = d;
        }
        if (Object.keys(range).length > 0) where.createdAt = range;
      }
    }

    if (q) {
      where.OR = [
        { id: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { customerEmail: { contains: q, mode: 'insensitive' } },
        { nfcLink: { contains: q, mode: 'insensitive' } },
        { cardType: { contains: q, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { [sort]: dir },
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      items,
      total,
      page: Math.min(page, totalPages),
      pageSize,
      totalPages,
      sort,
      dir,
      status: status || null,
      cardType: cardType || null,
      period: period || null,
      start: start || null,
      end: end || null,
      q: q || null,
    });
  } catch (error) {
    console.error('Admin orders list error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
