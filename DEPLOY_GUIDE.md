# Guia de Deploy e Configuração

Este guia irá ajudá-lo a configurar o banco de dados Supabase e realizar o deploy da aplicação na Vercel.

## 1. Configuração do Supabase

1.  Acesse [database.new](https://database.new) para criar um novo projeto no Supabase.
2.  Preencha os detalhes (Nome, Senha do Banco de Dados, Região).
3.  Aguarde o projeto ser criado (pode levar alguns minutos).
4.  Vá para **Project Settings (Ícone de engrenagem) > API**.
5.  Anote as chaves:
    *   `Project URL` (será `NEXT_PUBLIC_SUPABASE_URL`)
    *   `anon` public key (será `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Banco de Dados (SQL)
Vá para o **SQL Editor** no painel do Supabase e execute os scripts localizados na pasta `scripts/` deste projeto, na seguinte ordem:

1.  `scripts/001_create_tables.sql` (Cria as tabelas base)
2.  `scripts/002_seed_initial_data.sql` (Popula dados iniciais, se houver)
3.  `scripts/003_add_produto_descricao.sql` (Ajustes adicionais)

## 2. Deploy na Vercel

A maneira mais fácil de fazer o deploy é clicar no botão abaixo (mas certifique-se de estar logado na Vercel):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/idelnon/stock-control-system&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&project-name=stock-control-system)

**Passos Manuais:**

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Importe o repositório `stock-control-system` do seu GitHub.
4.  Nas configurações de deploy, vá para a seção **Environment Variables** e adicione:
    *   **Name:** `NEXT_PUBLIC_SUPABASE_URL` -> **Value:** (Sua URL do Supabase)
    *   **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> **Value:** (Sua chave Anon do Supabase)
5.  Clique em **Deploy**.

## 3. Pós-Deploy

Após o deploy, sua aplicação estará no ar! Copie a URL gerada pela Vercel e adicione-a à lista de URLs permitidas no Supabase se estiver usando autenticação (Auth > URL Configuration > Site URL / Redirect URLs).
