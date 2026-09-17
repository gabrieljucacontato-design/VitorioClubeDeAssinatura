import type { VercelRequest, VercelResponse } from "@vercel/node"
import { isAdminRequestAuthenticated } from "./_lib/adminAuth"
import { getSupabaseAdmin } from "./_lib/supabase"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método não permitido." })
    return
  }

  if (!isAdminRequestAuthenticated(req)) {
    res.status(401).json({ error: "Não autenticado." })
    return
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar pedidos:", error)
    res.status(500).json({ error: "Erro ao buscar pedidos." })
    return
  }

  res.status(200).json({ orders: data })
}
