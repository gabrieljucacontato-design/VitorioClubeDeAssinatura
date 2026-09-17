import type { VercelRequest, VercelResponse } from "@vercel/node"
import { getSupabaseAdmin, type OrderRow } from "./_lib/supabase"
import { getPaymentClient } from "./_lib/mercadopago"
import { notifyOwnerOfNewOrder } from "./_lib/resend"

const STATUS_MAP: Record<string, OrderRow["status"]> = {
  approved: "pago",
  rejected: "recusado",
  cancelled: "cancelado",
  refunded: "cancelado",
  charged_back: "cancelado",
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).end()
    return
  }

  // Mercado Pago aceita tanto o formato legado (query ?topic=payment&id=...)
  // quanto o atual (body { type: 'payment', data: { id } }).
  const type =
    req.query.type as string ||
    req.query.topic as string ||
    req.body?.type as string
  const paymentId =
    req.query["data.id"] as string ||
    req.query.id as string ||
    req.body?.data?.id as string

  // Sempre respondemos 200 rápido: é o que o Mercado Pago espera, mesmo
  // quando o evento não é interessante pra nós (ex.: merchant_order) ou dá erro
  // que não seria resolvido por retry.
  try {
    if (type !== "payment" || !paymentId) {
      res.status(200).json({ received: true })
      return
    }

    const payment = await getPaymentClient().get({ id: paymentId })
    const externalReference = payment.external_reference
    if (!externalReference) {
      res.status(200).json({ received: true })
      return
    }

    const supabase = getSupabaseAdmin()
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("external_reference", externalReference)
      .single<OrderRow>()

    if (!order) {
      res.status(200).json({ received: true })
      return
    }

    const newStatus = STATUS_MAP[payment.status ?? ""] ?? "pendente"
    const wasAlreadyPaid = order.status === "pago"
    const paymentMethod = payment.payment_method_id ?? null

    await supabase
      .from("orders")
      .update({
        status: newStatus,
        mp_payment_id: String(payment.id),
        payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq("external_reference", externalReference)

    if (newStatus === "pago" && !wasAlreadyPaid) {
      await notifyOwnerOfNewOrder({
        ...order,
        status: "pago",
        payment_method: paymentMethod,
      })
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error("Erro no webhook do Mercado Pago:", err)
    res.status(200).json({ received: true })
  }
}
