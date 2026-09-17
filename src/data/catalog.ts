// Fonte única de verdade para planos e quadros: usado pelo frontend (src/App.tsx)
// e pelas funções serverless (api/*.ts) para recalcular preços com segurança.

export interface PaintingSize {
  label: string
  cm: string
  price: number
}

export interface Painting {
  id: number
  name: string
  style: string
  image: string
  description: string
  sizes: PaintingSize[]
}

export interface Plan {
  id: number
  name: string
  price: number
  tagline: string
  paintings: string
  gifts: string[]
  highlight: boolean
}

export const ART_STYLES = [
  { id: "pop", label: "Pop Art", emoji: "🎭" },
  { id: "conceitual", label: "Conceitual", emoji: "💭" },
  { id: "mbp", label: "MBP", emoji: "✊" },
  { id: "cultura", label: "Cultura", emoji: "🌍" },
  { id: "paisagem", label: "Paisagem", emoji: "🏔️" },
  { id: "retrato", label: "Retrato", emoji: "🎨" },
  { id: "abstrato", label: "Abstrato", emoji: "🌀" },
  { id: "urbano", label: "Arte Urbana", emoji: "🏙️" },
]

export const plans: Plan[] = [
  {
    id: 1,
    name: "Pincelada",
    price: 79.9,
    tagline: "Para quem quer começar a colecionar",
    paintings: "1 pintura original por Vitório (30×40 cm)",
    gifts: [
      "Chaveiro exclusivo do mês",
      "Card assinado pelo artista",
      "Certificado de autenticidade",
    ],
    highlight: false,
  },
  {
    id: 2,
    name: "Traço Fino",
    price: 129.9,
    tagline: "Mais arte, mais exclusividade",
    paintings: "2 pinturas originais por Vitório (30×40 + 50×60 cm)",
    gifts: [
      "Chaveiro exclusivo",
      "Print premium assinado",
      "Adesivos exclusivos",
      "Card com dedicatória",
      "Certificado de autenticidade",
    ],
    highlight: true,
  },
  {
    id: 3,
    name: "Mestre da Cor",
    price: 199.9,
    tagline: "A experiência completa do colecionador",
    paintings: "3 pinturas originais por Vitório (incluindo obra 70×90 cm)",
    gifts: [
      "Kit de brindes premium (5+ itens)",
      "Chaveiro + pin exclusivo",
      "Print grande emoldurado",
      "Camiseta da coleção",
      "Acesso a obras antes do lançamento",
      "Certificado + moldura de brinde",
    ],
    highlight: false,
  },
]

export const paintings: Painting[] = [
  {
    id: 201,
    name: "Força das Cores",
    style: "Pop Art",
    image:
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&h=600&fit=crop&auto=format",
    description:
      "Explosão cromática inspirada na cultura pop urbana. Acrílica sobre tela.",
    sizes: [
      { label: "P", cm: "20×30 cm", price: 180 },
      { label: "M", cm: "30×40 cm", price: 280 },
      { label: "G", cm: "50×70 cm", price: 450 },
      { label: "GG", cm: "70×90 cm", price: 720 },
    ],
  },
  {
    id: 202,
    name: "Memória Viva",
    style: "Conceitual",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop&auto=format",
    description:
      "Camadas de significado sobre fragmentos da identidade coletiva. Óleo sobre tela.",
    sizes: [
      { label: "P", cm: "20×30 cm", price: 220 },
      { label: "M", cm: "30×40 cm", price: 340 },
      { label: "G", cm: "50×70 cm", price: 520 },
      { label: "GG", cm: "70×90 cm", price: 840 },
    ],
  },
  {
    id: 203,
    name: "Raízes",
    style: "MBP",
    image:
      "https://images.unsplash.com/photo-1532640331846-d2da5987c3ee?w=600&h=600&fit=crop&auto=format",
    description:
      "Celebração da ancestralidade e resistência cultural. Técnica mista sobre tela.",
    sizes: [
      { label: "P", cm: "20×30 cm", price: 200 },
      { label: "M", cm: "30×40 cm", price: 310 },
      { label: "G", cm: "50×70 cm", price: 490 },
      { label: "GG", cm: "70×90 cm", price: 780 },
    ],
  },
  {
    id: 204,
    name: "Horizonte Livre",
    style: "Paisagem",
    image:
      "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=600&h=600&fit=crop&auto=format",
    description:
      "Paisagem expandida além do literal. Acrílica sobre tela de linho.",
    sizes: [
      { label: "P", cm: "20×30 cm", price: 170 },
      { label: "M", cm: "30×40 cm", price: 260 },
      { label: "G", cm: "50×70 cm", price: 420 },
      { label: "GG", cm: "70×90 cm", price: 670 },
    ],
  },
  {
    id: 205,
    name: "Movimento",
    style: "Abstrato",
    image:
      "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=600&fit=crop&auto=format",
    description:
      "Energia cinética capturada em pinceladas livres. Acrílica sobre tela.",
    sizes: [
      { label: "P", cm: "20×30 cm", price: 190 },
      { label: "M", cm: "30×40 cm", price: 295 },
      { label: "G", cm: "50×70 cm", price: 460 },
      { label: "GG", cm: "70×90 cm", price: 730 },
    ],
  },
  {
    id: 206,
    name: "Território Cultural",
    style: "Cultura",
    image:
      "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?w=600&h=600&fit=crop&auto=format",
    description:
      "Diálogo entre tradição e contemporaneidade. Óleo e acrílica sobre tela.",
    sizes: [
      { label: "P", cm: "20×30 cm", price: 210 },
      { label: "M", cm: "30×40 cm", price: 325 },
      { label: "G", cm: "50×70 cm", price: 500 },
      { label: "GG", cm: "70×90 cm", price: 800 },
    ],
  },
]

/**
 * Resolve o preço/nome canônico de um item de carrinho a partir do seu id,
 * no formato `plan-{id}` ou `painting-{id}-{sizeLabel}`. Usado no backend
 * para nunca confiar no preço enviado pelo cliente.
 */
export function resolveCartItem(
  id: string,
): {
  name: string
  price: number
  kind: "plan" | "painting"
  planId?: number
} | null {
  const planMatch = id.match(/^plan-(\d+)$/)
  if (planMatch) {
    const plan = plans.find((p) => p.id === Number(planMatch[1]))
    if (!plan) return null
    return {
      name: `Assinatura ${plan.name}`,
      price: plan.price,
      kind: "plan",
      planId: plan.id,
    }
  }
  const paintingMatch = id.match(/^painting-(\d+)-(.+)$/)
  if (paintingMatch) {
    const painting = paintings.find((p) => p.id === Number(paintingMatch[1]))
    const size = painting?.sizes.find((s) => s.label === paintingMatch[2])
    if (!painting || !size) return null
    return {
      name: `${painting.name} (${size.cm})`,
      price: size.price,
      kind: "painting",
    }
  }
  return null
}
