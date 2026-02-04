-- Inserir dados iniciais de tipos
INSERT INTO tipos (nome) VALUES 
  ('Entrada'),
  ('Saída')
ON CONFLICT (nome) DO NOTHING;

-- Inserir dados iniciais de aquisições
INSERT INTO aquisicoes (nome) VALUES 
  ('Compra'),
  ('Indústria')
ON CONFLICT (nome) DO NOTHING;

-- Inserir dados iniciais de pagamentos
INSERT INTO pagamentos (nome) VALUES 
  ('Boleto'),
  ('Pix'),
  ('Cartão')
ON CONFLICT (nome) DO NOTHING;

-- Inserir dados iniciais de fazendas
INSERT INTO fazendas (nome) VALUES 
  ('Barro'),
  ('Barroca')
ON CONFLICT (nome) DO NOTHING;

-- Inserir descrições pré-definidas
INSERT INTO descricoes (nome) VALUES 
  ('nutrição equinos'),
  ('sanidade equinos'),
  ('nutrição bovinos'),
  ('sanidade bovinos'),
  ('cerca'),
  ('cochos'),
  ('bebedouros'),
  ('rede hidráulica'),
  ('sementes'),
  ('IATF'),
  ('veterinário'),
  ('curral'),
  ('sede'),
  ('energia solar'),
  ('rede elétrica'),
  ('combustível')
ON CONFLICT (nome) DO NOTHING;
