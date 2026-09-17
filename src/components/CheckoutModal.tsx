import { useState } from "react"
import type { CheckoutCustomer } from "@/data/checkout-types"

export type { CheckoutCustomer }

interface CartItemLike {
  id: number | string
  quantity: number
}

interface CheckoutModalProps {
  cart: CartItemLike[]
  total: number
  fmt: (n: number) => string
  onClose: () => void
}

const EMPTY_CUSTOMER: CheckoutCustomer = {
  name: "",
  email: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
}

const FIELD_STYLE: React.CSSProperties = {
  background: "#f8f4ee",
  border: "2px solid #e8e0d0",
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#1a1a14",
  fontFamily: "'Nunito', sans-serif",
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "#5a5a4a",
  display: "block",
  marginBottom: "0.35rem",
}

export default function CheckoutModal({
  cart,
  total,
  fmt,
  onClose,
}: CheckoutModalProps) {
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY_CUSTOMER)
  const [cepLoading, setCepLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const setField =
    (field: keyof CheckoutCustomer) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCustomer((prev) => ({ ...prev, [field]: e.target.value }))

  const lookupCep = async () => {
    const digits = customer.cep.replace(/\D/g, "")
    if (digits.length !== 8) return
    setCepLoading(true)
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await resp.json()
      if (!data.erro) {
        setCustomer((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }))
      }
    } catch {
      // Falha silenciosa: o usuário ainda pode preencher o endereço manualmente.
    } finally {
      setCepLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map((item) => ({
            id: String(item.id),
            quantity: item.quantity,
          })),
        }),
      })
      const data = await resp.json()
      if (!resp.ok || !data.init_point) {
        throw new Error(data.error || "Não foi possível iniciar o pagamento.")
      }
      window.location.href = data.init_point
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado. Tente novamente.",
      )
      setLoading(false)
    }
  }

  const fields: Array<{
    id: keyof CheckoutCustomer
    label: string
    placeholder: string
    type: string
    required: boolean
    onBlur?: () => void
    loadingHint?: boolean
  }> = [
    {
      id: "name",
      label: "Nome completo *",
      placeholder: "João Silva",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "E-mail *",
      placeholder: "joao@email.com",
      type: "email",
      required: true,
    },
    {
      id: "phone",
      label: "Telefone/WhatsApp *",
      placeholder: "(11) 99999-9999",
      type: "tel",
      required: true,
    },
    {
      id: "cep",
      label: "CEP *",
      placeholder: "00000-000",
      type: "text",
      required: true,
      onBlur: lookupCep,
      loadingHint: cepLoading,
    },
    {
      id: "street",
      label: "Rua *",
      placeholder: "Rua das Flores",
      type: "text",
      required: true,
    },
    {
      id: "number",
      label: "Número *",
      placeholder: "123",
      type: "text",
      required: true,
    },
    {
      id: "complement",
      label: "Complemento",
      placeholder: "Apto 45",
      type: "text",
      required: false,
    },
    {
      id: "neighborhood",
      label: "Bairro *",
      placeholder: "Centro",
      type: "text",
      required: true,
    },
    {
      id: "city",
      label: "Cidade *",
      placeholder: "Rio de Janeiro",
      type: "text",
      required: true,
    },
    {
      id: "state",
      label: "Estado (UF) *",
      placeholder: "RJ",
      type: "text",
      required: true,
    },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(26,22,20,0.65)",
          backdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: "#f5f0e8", border: "3px solid #2a3f24" }}
      >
        <div
          className="p-7 pb-4 flex items-start justify-between"
          style={{ borderBottom: "2px solid #e8e0d0" }}
        >
          <div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#c47832",
              }}
            >
              FINALIZAR PEDIDO
            </span>
            <h3
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.7rem",
                color: "#1a1a14",
                fontWeight: 700,
                marginTop: "0.15rem",
              }}
            >
              Dados para entrega
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors flex-shrink-0 ml-4"
            style={{ color: "#4a4a3a" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 p-7 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div
                key={f.id}
                className={
                  f.id === "street" || f.id === "name" || f.id === "email"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <label style={LABEL_STYLE}>
                  {f.label}
                  {f.loadingHint && (
                    <span style={{ color: "#c47832" }}>
                      {" "}
                      · buscando endereço…
                    </span>
                  )}
                </label>
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={customer[f.id] ?? ""}
                  onChange={setField(f.id)}
                  onBlur={f.onBlur}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={FIELD_STYLE}
                  onFocus={(e) => (e.target.style.borderColor = "#5d7a56")}
                />
              </div>
            ))}
          </div>

          {error && (
            <p
              style={{ color: "#c0392b", fontSize: "0.85rem", fontWeight: 700 }}
            >
              {error}
            </p>
          )}

          <p style={{ color: "#7a7a6a", fontSize: "0.78rem", fontWeight: 600 }}>
            Você será redirecionado ao Mercado Pago para pagar via Pix, cartão
            ou boleto.
          </p>
        </form>

        <div
          className="p-7 pt-5 flex items-center gap-3"
          style={{ borderTop: "2px solid #e8e0d0", background: "#eee8df" }}
        >
          <div className="flex-1">
            <div
              style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9a9a8a" }}
            >
              TOTAL
            </div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.5rem",
                color: "#c47832",
                fontWeight: 700,
              }}
            >
              {fmt(total)}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-shrink-0 px-7 py-3.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: "#c47832",
              color: "#f5f0e8",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "1.02rem",
            }}
          >
            {loading ? "Redirecionando…" : "Ir para pagamento ✦"}
          </button>
        </div>
      </div>
    </div>
  )
}
