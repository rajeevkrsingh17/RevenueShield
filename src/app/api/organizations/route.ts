import { NextResponse } from 'next/server';
import { getSessionUser, signToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch all organizations
  const orgs = await db.organization.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, demoSandboxMode: true },
  });

  return NextResponse.json({
    activeOrgId: user.organizationId,
    organizations: orgs,
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { organizationId } = await req.json();

  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  const org = await db.organization.findUnique({ where: { id: organizationId } });
  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  // Issue new token with switched organizationId
  const newToken = signToken({ userId: user.id, organizationId: org.id });

  const response = NextResponse.json({
    success: true,
    activeOrg: { id: org.id, name: org.name },
  });

  response.cookies.set('rs_session_token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}
