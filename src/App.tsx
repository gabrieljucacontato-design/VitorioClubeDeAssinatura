import { useState, useEffect } from 'react'
import logoImg from '@/imports/logo.png'
import mascotImg from '@/imports/Gemini_Generated_Image_7jvq1c7jvq1c7jvq_copiar.png'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: number | string
  name: string
  price: number
  quantity: number
  image: string
  detail?: string
}

interface PaintingSize {
  label: string
  cm: string
  price: number
}

interface Painting {
  id: number
  name: string
  style: string
  image: string
  description: string
  sizes: PaintingSize[]
}

interface Plan {
  id: number
  name: string
  price: number
  tagline: string
  paintings: string
  gifts: string[]
  highlight: boolean
}

interface BudgetForm {
  name: string
  email: string
  phone: string
  style: string[]
  dimensions: string
  description: string
  budget: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ART_STYLES = [
  { id: 'pop', label: 'Pop Art', emoji: '🎭' },
  { id: 'conceitual', label: 'Conceitual', emoji: '💭' },
  { id: 'mbp', label: 'MBP', emoji: '✊' },
  { id: 'cultura', label: 'Cultura', emoji: '🌍' },
  { id: 'paisagem', label: 'Paisagem', emoji: '🏔️' },
  { id: 'retrato', label: 'Retrato', emoji: '🎨' },
  { id: 'abstrato', label: 'Abstrato', emoji: '🌀' },
  { id: 'urbano', label: 'Arte Urbana', emoji: '🏙️' },
]

const plans: Plan[] = [
  {
    id: 1,
    name: 'Pincelada',
    price: 79.90,
    tagline: 'Para quem quer começar a colecionar',
    paintings: '1 pintura original por Vitório (30×40 cm)',
    gifts: ['Chaveiro exclusivo do mês', 'Card assinado pelo artista', 'Certificado de autenticidade'],
    highlight: false,
  },
  {
    id: 2,
    name: 'Traço Fino',
    price: 129.90,
    tagline: 'Mais arte, mais exclusividade',
    paintings: '2 pinturas originais por Vitório (30×40 + 50×60 cm)',
    gifts: ['Chaveiro exclusivo', 'Print premium assinado', 'Adesivos exclusivos', 'Card com dedicatória', 'Certificado de autenticidade'],
    highlight: true,
  },
  {
    id: 3,
    name: 'Mestre da Cor',
    price: 199.90,
    tagline: 'A experiência completa do colecionador',
    paintings: '3 pinturas originais por Vitório (incluindo obra 70×90 cm)',
    gifts: ['Kit de brindes premium (5+ itens)', 'Chaveiro + pin exclusivo', 'Print grande emoldurado', 'Camiseta da coleção', 'Acesso a obras antes do lançamento', 'Certificado + moldura de brinde'],
    highlight: false,
  },
]

const paintings: Painting[] = [
  {
    id: 201,
    name: 'Força das Cores',
    style: 'Pop Art',
    image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&h=600&fit=crop&auto=format',
    description: 'Explosão cromática inspirada na cultura pop urbana. Acrílica sobre tela.',
    sizes: [
      { label: 'P', cm: '20×30 cm', price: 180 },
      { label: 'M', cm: '30×40 cm', price: 280 },
      { label: 'G', cm: '50×70 cm', price: 450 },
      { label: 'GG', cm: '70×90 cm', price: 720 },
    ],
  },
  {
    id: 202,
    name: 'Memória Viva',
    style: 'Conceitual',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop&auto=format',
    description: 'Camadas de significado sobre fragmentos da identidade coletiva. Óleo sobre tela.',
    sizes: [
      { label: 'P', cm: '20×30 cm', price: 220 },
      { label: 'M', cm: '30×40 cm', price: 340 },
      { label: 'G', cm: '50×70 cm', price: 520 },
      { label: 'GG', cm: '70×90 cm', price: 840 },
    ],
  },
  {
    id: 203,
    name: 'Raízes',
    style: 'MBP',
    image: 'https://images.unsplash.com/photo-1532640331846-d2da5987c3ee?w=600&h=600&fit=crop&auto=format',
    description: 'Celebração da ancestralidade e resistência cultural. Técnica mista sobre tela.',
    sizes: [
      { label: 'P', cm: '20×30 cm', price: 200 },
      { label: 'M', cm: '30×40 cm', price: 310 },
      { label: 'G', cm: '50×70 cm', price: 490 },
      { label: 'GG', cm: '70×90 cm', price: 780 },
    ],
  },
  {
    id: 204,
    name: 'Horizonte Livre',
    style: 'Paisagem',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=600&h=600&fit=crop&auto=format',
    description: 'Paisagem expandida além do literal. Acrílica sobre tela de linho.',
    sizes: [
      { label: 'P', cm: '20×30 cm', price: 170 },
      { label: 'M', cm: '30×40 cm', price: 260 },
      { label: 'G', cm: '50×70 cm', price: 420 },
      { label: 'GG', cm: '70×90 cm', price: 670 },
    ],
  },
  {
    id: 205,
    name: 'Movimento',
    style: 'Abstrato',
    image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=600&fit=crop&auto=format',
    description: 'Energia cinética capturada em pinceladas livres. Acrílica sobre tela.',
    sizes: [
      { label: 'P', cm: '20×30 cm', price: 190 },
      { label: 'M', cm: '30×40 cm', price: 295 },
      { label: 'G', cm: '50×70 cm', price: 460 },
      { label: 'GG', cm: '70×90 cm', price: 730 },
    ],
  },
  {
    id: 206,
    name: 'Território Cultural',
    style: 'Cultura',
    image: 'https://images.unsplash.com/photo-1618331833071-ce81bd50d300?w=600&h=600&fit=crop&auto=format',
    description: 'Diálogo entre tradição e contemporaneidade. Óleo e acrílica sobre tela.',
    sizes: [
      { label: 'P', cm: '20×30 cm', price: 210 },
      { label: 'M', cm: '30×40 cm', price: 325 },
      { label: 'G', cm: '50×70 cm', price: 500 },
      { label: 'GG', cm: '70×90 cm', price: 800 },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const WaveBg = ({ color = '#1a1a14', opacity = 0.07 }: { color?: string; opacity?: number }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <path
        key={i}
        d={`M${-100 + i * 4},${20 + i * 30} C${120 + i * 6},${0 + i * 30} ${320 + i * 2},${40 + i * 30} ${520 + i * 2},${20 + i * 30} S${720},${0 + i * 30} ${920 + i * 2},${20 + i * 30}`}
        fill="none" stroke={color} strokeWidth="1.5"
      />
    ))}
  </svg>
)

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)

  // Subscribe modal
  const [subscribeModal, setSubscribeModal] = useState<Plan | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [styleError, setStyleError] = useState(false)

  // Painting size selection
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>({})
  const [addedPainting, setAddedPainting] = useState<number | null>(null)

  // Budget form
  const [budgetForm, setBudgetForm] = useState<BudgetForm>({
    name: '', email: '', phone: '', style: [], dimensions: '', description: '', budget: ''
  })
  const [budgetSent, setBudgetSent] = useState(false)

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const key = `${item.id}`
      const ex = prev.find(c => `${c.id}` === key)
      if (ex) return prev.map(c => `${c.id}` === key ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number | string) =>
    setCart(prev => prev.filter(c => c.id !== id))

  const updateQty = (id: number | string, delta: number) =>
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c))

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    setStyleError(false)
  }

  const confirmSubscribe = () => {
    if (selectedStyles.length === 0) { setStyleError(true); return }
    if (!subscribeModal) return
    const styles = selectedStyles.map(s => ART_STYLES.find(a => a.id === s)?.label).join(', ')
    addToCart({
      id: `plan-${subscribeModal.id}`,
      name: `Assinatura ${subscribeModal.name}`,
      price: subscribeModal.price,
      image: '',
      detail: `Estilos: ${styles}`
    })
    setSubscribeModal(null)
    setSelectedStyles([])
    setCartOpen(true)
  }

  const getPaintingPrice = (p: Painting) => {
    const sizeIdx = selectedSizes[p.id] ?? 1
    return p.sizes[sizeIdx].price
  }

  const addPaintingToCart = (p: Painting) => {
    const sizeIdx = selectedSizes[p.id] ?? 1
    const size = p.sizes[sizeIdx]
    addToCart({
      id: `painting-${p.id}-${size.label}`,
      name: p.name,
      price: size.price,
      image: p.image,
      detail: `${size.cm} · ${p.style}`
    })
    setAddedPainting(p.id)
    setTimeout(() => setAddedPainting(null), 1400)
  }

  const toggleBudgetStyle = (id: string) =>
    setBudgetForm(prev => ({
      ...prev,
      style: prev.style.includes(id) ? prev.style.filter(s => s !== id) : [...prev.style, id]
    }))

  const submitBudget = (e: React.FormEvent) => {
    e.preventDefault()
    setBudgetSent(true)
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.35 }
    )
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'assinar', label: 'Assinar' },
    { id: 'loja', label: 'Loja' },
    { id: 'orcamento', label: 'Orçamento' },
    { id: 'sobre', label: 'Sobre Nós' },
  ]

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: '#f5f0e8', fontFamily: "'Nunito', sans-serif", minHeight: '100vh' }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-2.5"
        style={{ background: '#2a3f24', borderBottom: '3px solid #1d2e19' }}>
        <button onClick={() => scrollTo('inicio')} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logoImg} alt="Vitório" className="w-10 h-10 rounded-xl object-cover" style={{ border: '2px solid #5d7a56' }} />
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.55rem', color: '#f5f0e8', fontWeight: 700 }}>Vitório</span>
        </button>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              className="px-4 py-2 rounded-xl transition-all"
              style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: '1.02rem',
                color: activeSection === l.id ? '#f5f0e8' : '#8aab82',
                background: activeSection === l.id ? 'rgba(255,255,255,0.13)' : 'transparent'
              }}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ background: '#c47832', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif", fontSize: '1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="hidden sm:inline">Sacola</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: '#f5f0e8', color: '#2a3f24' }}>
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg" style={{ color: '#f5f0e8' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 flex flex-col gap-1 p-4 md:hidden"
            style={{ background: '#2a3f24', borderBottom: '3px solid #1d2e19' }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className="text-left px-4 py-3 rounded-xl"
                style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', color: '#f5f0e8', background: activeSection === l.id ? 'rgba(255,255,255,0.13)' : 'transparent' }}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16"
        style={{ background: '#2a3f24' }}>
        <WaveBg />
        <div className="absolute top-24 right-12 w-80 h-80 rounded-full opacity-15" style={{ background: '#5d7a56', filter: 'blur(70px)' }} />
        <div className="absolute bottom-16 left-8 w-56 h-56 rounded-full opacity-10" style={{ background: '#c47832', filter: 'blur(55px)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
              style={{ background: 'rgba(196,120,50,0.22)', color: '#e8a046', border: '1.5px solid rgba(196,120,50,0.35)' }}>
              <span>✦</span> Clube de Assinatura de Arte
            </div>
            <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(2.8rem, 7.5vw, 5.2rem)', color: '#f5f0e8', fontWeight: 700, lineHeight: 1.08 }}>
              Arte original de<span style={{ color: '#e8a046' }}> Vitório</span><br />na sua casa.
            </h1>
            <p className="text-lg leading-relaxed max-w-md font-semibold" style={{ color: '#9ab893' }}>
              Todo mês uma pintura original, brindes exclusivos e a energia do artista chegam até você. Assine e escolha o estilo que fala com a sua alma.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={() => scrollTo('assinar')}
                className="px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 hover:brightness-110"
                style={{ background: '#c47832', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif", fontSize: '1.2rem' }}>
                Assinar Agora
              </button>
              <button onClick={() => scrollTo('loja')}
                className="px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#f5f0e8', border: '2px solid rgba(255,255,255,0.22)', fontFamily: "'Fredoka', sans-serif", fontSize: '1.2rem' }}>
                Ver Quadros
              </button>
            </div>
            <div className="flex items-center gap-7 pt-2">
              {[['2.400+', 'Assinantes'], ['48', 'Obras enviadas'], ['4.9★', 'Avaliação']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", color: '#e8a046', fontSize: '1.5rem', fontWeight: 700 }}>{v}</div>
                  <div style={{ color: '#6a9162', fontSize: '0.78rem', fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-end relative">
            <div className="absolute bottom-0 w-80 h-80 rounded-full" style={{ background: 'rgba(138,171,130,0.18)', border: '3px solid rgba(138,171,130,0.25)' }} />
            <div className="absolute bottom-4 w-64 h-64 rounded-full" style={{ background: 'rgba(196,120,50,0.1)', border: '2px dashed rgba(196,120,50,0.28)' }} />
            <img src={mascotImg} alt="Vitório mascote" className="relative z-10 drop-shadow-2xl"
              style={{ width: 'min(330px, 88vw)', objectFit: 'contain' }} />
            <div className="absolute top-10 right-2 px-4 py-2 rounded-2xl text-sm font-bold rotate-6 shadow-lg"
              style={{ background: '#c47832', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif" }}>
              Obra original ✦
            </div>
            <div className="absolute bottom-20 -left-2 px-4 py-2 rounded-2xl text-sm font-bold -rotate-2 shadow-lg"
              style={{ background: '#f5f0e8', color: '#2a3f24', fontFamily: "'Fredoka', sans-serif" }}>
              + Brindes todo mês!
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span style={{ color: '#8aab82', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em' }}>ROLAR</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8aab82" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#f5f0e8' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
              style={{ background: '#d4e8cf', color: '#2a3f24' }}>Como funciona</span>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#1a1a14', fontWeight: 700 }}>
              Simples assim. ✦
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '✍️', title: 'Escolha seu plano', desc: 'Selecione o nível que se encaixa no seu desejo de colecionar.', bg: '#d4e8cf', accent: '#2a3f24' },
              { step: '02', icon: '🎨', title: 'Informe seu estilo', desc: 'Diga quais estilos de arte mais conectam com você.', bg: '#fce8c8', accent: '#c47832' },
              { step: '03', icon: '📦', title: 'Receba em casa', desc: 'Pinturas originais + brindes exclusivos chegam toda virada do mês.', bg: '#d4e8cf', accent: '#2a3f24' },
              { step: '04', icon: '🖼️', title: 'Colecione e exiba', desc: 'Cada obra vem com certificado. Sua coleção cresce a cada envio.', bg: '#fce8c8', accent: '#c47832' },
            ].map(item => (
              <div key={item.step}
                className="relative p-7 rounded-3xl hover:-translate-y-2 transition-all duration-300"
                style={{ background: item.bg, border: `2px solid ${item.accent}20` }}>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: item.accent, opacity: 0.5, marginBottom: '0.75rem' }}>
                  PASSO {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', color: '#1a1a14', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#4a4a3a', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ─────────────────────────────────────────────────────────── */}
      <section id="assinar" className="py-24 px-6 relative overflow-hidden"
        style={{ background: '#1d2e19' }}>
        <WaveBg color="#f5f0e8" opacity={0.04} />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
              style={{ background: 'rgba(212,232,207,0.15)', color: '#8aab82' }}>
              Planos de assinatura
            </span>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#f5f0e8', fontWeight: 700 }}>
              Qual é o seu traço?
            </h2>
            <p style={{ color: '#6a9162', fontWeight: 600, marginTop: '0.75rem', fontSize: '1rem' }}>
              Pinturas originais do Vitório + brindes exclusivos. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map(plan => (
              <div key={plan.id}
                className="relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: plan.highlight ? '#c47832' : 'rgba(255,255,255,0.06)',
                  border: plan.highlight ? '3px solid #e8a046' : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: plan.highlight ? '0 20px 60px rgba(196,120,50,0.3)' : 'none'
                }}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold"
                    style={{ background: '#f5f0e8', color: '#c47832', fontFamily: "'Fredoka', sans-serif" }}>
                    ✦ Mais Popular
                  </div>
                )}
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '2rem', color: '#f5f0e8', fontWeight: 700, marginBottom: '0.25rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: plan.highlight ? 'rgba(255,255,255,0.75)' : '#6a9162', marginBottom: '1.5rem' }}>{plan.tagline}</p>

                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '2.8rem', color: plan.highlight ? '#f5f0e8' : '#e8a046', fontWeight: 700 }}>
                    {fmt(plan.price)}
                  </span>
                  <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#6a9162', fontSize: '0.85rem', marginLeft: '0.5rem' }}>/mês</span>
                </div>

                {/* Paintings */}
                <div className="p-4 rounded-2xl mb-4"
                  style={{ background: plan.highlight ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${plan.highlight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#e8a046', marginBottom: '0.4rem' }}>
                    🖼️ PINTURAS DO VITÓRIO
                  </div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: plan.highlight ? '#f5f0e8' : '#c5d9c2', lineHeight: 1.5 }}>{plan.paintings}</p>
                </div>

                {/* Gifts */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#6a9162', marginBottom: '0.75rem' }}>
                    🎁 BRINDES INCLUSOS
                  </div>
                  <ul className="space-y-2">
                    {plan.gifts.map(g => (
                      <li key={g} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: plan.highlight ? 'rgba(255,255,255,0.3)' : 'rgba(138,171,130,0.2)', color: plan.highlight ? '#fff' : '#8aab82' }}>
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 6l3 3 5-5" /></svg>
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: plan.highlight ? 'rgba(255,255,255,0.88)' : '#9ab893' }}>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSubscribeModal(plan)}
                  className="w-full py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: plan.highlight ? '#f5f0e8' : '#c47832',
                    color: plan.highlight ? '#c47832' : '#f5f0e8',
                    fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem'
                  }}>
                  Assinar {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOJA DE QUADROS ────────────────────────────────────────────────── */}
      <section id="loja" className="py-24 px-6" style={{ background: '#f5f0e8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
                style={{ background: '#fce8c8', color: '#c47832' }}>
                Loja de Quadros
              </span>
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#1a1a14', fontWeight: 700 }}>
                Quadros prontos.
              </h2>
            </div>
            <p style={{ maxWidth: '20rem', fontSize: '0.95rem', fontWeight: 600, color: '#6a6a5a' }}>
              Pinturas originais do Vitório disponíveis para compra imediata. Escolha o tamanho que combina com seu espaço.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paintings.map(p => {
              const sizeIdx = selectedSizes[p.id] ?? 1
              const price = p.sizes[sizeIdx].price
              const added = addedPainting === p.id
              return (
                <div key={p.id}
                  className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: '#fff', border: '2px solid #e8e0d0' }}>
                  <div className="relative overflow-hidden" style={{ height: 250, background: '#ede6d6' }}>
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: '#2a3f24', color: '#d4e8cf' }}>
                      {p.style}
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(26,22,20,0.7)', color: '#f5f0e8' }}>
                      Original · Certificado
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.35rem', color: '#1a1a14', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#7a7a6a', fontWeight: 600, marginBottom: '1rem' }}>{p.description}</p>

                    {/* Size selector */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: '#9a9a8a', marginBottom: '0.5rem' }}>TAMANHO</div>
                      <div className="flex gap-2 flex-wrap">
                        {p.sizes.map((s, idx) => (
                          <button key={s.label}
                            onClick={() => setSelectedSizes(prev => ({ ...prev, [p.id]: idx }))}
                            className="flex flex-col items-center px-3 py-2 rounded-xl transition-all hover:scale-105"
                            style={{
                              background: sizeIdx === idx ? '#2a3f24' : '#f0ebe0',
                              border: `2px solid ${sizeIdx === idx ? '#2a3f24' : '#e8e0d0'}`,
                              color: sizeIdx === idx ? '#f5f0e8' : '#4a4a3a'
                            }}>
                            <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: '0.95rem' }}>{s.label}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: 0.8 }}>{s.cm}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.6rem', color: '#c47832', fontWeight: 700 }}>
                        {fmt(price)}
                      </span>
                      <button
                        onClick={() => addPaintingToCart(p)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                        style={{ background: added ? '#2a6c22' : '#2a3f24', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif" }}>
                        {added
                          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> Adicionado!</>
                          : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg> Adicionar</>}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ORÇAMENTO PERSONALIZADO ────────────────────────────────────────── */}
      <section id="orcamento" className="py-24 px-6 relative overflow-hidden"
        style={{ background: '#ede6d6' }}>
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20" style={{ background: '#c47832', borderRadius: '0 0 0 100%', filter: 'blur(80px)' }} />
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">

          {/* Left info */}
          <div className="md:col-span-2 space-y-6 md:sticky md:top-28">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold"
              style={{ background: '#fce8c8', color: '#c47832' }}>Pedido personalizado</span>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', color: '#1a1a14', fontWeight: 700, lineHeight: 1.15 }}>
              Faça um orçamento sob medida.
            </h2>
            <p style={{ color: '#4a4a3a', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.7 }}>
              Quer uma obra do Vitório com um tema específico, tamanho personalizado ou para um presente especial? Preencha o formulário e receba uma proposta em até 48 horas.
            </p>
            <div className="space-y-3">
              {[
                { icon: '📐', txt: 'Qualquer tamanho e formato' },
                { icon: '🎨', txt: 'No estilo de arte que você quiser' },
                { icon: '⏱️', txt: 'Prazo combinado com você' },
                { icon: '🔒', txt: 'Proposta sem compromisso' },
              ].map(i => (
                <div key={i.txt} className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: '#f5f0e8', border: '1.5px solid #d4c8b4' }}>
                  <span className="text-xl">{i.icon}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2a3f24' }}>{i.txt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {budgetSent ? (
              <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 rounded-3xl text-center"
                style={{ background: '#fff', border: '2px solid #d4e8cf' }}>
                <div className="text-6xl">🎨</div>
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '2rem', color: '#2a3f24', fontWeight: 700 }}>
                  Orçamento enviado!
                </h3>
                <p style={{ color: '#4a4a3a', fontWeight: 600, maxWidth: '22rem' }}>
                  O Vitório vai analisar sua solicitação e responder em até 48 horas no seu e-mail.
                </p>
                <button onClick={() => { setBudgetSent(false); setBudgetForm({ name: '', email: '', phone: '', style: [], dimensions: '', description: '', budget: '' }) }}
                  className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                  style={{ background: '#2a3f24', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif" }}>
                  Novo orçamento
                </button>
              </div>
            ) : (
              <form onSubmit={submitBudget} className="p-8 rounded-3xl space-y-5"
                style={{ background: '#fff', border: '2px solid #e8e0d0' }}>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name', label: 'Seu nome *', placeholder: 'João Silva', type: 'text', required: true },
                    { id: 'email', label: 'E-mail *', placeholder: 'joao@email.com', type: 'email', required: true },
                    { id: 'phone', label: 'Telefone/WhatsApp', placeholder: '(11) 99999-9999', type: 'tel', required: false },
                    { id: 'dimensions', label: 'Dimensões desejadas', placeholder: 'Ex: 60×80 cm', type: 'text', required: false },
                  ].map(f => (
                    <div key={f.id}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: '#5a5a4a', display: 'block', marginBottom: '0.4rem' }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        required={f.required}
                        placeholder={f.placeholder}
                        value={(budgetForm as unknown as Record<string, string>)[f.id]}
                        onChange={e => setBudgetForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                        style={{ background: '#f8f4ee', border: '2px solid #e8e0d0', fontSize: '0.9rem', fontWeight: 600, color: '#1a1a14', fontFamily: "'Nunito', sans-serif" }}
                        onFocus={e => (e.target.style.borderColor = '#5d7a56')}
                        onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
                      />
                    </div>
                  ))}
                </div>

                {/* Style checkboxes */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: '#5a5a4a', display: 'block', marginBottom: '0.6rem' }}>
                    ESTILO PREFERIDO
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ART_STYLES.map(s => {
                      const sel = budgetForm.style.includes(s.id)
                      return (
                        <button type="button" key={s.id}
                          onClick={() => toggleBudgetStyle(s.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: sel ? '#2a3f24' : '#f0ebe0',
                            color: sel ? '#f5f0e8' : '#4a4a3a',
                            border: `2px solid ${sel ? '#2a3f24' : '#e8e0d0'}`
                          }}>
                          <span>{s.emoji}</span>{s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: '#5a5a4a', display: 'block', marginBottom: '0.4rem' }}>
                    DESCRIÇÃO DO QUE VOCÊ QUER *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva a obra que você sonha... tema, cores, personagens, ambiente, ocasião especial, etc."
                    value={budgetForm.description}
                    onChange={e => setBudgetForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                    style={{ background: '#f8f4ee', border: '2px solid #e8e0d0', fontSize: '0.9rem', fontWeight: 600, color: '#1a1a14', fontFamily: "'Nunito', sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = '#5d7a56')}
                    onBlur={e => (e.target.style.borderColor = '#e8e0d0')}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', color: '#5a5a4a', display: 'block', marginBottom: '0.4rem' }}>
                    FAIXA DE INVESTIMENTO
                  </label>
                  <select
                    value={budgetForm.budget}
                    onChange={e => setBudgetForm(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ background: '#f8f4ee', border: '2px solid #e8e0d0', fontSize: '0.9rem', fontWeight: 600, color: budgetForm.budget ? '#1a1a14' : '#9a9a8a', fontFamily: "'Nunito', sans-serif', appearance: 'none" }}>
                    <option value="">Selecione uma faixa...</option>
                    <option value="300-600">R$300 – R$600</option>
                    <option value="600-1200">R$600 – R$1.200</option>
                    <option value="1200-2500">R$1.200 – R$2.500</option>
                    <option value="2500+">Acima de R$2.500</option>
                    <option value="a_combinar">A combinar</option>
                  </select>
                </div>

                <button type="submit"
                  className="w-full py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: '#c47832', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif", fontSize: '1.15rem' }}>
                  Solicitar Orçamento ✦
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── SOBRE NÓS ──────────────────────────────────────────────────────── */}
      <section id="sobre" className="py-24 px-6 relative overflow-hidden"
        style={{ background: '#f5f0e8' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 m-auto w-72 h-72 rounded-full" style={{ background: '#d4e8cf', maxWidth: '100%' }} />
            <svg className="absolute w-80 h-80" viewBox="0 0 300 300" fill="none">
              <circle cx="150" cy="150" r="140" stroke="#5d7a56" strokeWidth="2" strokeDasharray="12 8" opacity="0.35" />
            </svg>
            <img src={logoImg} alt="Vitório" className="relative z-10 rounded-3xl shadow-2xl"
              style={{ width: 'min(270px, 78vw)', objectFit: 'cover', border: '4px solid #5d7a56' }} />
          </div>
          <div className="space-y-5">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold"
              style={{ background: '#d4e8cf', color: '#2a3f24' }}>Sobre Nós</span>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(2.2rem,4.5vw,3.2rem)', color: '#1a1a14', fontWeight: 700, lineHeight: 1.15 }}>
              Por trás de cada pincelada.
            </h2>
            <p style={{ color: '#4a4a3a', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.75 }}>
              Vitório é artista visual com paixão por transformar telas em experiências. Cada obra carrega intenção, técnica e um pedaço do seu universo criativo — seja pop art, cultura, paisagem ou conceitual.
            </p>
            <p style={{ color: '#4a4a3a', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.75 }}>
              O clube nasceu para conectar arte original a pessoas reais, sem galeria, sem intermediário. Uma obra do Vitório na sua parede, todo mês.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: '🖼️', label: 'Pinturas originais' },
                { icon: '🎁', label: 'Brindes exclusivos' },
                { icon: '📜', label: 'Certificado de autenticidade' },
                { icon: '💬', label: 'Comunidade de colecionadores' },
              ].map(i => (
                <div key={i.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: '#fff', border: '1.5px solid #e8e0d0' }}>
                  <span className="text-xl">{i.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2a3f24' }}>{i.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => scrollTo('assinar')}
              className="px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: '#2a3f24', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', marginTop: '0.5rem' }}>
              Quero colecionar ✦
            </button>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#5d7a56' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
          {[
            { name: 'Fernanda Rocha', role: 'Plano Traço Fino · 8 meses', quote: '"Cada obra que chega é incrível. Tenho uma galeria em casa e ninguém acredita que é assinatura."' },
            { name: 'Carlos Mendes', role: 'Plano Mestre da Cor · 1 ano', quote: '"O kit de brindes do plano premium me surpreende sempre. E as obras são impressionantes."' },
            { name: 'Bianca Torres', role: 'Plano Pincelada · 5 meses', quote: '"Comecei pelo menor plano e não consigo cancelar. A pintura de todo mês vira peça principal da sala."' },
          ].map(t => (
            <div key={t.name} className="p-6 rounded-3xl"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.14)' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.7, color: '#f5f0e8', marginBottom: '1rem' }}>{t.quote}</p>
              <div style={{ fontFamily: "'Fredoka', sans-serif", color: '#e8a046', fontWeight: 700 }}>{t.name}</div>
              <div style={{ color: '#8aab82', fontSize: '0.75rem', fontWeight: 600 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6" style={{ background: '#111a0e', borderTop: '3px solid #1d2e19' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Vitório" className="w-10 h-10 rounded-xl object-cover" />
              <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', color: '#f5f0e8', fontWeight: 700 }}>Vitório</span>
            </div>
            <p style={{ color: '#4a6244', fontSize: '0.87rem', fontWeight: 600, lineHeight: 1.7 }}>
              Arte original que chega na sua porta todo mês. Para quem quer colecionar e se surpreender.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Fredoka', sans-serif", color: '#e8a046', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Links</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  className="text-left text-sm font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: '#6a9162' }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Fredoka', sans-serif", color: '#e8a046', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Contato</h4>
            <div style={{ color: '#6a9162', fontSize: '0.87rem', fontWeight: 600, lineHeight: 2 }}>
              <p>contato@vitorio.art</p>
              <p>@arte.vitorio</p>
              <p>Rio de Janeiro, Brasil</p>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2"
          style={{ borderTop: '1px solid #1d2e19' }}>
          <span style={{ color: '#2a4224', fontSize: '0.78rem', fontWeight: 600 }}>© 2026 Vitório. Todos os direitos reservados.</span>
          <span style={{ color: '#2a4224', fontSize: '0.78rem', fontWeight: 600 }}>Arte original, entrega mensal. 🎨</span>
        </div>
      </footer>

      {/* ── SUBSCRIBE MODAL ────────────────────────────────────────────────── */}
      {subscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(26,22,20,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={() => { setSubscribeModal(null); setSelectedStyles([]) }} />
          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            style={{ background: '#f5f0e8', border: '3px solid #2a3f24' }}>
            <div className="p-7 pb-0">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#c47832' }}>
                    ASSINATURA {subscribeModal.name.toUpperCase()}
                  </span>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.9rem', color: '#1a1a14', fontWeight: 700, marginTop: '0.15rem' }}>
                    Personalize sua arte
                  </h3>
                  <p style={{ color: '#6a6a5a', fontSize: '0.88rem', fontWeight: 600, marginTop: '0.3rem' }}>
                    Selecione os estilos que mais conectam com você. O Vitório vai levar isso em conta nas suas pinturas mensais.
                  </p>
                </div>
                <button onClick={() => { setSubscribeModal(null); setSelectedStyles([]) }}
                  className="p-2 rounded-xl hover:bg-black/10 transition-colors flex-shrink-0 ml-4"
                  style={{ color: '#4a4a3a' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: '#9a9a8a', marginBottom: '0.75rem' }}>
                ESTILOS DE ARTE (selecione um ou mais)
              </div>
              <div className="flex flex-wrap gap-2.5 mb-2">
                {ART_STYLES.map(s => {
                  const sel = selectedStyles.includes(s.id)
                  return (
                    <button type="button" key={s.id}
                      onClick={() => toggleStyle(s.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all hover:scale-105"
                      style={{
                        background: sel ? '#2a3f24' : '#fff',
                        color: sel ? '#f5f0e8' : '#4a4a3a',
                        border: `2px solid ${sel ? '#2a3f24' : '#d8d0c4'}`,
                        fontSize: '0.9rem'
                      }}>
                      <span className="text-lg">{s.emoji}</span>
                      {s.label}
                    </button>
                  )
                })}
              </div>
              {styleError && (
                <p style={{ color: '#c0392b', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  ↑ Selecione pelo menos um estilo para continuar.
                </p>
              )}
            </div>

            <div className="p-7 pt-5 flex items-center gap-3 mt-1"
              style={{ borderTop: '2px solid #e8e0d0', background: '#eee8df' }}>
              <div className="flex-1">
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9a9a8a' }}>TOTAL MENSAL</div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.6rem', color: '#c47832', fontWeight: 700 }}>
                  {fmt(subscribeModal.price)}
                </div>
              </div>
              <button onClick={confirmSubscribe}
                className="flex-shrink-0 px-7 py-3.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: '#c47832', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif", fontSize: '1.05rem' }}>
                Confirmar e Assinar ✦
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CART SIDEBAR ───────────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0" style={{ background: 'rgba(26,22,20,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm h-full flex flex-col shadow-2xl"
            style={{ background: '#f5f0e8', borderLeft: '3px solid #2a3f24' }}>

            <div className="flex items-center justify-between p-6" style={{ borderBottom: '2px solid #e8e0d0' }}>
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a3f24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.4rem', color: '#1a1a14', fontWeight: 700 }}>
                  Sacola ({cartCount})
                </span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-black/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a14" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="text-6xl">🎨</div>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', color: '#4a4a3a' }}>Sacola vazia!</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7a7a6a' }}>Explore nossos quadros e planos</p>
                  <button onClick={() => { setCartOpen(false); scrollTo('loja') }}
                    className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    style={{ background: '#2a3f24', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif" }}>
                    Ver Quadros
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={String(item.id)} className="flex gap-3 p-4 rounded-2xl"
                    style={{ background: '#fff', border: '1.5px solid #e8e0d0' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ background: '#ede6d6' }} />
                      : <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: '#d4e8cf' }}>🖼️</div>}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1a1a14' }} className="truncate">{item.name}</p>
                      {item.detail && <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8a8a7a', marginTop: '0.1rem' }}>{item.detail}</p>}
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#c47832', marginTop: '0.3rem' }}>{fmt(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {[{ d: -1, label: '−' }, { d: 1, label: '+' }].map((btn, i) => (
                          i === 0
                            ? <button key={btn.label} onClick={() => updateQty(item.id, btn.d)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm hover:bg-black/10 transition-colors"
                                style={{ border: '1.5px solid #ccc', color: '#1a1a14' }}>{btn.label}</button>
                            : <>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '1rem', textAlign: 'center' }}>{item.quantity}</span>
                                <button key={btn.label} onClick={() => updateQty(item.id, btn.d)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm hover:bg-black/10 transition-colors"
                                  style={{ border: '1.5px solid #ccc', color: '#1a1a14' }}>{btn.label}</button>
                              </>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="self-start p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 space-y-3" style={{ borderTop: '2px solid #e8e0d0' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontWeight: 700, color: '#4a4a3a', fontSize: '1rem' }}>Total</span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.7rem', color: '#c47832', fontWeight: 700 }}>{fmt(cartTotal)}</span>
                </div>
                <button className="w-full py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: '#2a3f24', color: '#f5f0e8', fontFamily: "'Fredoka', sans-serif", fontSize: '1.05rem' }}>
                  Finalizar Compra
                </button>
                <button onClick={() => setCartOpen(false)}
                  className="w-full py-3 rounded-2xl font-bold text-sm hover:bg-black/5 transition-colors"
                  style={{ color: '#6a6a5a', border: '1.5px solid #d4c8b4' }}>
                  Continuar Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
