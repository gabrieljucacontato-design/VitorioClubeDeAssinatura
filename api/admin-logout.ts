import type { VercelRequest, VercelResponse } from "@vercel/node"
import { ADMIN_COOKIE_NAME } from "./_lib/adminAuth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." })
    return
  }
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  )
  res.status(200).json({ ok: true })
}
