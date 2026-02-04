-- Adicionar coluna descricao na tabela produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS descricao TEXT;
