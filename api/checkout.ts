import type { VercelRequest, VercelResponse } from "@vercel/node"
import { randomUUID } from "node:crypto"
import { getSupabaseAdmin } from "./_lib/supabase"
import { getPreferenceClient } from "./_lib/mercadopago"
import { resolveCartItem } from "../src/data/catalog"
import type {
  CheckoutCustomer,
  CheckoutRequestBody,
} from "../src/data/checkout-types"

const REQUIRED_FIELDS: Array<keyof CheckoutCustomer> = [
  "name",
  "email",
  "phone",
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." })
    return
  }

  const body = req.body as CheckoutRequestBody | undefined
  const customer = body?.customer
  const items = body?.items

  if (!customer || !items?.length) {
    res.status(400).json({ error: "Dados incompletos." })
    return
  }

  for (const field of REQUIRED_FIELDS) {
    if (!String(customer[field] ?? "").trim()) {
      res.status(400).json({ error: `Campo obrigatório ausente: ${field}` })
      return
    }
  }

  const resolvedItems: Array<{
    name: string
    price: number
    quantity: number
    kind: "plan" | "painting"
    planId?: number
  }> = []
  for (const item of items) {
    const resolved = resolveCartItem(String(item.id))
    if (!resolved || !Number.isInteger(item.quantity) || item.quantity < 1) {
      res.status(400).json({ error: `Item inválido: ${item.id}` })
      return
    }
    resolvedItems.push({ ...resolved, quantity: item.quantity })
  }

  const amount = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const planItem = resolvedItems.find((i) => i.kind === "plan")
  const orderType: "assinatura" | "compra" = planItem ? "assinatura" : "compra"
  const externalReference = randomUUID()

  const supabase = getSupabaseAdmin()
  const { error: insertError } = await supabase.from("orders").insert([
    {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cep: customer.cep,
      street: customer.street,
      number: customer.number,
      complement: customer.complement || null,
      neighborhood: customer.neighborhood,
      city: customer.city,
      state: customer.state,
      order_type: orderType,
      plan_id: planItem?.planId ?? null,
      plan_name: planItem?.name ?? null,
      items: resolvedItems.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      amount,
      external_reference: externalReference,
      status: "pendente",
    },
  ])

  if (insertError) {
    console.error("Erro ao salvar pedido no Supabase:", insertError)
    res.status(500).json({ error: "Erro ao registrar pedido." })
    return
  }

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`

  try {
    const preference = await getPreferenceClient().create({
      body: {
        items: resolvedItems.map((i) => ({
          id: i.name,
          title: i.name,
          quantity: i.quantity,
          unit_price: i.price,
          currency_id: "BRL",
        })),
        payer: { name: customer.name, email: customer.email },
        external_reference: externalReference,
        notification_url: `${siteUrl}/api/mercadopago-webhook`,
        back_urls: {
          success: `${siteUrl}/?status=approved`,
          pending: `${siteUrl}/?status=pending`,
          failure: `${siteUrl}/?status=failure`,
        },
        auto_return: "approved",
      },
    })

    await supabase
      .from("orders")
      .update({ mp_preference_id: preference.id })
      .eq("external_reference", externalReference)

    res.status(200).json({ init_point: preference.init_point })
  } catch (err) {
    console.error("Erro ao criar preferência no Mercado Pago:", err)
    res.status(500).json({ error: "Erro ao iniciar pagamento." })
  }
}
