# Plano de Implementação de Testes Unitários para FlowFit (Next.js, Supabase, Stripe)

Este documento detalha a estratégia e o plano de ação para implementar testes unitários robustos no projeto FlowFit, visando máxima cobertura de código e confiabilidade.

## Análise da Estrutura do Projeto

O projeto utiliza a seguinte stack e organização:

*   **Next.js (App Router):** Estrutura principal, incluindo componentes de UI (`page.tsx`), layout e rotas de API (`app/api`).
*   **TypeScript:** Para tipagem estática, que contribui para a detecção precoce de erros.
*   **Supabase:** Utilizado para o backend e persistência de dados. As interações com o banco são centralizadas via `supabaseClient.ts`.
*   **Stripe:** Implementado para gerenciar pagamentos, com rotas de API específicas para a criação de sessões de checkout/portal do cliente e para o manuseio de webhooks.
*   **Organização de Código:** O projeto é bem estruturado com diretórios `src/components`, `src/hooks` e `src/utils`, o que facilita o isolamento e a testabilidade das unidades de código.

## Estratégia e Ferramentas Propostas

Para garantir uma suíte de testes eficiente e alinhada com as melhores práticas para aplicações Next.js/React, propomos o uso das seguintes ferramentas:

*   **Jest:** Framework de testes JavaScript amplamente adotado e mantido pelo Facebook, sendo o padrão de fato para o ecossistema React/Next.js devido à sua performance e vasta documentação.
*   **React Testing Library (`@testing-library/react`):** Biblioteca que facilita a escrita de testes para componentes React focados na experiência do usuário, promovendo testes mais robustos e acessíveis.
*   **`@testing-library/jest-dom`:** Estende as funcionalidades do Jest com matchers customizados para asserções mais semânticas e legíveis em elementos do DOM.
*   **Mocking:** Utilizaremos os recursos de mocking do Jest para isolar os testes de dependências externas (como Supabase e Stripe) e internas, garantindo que os testes sejam unitários e rápidos.

---

## Plano de Ação Detalhado por Etapas

Este plano está dividido em etapas sequenciais, cada uma construindo sobre a anterior.

### Etapa 1: Configuração do Ambiente de Testes (Base) - Concluído

**Objetivo:** Preparar o ambiente de desenvolvimento para a execução de testes.

*   **Ação 1.1: Instalação de Dependências:** `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`, `ts-jest` e `dotenv` foram instalados.
*   **Ação 1.2: Configuração do Jest:** Arquivos `jest.config.js` e `jest.setup.js` foram criados e configurados para carregar variáveis de ambiente.
*   **Ação 1.3: Mocks Globais:** Mocks para `supabaseClient` e `stripe` foram criados para isolar os testes.

### Etapa 2: Testes de Funções Utilitárias (Baixa Complexidade) - Em Andamento

**Objetivo:** Garantir a correção da lógica de negócio pura e isolada.

*   **Alvo:** Módulos em `src/utils/`.
*   **Foco:** Testar todas as funções, suas entradas, saídas e comportamentos de borda.
*   **Status:**
    *   `cycle_phase.ts`: **Concluído**
    *   `stats.ts`: **Concluído**
    *   `workout_select.ts`: **Concluído**
    *   `api.ts`: **Pendente** (Encontrei dificuldades com a complexidade dos mocks do Supabase. Deixarei para depois e seguirei para a próxima etapa para manter o progresso).
    *   `firebaseClient.ts`: **Pendente**
    *   `supabaseClient.ts`: **Pendente**

### Etapa 3: Testes de Hooks Customizados (Média Complexidade) - Concluído

**Objetivo:** Validar o comportamento e a lógica dos hooks personalizados do projeto.

*   **Alvo:** Hooks em `src/hooks/`.
*   **Foco:** Utilizar `renderHook` da React Testing Library para testar o estado retornado, efeitos colaterais (e.g., chamadas de API, que serão mockadas) e o ciclo de vida do hook.
*   **Metodologia:** Mockar quaisquer dependências externas (ex: `supabaseClient`) que o hook possa utilizar para garantir que o teste seja unitário.
*   **Status:**
    *   `useFlowFitData.ts`: **Concluído**
    *   `useWorkoutSession.ts`: **Concluído**

### Etapa 4: Testes de Componentes de UI (Média/Alta Complexidade) - Em Andamento

**Objetivo:** Assegurar que os componentes React se comportam visualmente e interativamente como esperado.

*   **Alvo:** Componentes em `src/components/` (ex: `LoginScreen.tsx`, `WorkoutActiveScreen.tsx`, `SubscriptionRequiredScreen.tsx`) e as páginas do Next.js (ex: `app/page.tsx`, `app/success/page.tsx`).
*   **Foco:**
    *   Testar a renderização do componente em diferentes estados (carregamento, erro, dados vazios, dados preenchidos).
    *   Simular interações do usuário (cliques em botões, preenchimento de formulários) e verificar as respostas da UI.
    *   Verificar a acessibilidade e a presença de elementos-chave que o usuário esperaria ver.
*   **Metodologia:** Utilizar `render` da React Testing Library. Mocks serão empregados para hooks personalizados e APIs de dados para controlar o comportamento do componente em teste.
*   **Status:**
    *   `SubscriptionRequiredScreen.tsx`: **A Fazer**

### Etapa 5: Testes das Rotas de API (Alta Complexidade) - A Fazer

**Objetivo:** Validar a lógica de negócio e as interações com serviços externos (mockados) nas rotas da API.

*   **Alvo:** Rotas de API em `app/api/`, especialmente as relacionadas ao Stripe:
    *   `api/create-checkout-session/route.ts`
    *   `api/create-customer-portal-session/route.ts`
    *   `api/stripe-webhook/route.ts`
*   **Foco:**
    *   **Stripe:** Testar se as chamadas para o SDK do Stripe (e.g., `stripe.checkout.sessions.create`, `stripe.customers.create`, `stripe.webhooks.constructEvent`) são feitas com os parâmetros corretos.
    *   **Webhook:** Simular eventos de webhook do Stripe e verificar se o tratamento de eventos (ex: `checkout.session.completed`) leva às ações esperadas no Supabase (e.g., atualização de status de usuário, criação de registros).
    *   **Supabase:** Mockar todas as interações com o cliente Supabase para garantir que não haja chamadas de banco de dados reais.
*   **Metodologia:** Simular requisições HTTP para essas rotas, verificando as respostas e as chamadas para os mocks.

### Etapa 6: Análise de Cobertura e Refatoração Contínua - A Fazer

**Objetivo:** Manter e melhorar a qualidade do código e a cobertura de testes.

*   **Ação 6.1: Relatórios de Cobertura:** Executar os testes com o comando de relatório de cobertura (e.g., `jest --coverage`).
*   **Ação 6.2: Identificação de Lacunas:** Analisar o relatório para identificar blocos de código não testados ou com baixa cobertura.
*   **Ação 6.3: Escrita de Testes Adicionais:** Criar novos testes para cobrir as lacunas identificadas, focando nas áreas de maior risco ou complexidade.
*   **Ação 6.4: Refatoração para Testabilidade:** Seções do código que são difíceis de testar podem indicar a necessidade de refatoração para modularizar a lógica e torná-la mais isolada e, consequentemente, mais testável.

---

Este plano serve como um guia para a implementação de uma suíte de testes robusta. Ao seguir estas etapas, o projeto FlowFit terá uma base sólida de testes, que facilitará o desenvolvimento contínuo e a manutenção, reduzindo riscos e aumentando a confiança nas entregas.