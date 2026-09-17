import { createClient } from "@supabase/supabase-js"

// Declarados como `type` (não `interface`) de propósito: o postgrest-js exige
// que Row/Insert/Update sejam estruturalmente compatíveis com `Record<string, unknown>`,
// o que só funciona com a assinatura de índice implícita que o TypeScript dá a
// tipos-objeto literais — o mesmo padrão usado pelos tipos gerados pelo Supabase CLI.
export type OrderRow = {
  id: string
  created_at: string
  updated_at: string
  name: string
  email: string
  phone: string
  cep: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  order_type: "assinatura" | "compra"
  plan_id: number | null
  plan_name: string | null
  items: Array<{ name: string; price: number; quantity: number }>
  amount: number
  external_reference: string
  mp_preference_id: string | null
  mp_payment_id: string | null
  payment_method: string | null
  status: "pendente" | "pago" | "recusado" | "cancelado"
}

type Database = {
  public: {
    Tables: {
      orders: {
        Row: OrderRow
        Insert: Partial<OrderRow> & Pick<OrderRow, "name" | "email" | "phone" | "cep" | "street" | "number" | "neighborhood" | "city" | "state" | "order_type" | "items" | "amount" | "external_reference" | "status">
        Update: Partial<OrderRow>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

let client: ReturnType<typeof createClient<Database>> | null = null

/** Cliente Supabase com a Service Role Key — só pode ser usado no servidor (api/*). */
export function getSupabaseAdmin() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas.",
    )
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  })
  return client
}
