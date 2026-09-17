-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- Tabela única que guarda tanto assinaturas de planos quanto compras avulsas da loja.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- dados do cliente
  name text not null,
  email text not null,
  phone text not null,

  -- endereço de entrega
  cep text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,

  -- pedido
  order_type text not null check (order_type in ('assinatura', 'compra')),
  plan_id integer,
  plan_name text,
  items jsonb not null default '[]'::jsonb,
  amount numeric(10, 2) not null,

  -- pagamento (Mercado Pago)
  external_reference text not null unique,
  mp_preference_id text,
  mp_payment_id text,
  payment_method text,
  status text not null default 'pendente' check (status in ('pendente', 'pago', 'recusado', 'cancelado'))
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Row Level Security: nenhuma policy de leitura/escrita pública.
-- As funções serverless usam a Service Role Key, que ignora RLS,
-- então o painel admin e o checkout continuam funcionando normalmente
-- enquanto o restante da internet não consegue ler a tabela direto do Supabase.
alter table public.orders enable row level security;
