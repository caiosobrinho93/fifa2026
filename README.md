# 🏆 Copa Album 2026

Um aplicativo premium de álbuns de figurinhas digitais para a Copa do Mundo FIFA 2026, inspirado em jogos como Hearthstone e Clash Royale.

## 🚀 Tecnologias

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend**: Supabase (PostgreSQL, RLS, Auth).
- **Mobile**: PWA ready, Capacitor ready.
- **Animações**: Framer Motion & Canvas-confetti.
- **3D**: React Three Fiber / Drei (infraestrutura pronta).

## 🛠️ Instalação

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   ```
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📂 Estrutura do Projeto

- `src/app`: Rotas e páginas (Home, Packs, Album, Mercado, Trocas, Desafios).
- `src/components/game`: Componentes lógicos do jogo (Cartas, Abertura de Packs, Grid do Álbum).
- `src/components/layout`: Componentes de interface global (Header, BottomNav).
- `src/lib`: Configurações de serviços (Supabase) e utilitários.
- `src/types`: Definições de interfaces TypeScript.
- `src/styles`: Estilos globais e tokens de design.

## ✨ Recursos Implementados

- ✅ **Sistema de Abertura de Packs**: Animações cinematográficas e efeitos de partículas.
- ✅ **Álbum Digital**: Visualização de coleção com progresso e slots vazios.
- ✅ **Marketplace**: Listagem de cartas e sistema de tendências.
- ✅ **Trocas**: Interface de propostas de troca entre usuários.
- ✅ **Economia Virtual**: Gestão de moedas (Coins) e gemas (Gems).
- ✅ **Holographic Cards**: Efeitos visuais premium em cartas raras.
- ✅ **PWA**: Manifesto configurado para instalação mobile.

## 🗄️ Banco de Dados

O esquema do banco de dados está localizado em `src/lib/supabase/schema.sql`. Ele inclui tabelas para perfis, jogadores, cartas de usuários, marketplace, trocas e transações.

---

Desenvolvido com ❤️ para a Copa do Mundo 2026.
