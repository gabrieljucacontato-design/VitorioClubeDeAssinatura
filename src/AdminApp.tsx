import { useEffect, useState } from "react"
import logoImg from "@/imports/logo.png"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  created_at: string
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
  plan_name: string | null
  items: OrderItem[]
  amount: number
  payment_method: string | null
  status: "pendente" | "pago" | "recusado" | "cancelado"
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
const fmtDate = (iso: string) => new Date(iso).toLocaleString("pt-BR")

const STATUS_LABEL: Record<Order["status"], {
  label: string
  bg: string
  color: string
}> = {
  pago: { label: "Pago", bg: "#d4e8cf", color: "#2a3f24" },
  pendente: { label: "Pendente", bg: "#fce8c8", color: "#c47832" },
  recusado: { label: "Recusado", bg: "#f6d4d0", color: "#a33" },
  cancelado: { label: "Cancelado", bg: "#e8e0d0", color: "#6a6a5a" },
}

export default function AdminApp() {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadError, setLoadError] = useState("")

  const loadOrders = async () => {
    const resp = await fetch("/api/admin-subscribers")
    if (resp.status === 401) {
      setAuthenticated(false)
      return
    }
    if (!resp.ok) {
      setLoadError("Erro ao carregar assinantes.")
      return
    }
    const data = await resp.json()
    setOrders(data.orders ?? [])
    setAuthenticated(true)
    setLoadError("")
  }

  useEffect(() => {
    loadOrders().finally(() => setChecking(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    try {
      const resp = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        throw new Error(data.error || "Senha incorreta.")
      }
      setPassword("")
      await loadOrders()
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Erro ao entrar.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" })
    setAuthenticated(false)
    setOrders([])
  }

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f5f0e8" }}
      >
        <span
          style={{
            fontFamily: "'Fredoka', sans-serif",
            color: "#2a3f24",
            fontWeight: 700,
          }}
        >
          Carregando…
        </span>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#2a3f24" }}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl p-8 space-y-5"
          style={{ background: "#f5f0e8", border: "3px solid #1d2e19" }}
        >
          <div className="flex flex-col items-center gap-3 mb-2">
            <img
              src={logoImg}
              alt="Vitório"
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <h1
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.5rem",
                color: "#1a1a14",
                fontWeight: 700,
              }}
            >
              Painel do Vitório
            </h1>
          </div>
          <div>
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#5a5a4a",
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              Senha de acesso
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                background: "#fff",
                border: "2px solid #e8e0d0",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            />
          </div>
          {loginError && (
            <p
              style={{ color: "#c0392b", fontSize: "0.85rem", fontWeight: 700 }}
            >
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{
              background: "#c47832",
              color: "#f5f0e8",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "1.05rem",
            }}
          >
            {loginLoading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    )
  }

  const totalPago = orders
    .filter((o) => o.status === "pago")
    .reduce((s, o) => s + Number(o.amount), 0)

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "#f5f0e8", fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Vitório"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <h1
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.6rem",
                color: "#1a1a14",
                fontWeight: 700,
              }}
            >
              Painel de Assinantes e Pedidos
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{
              background: "#2a3f24",
              color: "#f5f0e8",
              fontFamily: "'Fredoka', sans-serif",
            }}
          >
            Sair
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["Total de pedidos", String(orders.length)],
            ["Pagos", String(orders.filter((o) => o.status === "pago").length)],
            ["Receita confirmada", fmt(totalPago)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="p-5 rounded-2xl"
              style={{ background: "#fff", border: "2px solid #e8e0d0" }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#9a9a8a",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "1.6rem",
                  color: "#c47832",
                  fontWeight: 700,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {loadError && (
          <p style={{ color: "#c0392b", fontWeight: 700 }}>{loadError}</p>
        )}

        <div
          className="rounded-2xl overflow-x-auto"
          style={{ background: "#fff", border: "2px solid #e8e0d0" }}
        >
          <table className="w-full text-sm" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#2a3f24", color: "#f5f0e8" }}>
                {[
                  "Data",
                  "Cliente",
                  "Contato",
                  "Endereço",
                  "Pedido",
                  "Valor",
                  "Pagamento",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-bold"
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontSize: "0.82rem",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center"
                    style={{ color: "#9a9a8a", fontWeight: 600 }}
                  >
                    Nenhum pedido ainda.
                  </td>
                </tr>
              )}
              {orders.map((o) => {
                const st = STATUS_LABEL[o.status]
                return (
                  <tr key={o.id} style={{ borderTop: "1.5px solid #e8e0d0" }}>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ color: "#6a6a5a", fontWeight: 600 }}
                    >
                      {fmtDate(o.created_at)}
                    </td>
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ color: "#1a1a14" }}
                    >
                      {o.name}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#4a4a3a", fontWeight: 600 }}
                    >
                      <div>{o.email}</div>
                      <div style={{ color: "#8a8a7a", fontSize: "0.8rem" }}>
                        {o.phone}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{
                        color: "#4a4a3a",
                        fontWeight: 600,
                        maxWidth: 240,
                      }}
                    >
                      {o.street}, {o.number}
                      {o.complement ? ` - ${o.complement}` : ""}
                      <br />
                      <span style={{ color: "#8a8a7a", fontSize: "0.8rem" }}>
                        {o.neighborhood}, {o.city}/{o.state} — {o.cep}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#4a4a3a", fontWeight: 600 }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        {o.order_type === "assinatura"
                          ? o.plan_name
                          : "Compra avulsa"}
                      </div>
                      {o.items?.length > 0 && (
                        <div style={{ color: "#8a8a7a", fontSize: "0.78rem" }}>
                          {o.items
                            .map((i) => `${i.quantity}x ${i.name}`)
                            .join(", ")}
                        </div>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 font-bold whitespace-nowrap"
                      style={{ color: "#c47832" }}
                    >
                      {fmt(Number(o.amount))}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "#4a4a3a", fontWeight: 600 }}
                    >
                      {o.payment_method ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
