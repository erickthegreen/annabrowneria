-- ╔══════════════════════════════════════════════════════════════╗
-- ║         AnnaBrowneria — Script SQL completo Supabase        ║
-- ║  Cole e execute no SQL Editor do seu projeto Supabase        ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ─── Extensão UUID ────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Tabela: produtos ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT        NOT NULL,
  descricao   TEXT,
  preco       NUMERIC(10,2) NOT NULL,
  url_img     TEXT,                         -- URL transformada do Cloudinary
  disponivel  BOOLEAN     DEFAULT TRUE,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabela: pedidos ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente     TEXT        NOT NULL,
  telefone         TEXT        NOT NULL,
  itens            JSONB       NOT NULL,    -- [{ produto_id, nome, preco, quantidade }]
  total            NUMERIC(10,2) NOT NULL,
  status           TEXT        DEFAULT 'pendente' CHECK (status IN ('pendente','pago','cancelado')),
  mp_preference_id TEXT,                   -- ID de preferência do Mercado Pago
  mp_payment_id    TEXT,                   -- ID do pagamento confirmado
  criado_em        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Habilitar Row Level Security ─────────────────────────────────────────
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos  ENABLE ROW LEVEL SECURITY;

-- ─── Políticas: produtos ──────────────────────────────────────────────────
-- Leitura pública (qualquer visitante pode ver os produtos disponíveis)
CREATE POLICY "produtos_leitura_publica"
  ON produtos FOR SELECT
  USING (disponivel = TRUE);

-- Escrita somente para usuários autenticados (admin/painel)
CREATE POLICY "produtos_escrita_autenticado"
  ON produtos FOR ALL
  USING (auth.role() = 'authenticated');

-- ─── Políticas: pedidos ───────────────────────────────────────────────────
-- Inserção pública (qualquer cliente pode criar um pedido)
CREATE POLICY "pedidos_insercao_publica"
  ON pedidos FOR INSERT
  WITH CHECK (TRUE);

-- Leitura somente para autenticados (vendedora/admin)
CREATE POLICY "pedidos_leitura_autenticado"
  ON pedidos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Atualização somente para autenticados (para atualizar status/mp_payment_id)
CREATE POLICY "pedidos_atualizacao_autenticado"
  ON pedidos FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ─── Dados iniciais de exemplo ────────────────────────────────────────────
INSERT INTO produtos (nome, descricao, preco, url_img, disponivel) VALUES
  ('Brownie Clássico',       'Receita original com chocolate belga 70% cacau, crocante por fora e fudgy por dentro.',           12.00, 'https://res.cloudinary.com/SEUCLOUD/image/upload/w_600,h_400,c_fill,q_auto,f_auto/brownie_classico', TRUE),
  ('Brownie Nutella',        'Massa de chocolate com recheio generoso de Nutella e avelãs torradas.',                            16.00, 'https://res.cloudinary.com/SEUCLOUD/image/upload/w_600,h_400,c_fill,q_auto,f_auto/brownie_nutella',  TRUE),
  ('Brownie Doce de leite',  'Combinação surpreendente de chocolate amargo com ganache de doce de leite.',                            14.00, 'https://res.cloudinary.com/SEUCLOUD/image/upload/w_600,h_400,c_fill,q_auto,f_auto/brownie_doce_de_leite', TRUE),
  ('Brownie morango',     'Massa aveludada vermelha com cream cheese cremoso e raspas de chocolate branco.',                  15.00, 'https://res.cloudinary.com/SEUCLOUD/image/upload/w_600,h_400,c_fill,q_auto,f_auto/brownie_redvelvet',TRUE),
  ('Brownie Caramelo Salgado','Chocolate ao leite com caramelo artesanal e flor de sal. O equilíbrio perfeito.',                15.00, 'https://res.cloudinary.com/SEUCLOUD/image/upload/w_600,h_400,c_fill,q_auto,f_auto/brownie_caramelo', TRUE),
  ('Brownie Oreo',           'Massa intensa de chocolate recheada com cream cheese e pedaços generosos de Oreo.',               16.00, 'https://res.cloudinary.com/SEUCLOUD/image/upload/w_600,h_400,c_fill,q_auto,f_auto/brownie_oreo',     TRUE)
ON CONFLICT DO NOTHING;
