import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import ExcelJS from 'exceljs';

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

const formatDateFr = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);

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

    const where: any = {};

    where.status = status;
    if (cardType) where.cardType = cardType;

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

    const orders = await prisma.order.findMany({
      where,
      orderBy: { [sort]: dir },
      take: 5000,
      include: { items: true },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NFC Cards Shop';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Commandes', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = [
      { header: 'ID', key: 'id', width: 34 },
      { header: 'Date', key: 'createdAt', width: 20 },
      { header: 'Statut', key: 'status', width: 12 },
      { header: 'Montant', key: 'amount', width: 12 },
      { header: 'Devise', key: 'currency', width: 8 },
      { header: 'Quantité', key: 'quantity', width: 10 },
      { header: 'Client', key: 'customerName', width: 22 },
      { header: 'Email', key: 'customerEmail', width: 26 },
      { header: 'Adresse', key: 'address', width: 30 },
      { header: 'Produit principal', key: 'cardType', width: 18 },
      { header: 'Détail articles', key: 'itemsSummary', width: 40 },
      { header: 'Lien NFC', key: 'nfcLink', width: 40 },
      { header: 'Nom sur carte', key: 'nfcNameOnCard', width: 18 },
      { header: 'Stripe Session', key: 'stripeSessionId', width: 28 },
    ];

    for (const o of orders) {
      const itemsSummary = (o.items ?? [])
        .map((it) => `${it.cardType} x${it.quantity}`)
        .join(' | ');

      sheet.addRow({
        id: o.id,
        createdAt: formatDateFr(o.createdAt),
        status: o.status,
        amount: o.amount,
        currency: String(o.currency || '').toUpperCase(),
        quantity: o.quantity,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        address: o.address ?? '',
        cardType: o.cardType,
        itemsSummary,
        nfcLink: o.nfcLink,
        nfcNameOnCard: o.nfcNameOnCard ?? '',
        stripeSessionId: o.stripeSessionId ?? '',
      });
    }

    const headerRow = sheet.getRow(1);
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF9CA3AF' } },
        left: { style: 'thin', color: { argb: 'FF9CA3AF' } },
        bottom: { style: 'thin', color: { argb: 'FF9CA3AF' } },
        right: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      };
    });

    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columnCount },
    };

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      row.height = 18;
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };
      });
    });

    sheet.getColumn('amount').numFmt = '#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Admin orders export xlsx error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
