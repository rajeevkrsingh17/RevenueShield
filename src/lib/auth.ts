import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'revenueshield-secret-key-production-2026';
const TOKEN_COOKIE = 'rs_session_token';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; organizationId: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; organizationId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; organizationId: string };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_COOKIE)?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { organization: true },
    });

    if (!user) return null;

    // Use organizationId from payload if active org was switched, or fallback to user's org
    const targetOrgId = payload.organizationId || user.organizationId;
    const org = await db.organization.findUnique({ where: { id: targetOrgId } });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: org ? org.id : user.organizationId,
      organizationName: org ? org.name : user.organization.name,
    };
  } catch {
    return null;
  }
}

export async function requireAuthUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}
