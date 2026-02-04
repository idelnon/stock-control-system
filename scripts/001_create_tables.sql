-- Criar extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de tipos (Entrada/Saída)
CREATE TABLE IF NOT EXISTS tipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de aquisições (Compra/Indústria)
CREATE TABLE IF NOT EXISTS aquisicoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de formas de pagamento (Boleto/Pix/Cartão)
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fazendas (Barro/Barroca)
CREATE TABLE IF NOT EXISTS fazendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  saldo_minimo INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de descrições
CREATE TABLE IF NOT EXISTS descricoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela principal de transações (Entrada/Saída)
CREATE TABLE IF NOT EXISTS transacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_id UUID REFERENCES tipos(id) ON DELETE RESTRICT,
  aquisicao_id UUID REFERENCES aquisicoes(id) ON DELETE RESTRICT,
  pagamento_id UUID REFERENCES pagamentos(id) ON DELETE RESTRICT,
  fazenda_id UUID REFERENCES fazendas(id) ON DELETE RESTRICT,
  produto_id UUID REFERENCES produtos(id) ON DELETE RESTRICT,
  descricao_id UUID REFERENCES descricoes(id) ON DELETE RESTRICT,
  quantidade DECIMAL(10, 2) NOT NULL,
  valor_unitario DECIMAL(10, 2) NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  vencimento DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_fazenda ON transacoes(fazenda_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_produto ON transacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE tipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fazendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE descricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - permitir acesso público para leitura e escrita (ajustar conforme necessário)
CREATE POLICY "Allow public read access on tipos" ON tipos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tipos" ON tipos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tipos" ON tipos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on tipos" ON tipos FOR DELETE USING (true);

CREATE POLICY "Allow public read access on aquisicoes" ON aquisicoes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on aquisicoes" ON aquisicoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on aquisicoes" ON aquisicoes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on aquisicoes" ON aquisicoes FOR DELETE USING (true);

CREATE POLICY "Allow public read access on pagamentos" ON pagamentos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on pagamentos" ON pagamentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on pagamentos" ON pagamentos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on pagamentos" ON pagamentos FOR DELETE USING (true);

CREATE POLICY "Allow public read access on fazendas" ON fazendas FOR SELECT USING (true);
CREATE POLICY "Allow public insert on fazendas" ON fazendas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on fazendas" ON fazendas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on fazendas" ON fazendas FOR DELETE USING (true);

CREATE POLICY "Allow public read access on produtos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on produtos" ON produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on produtos" ON produtos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on produtos" ON produtos FOR DELETE USING (true);

CREATE POLICY "Allow public read access on descricoes" ON descricoes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on descricoes" ON descricoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on descricoes" ON descricoes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on descricoes" ON descricoes FOR DELETE USING (true);

CREATE POLICY "Allow public read access on transacoes" ON transacoes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on transacoes" ON transacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on transacoes" ON transacoes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on transacoes" ON transacoes FOR DELETE USING (true);
