import { MercadoPagoConfig, Preference, Payment } from "mercadopago"

let config: MercadoPagoConfig | null = null

function getConfig() {
  if (config) return config
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) throw new Error("MP_ACCESS_TOKEN não configurado.")
  config = new MercadoPagoConfig({ accessToken })
  return config
}

export function getPreferenceClient() {
  return new Preference(getConfig())
}

export function getPaymentClient() {
  return new Payment(getConfig())
}
