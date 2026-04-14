import "server-only";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "closet_admin";
const ONE_WEEK = 60 * 60 * 24 * 7;

function hashPw(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function getAdminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (!p || p.length < 4) return null;
  return p;
}

export async function isAdminAuthed(): Promise<boolean> {
  const pw = getAdminPassword();
  if (!pw) return false;
  const jar = await cookies();
  const c = jar.get(COOKIE)?.value;
  if (!c) return false;
  const expected = hashPw(pw);
  try {
    const a = Buffer.from(c, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function loginAdmin(pw: string): Promise<boolean> {
  const expected = getAdminPassword();
  if (!expected) return false;
  if (pw.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(pw), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  const jar = await cookies();
  jar.set(COOKIE, hashPw(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK,
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
