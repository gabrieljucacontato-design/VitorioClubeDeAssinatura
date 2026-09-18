import { Resend } from "resend"
import type { OrderRow } from "./supabase.js"

let client: Resend | null = null

function getClient() {
  if (client) return client
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY não configurado.")
  client = new Resend(apiKey)
  return client
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

/** Notifica o dono do site por e-mail quando um pagamento é aprovado. */
export async function notifyOwnerOfNewOrder(order: OrderRow) {
  const ownerEmail = process.env.OWNER_EMAIL
  const fromEmail = process.env.EMAIL_FROM || "Vitório <onboarding@resend.dev>"
  if (!ownerEmail) throw new Error("OWNER_EMAIL não configurado.")

  const itemsList = order.items?.length
    ? order.items
        .map((i) => `<li>${i.quantity}x ${i.name} — ${fmt(i.price)}</li>`)
        .join("")
    : ""

  const html = `
    <h2>${
      order.order_type === "assinatura" ? "Nova assinatura" : "Nova compra"
    } — Vitório</h2>
    <p><strong>Cliente:</strong> ${order.name}</p>
    <p><strong>E-mail:</strong> ${order.email}</p>
    <p><strong>Telefone:</strong> ${order.phone}</p>
    <p><strong>Endereço:</strong> ${order.street}, ${order.number}${
      order.complement ? ` - ${order.complement}` : ""
    }, ${order.neighborhood}, ${order.city}/${order.state} — CEP ${order.cep}</p>
    ${
      order.plan_name ? `<p><strong>Plano:</strong> ${order.plan_name}</p>` : ""
    }
    ${itemsList ? `<p><strong>Itens:</strong></p><ul>${itemsList}</ul>` : ""}
    <p><strong>Valor total:</strong> ${fmt(order.amount)}</p>
    <p><strong>Forma de pagamento:</strong> ${order.payment_method ?? "não informado"}</p>
    <p><strong>Status:</strong> ${order.status}</p>
  `

  await getClient().emails.send({
    from: fromEmail,
    to: ownerEmail,
    subject: `✦ ${
      order.order_type === "assinatura" ? "Nova assinatura" : "Nova compra"
    }: ${order.name}`,
    html,
  })
}
