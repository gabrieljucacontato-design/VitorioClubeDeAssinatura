// Tipos compartilhados entre o formulário de checkout (frontend) e a função
// serverless api/checkout.ts.

export interface CheckoutCustomer {
  name: string
  email: string
  phone: string
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface CheckoutRequestBody {
  customer: CheckoutCustomer
  items: Array<{ id: string; quantity: number }>
}
