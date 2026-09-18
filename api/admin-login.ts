import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  ADMIN_COOKIE_NAME,
  checkAdminPassword,
  createAdminSessionToken,
} from "./_lib/adminAuth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." })
    return
  }

  const password = (req.body as { password?: string } | undefined)?.password
  if (!password || !checkAdminPassword(password)) {
    res.status(401).json({ error: "Senha incorreta." })
    return
  }

  const token = createAdminSessionToken()
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${12 * 60 * 60}`,
  )
  res.status(200).json({ ok: true })
}
