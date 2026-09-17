import { createHmac, timingSafeEqual } from "node:crypto"
import type { VercelRequest } from "@vercel/node"

export const ADMIN_COOKIE_NAME = "vitorio_admin_session"
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000 // 12h

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("ADMIN_SESSION_SECRET não configurado.")
  return secret
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

/** Cria um token assinado `expiresAt.signature` para o cookie de sessão do admin. */
export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const payload = String(expiresAt)
  return `${payload}.${sign(payload)}`
}

/** Verifica o token do cookie de sessão do admin. */
export function verifyAdminSessionToken(
  token: string | undefined | null,
): boolean {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  const expected = sign(payload)
  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expected)
  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  )
    return false

  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && Date.now() < expiresAt
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error("ADMIN_PASSWORD não configurado.")
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {}
  return Object.fromEntries(header.split(";").map((part) => {
      const idx = part.indexOf("=")
      if (idx === -1) return [part.trim(), ""]
      return [
        part.slice(0, idx).trim(),
        decodeURIComponent(part.slice(idx + 1).trim()),
      ]
    }))
}

export function isAdminRequestAuthenticated(req: VercelRequest): boolean {
  const cookies = parseCookies(req.headers.cookie)
  return verifyAdminSessionToken(cookies[ADMIN_COOKIE_NAME])
}
