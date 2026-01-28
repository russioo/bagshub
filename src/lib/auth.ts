import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';
import type { AuthUser, AuthResponse } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = 'bagshub_token';

interface JwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Generate a JWT token
 */
export function generateToken(userId: string, username: string): string {
  return sign({ userId, username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Get the current user from the request cookies
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email || undefined,
    displayName: user.displayName || undefined,
    avatarUrl: user.avatarUrl || undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Register a new user
 */
export async function registerUser(
  username: string,
  password: string,
  email?: string
): Promise<AuthResponse> {
  // Check if username exists
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { username: username.toLowerCase() },
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  // Validate username
  if (username.length < 3 || username.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  // Validate password
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      username: username.toLowerCase(),
      email: email?.toLowerCase(),
      passwordHash,
      displayName: username,
    },
  });

  const token = generateToken(user.id, user.username);
  const decoded = verifyToken(token);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      displayName: user.displayName || undefined,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt.toISOString(),
    },
    token,
    expiresAt: decoded?.exp || 0,
  };
}

/**
 * Login a user
 */
export async function loginUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid username or password');
  }

  const token = generateToken(user.id, user.username);
  const decoded = verifyToken(token);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      displayName: user.displayName || undefined,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt.toISOString(),
    },
    token,
    expiresAt: decoded?.exp || 0,
  };
}

/**
 * Set auth cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Clear auth cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
