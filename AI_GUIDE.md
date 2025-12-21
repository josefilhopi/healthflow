# HealthFlow AI Guide (AI_GUIDE.md)

Este documento serve como um guia técnico abrangente para agentes de IA que trabalham no projeto HealthFlow. Ele detalha o stack tecnológico, arquitetura, padrões e melhores práticas.

## 1. Contexto do Projeto

O **HealthFlow** é um sistema de gestão de saúde desenvolvido para simplificar o cotidiano de Clínicas e Consultórios Médicos. Ele permite gerenciar médicos, pacientes, procedimentos, planos de saúde e agendamentos.

## 2. Stack Tecnológico

- **Frontend**: React 18+ com TypeScript.
- **Build Tool**: Vite.
- **Estilização**: Tailwind CSS (Utility-first).
- **Componentes UI**: shadcn/ui (baseado em Radix UI).
- **Roteamento**: React Router DOM v6.
- **Gerenciamento de Estado de Servidor**: TanStack React Query v5.
- **Formulários**: React Hook Form + Zod (Validação).
- **Ícones**: Lucide React.
- **Notificações**: Sonner.

## 3. Arquitetura e Estrutura de Pastas

A aplicação segue uma estrutura modular padrão:

```text
src/
├── components/     # Componentes reutilizáveis
│   ├── dashboard/  # Componentes específicos do dashboard (DataTable, EmptyState)
│   ├── layout/     # Componentes de layout (DashboardLayout, Sidebar)
│   ├── ui/         # Componentes base do shadcn/ui (botões, inputs, etc.)
│   └── landing/    # Componentes da página inicial pública
├── hooks/          # Hooks customizados (use-auth, use-mobile, etc.)
├── lib/            # Configurações de bibliotecas (utils do shadcn)
├── pages/          # Páginas completas (Index, Dashboard, LoginPage, etc.)
└── App.tsx         # Configuração de rotas e providers
```

## 4. Padrões de Desenvolvimento

### 4.1. Componentes de UI

- **Prioridade**: Sempre use componentes do `src/components/ui/` (shadcn).
- **Customização**: Se um componente precisar de mudanças drásticas, crie um novo em `src/components/` em vez de modificar o core do shadcn.
- **Estilo**: Use **apenas** classes do Tailwind. Evite CSS inline ou arquivos `.css` isolados.

### 4.2. Gerenciamento de Dados

- **Estado Local**: Use `useState` para estados simples de UI (ex: modais abertos).
- **Estado Global/Servidor**: Use **React Query** para qualquer dado vindo de API (atualmente o projeto usa dados mockados com `setTimeout`).
- **Persistência**: O status de login é mantido via `localStorage` no hook `use-auth`.

### 4.3. Roteamento e Proteção

- As rotas são definidas no `src/App.tsx`.
- Use o componente `<ProtectedRoute>` para envolver páginas que exigem autenticação.

### 4.4. Tabelas e Listagens

- Existe um padrão de `DataTable` e `EmptyState` em `src/components/dashboard/`. Sempre siga esse padrão para listagens de entidades.

## 5. Entidades do Domínio

- **Médicos (Medicos.tsx)**: CRM, Especialidade, Telefone.
- **Pacientes (Pacientes.tsx)**: CPF, Data de Nascimento, Telefone, Email.
- **Agendamentos (Agendamentos.tsx)**: Vincula Paciente, Médico e Procedimento.
- **Planos de Saúde & Procedimentos**: Cadastros de apoio.

## 6. Instruções Específicas para IA

1. **Idiomas**: O código (variáveis, funções) deve ser prioritariamente em **Inglês**, mas as interfaces (textos visíveis ao usuário) devem ser em **Português (Brasil)**.
2. **Consistência**: Ao criar novas páginas, copie o layout de `Pacientes.tsx` ou `Medicos.tsx` para manter a consistência visual e funcional (Busca -> Tabela -> Modal de Criação).
3. **Imagens**: Utilize `ImageInput.tsx` para uploads de fotos, convertendo-as para Base64 (padrão atual do projeto para simulação).
4. **Icons**: Use exclusivamente a biblioteca `lucide-react`.

---

_Nota: Este guia deve ser atualizado sempre que houver mudanças significativas na arquitetura ou introdução de novas dependências críticas._
