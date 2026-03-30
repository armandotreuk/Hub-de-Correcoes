# Plano Técnico de Implementação v2 (Tech Spec) - RF001 Correções por IA

Este documento detalha a arquitetura técnica para implementar as 5 abas do módulo Correções por IA conforme definido em `User_Stories_v2.md`. Aplicação Angular (Standalone Components) com identidade visual baseada em `Design_Patterns.md`.

## 1. Arquitetura de Componentes Front-End

Todos os componentes ficam em `/src/app/features/ia-corrections/`.

### 1.1 `IaCorrectionsPageComponent` (Container Principal)
- **Função**: Smart Component hospedeiro. Gerencia as 5 abas ativas e serve de ponte entre componentes-filhos e Services.
- **UI**: Título da página, Breadcrumbs ("Acadêmico > Avaliações > Correções por IA") e controle de abas (Tabs) com 5 abas:
  1. Cadastro Prompt
  2. Relacionar Prompt
  3. Configurar Correção
  4. Auditoria Correções
  5. Publicação de Notas

---

### 1.2 `PromptRegistrationTabComponent` (Aba 1 — Cadastro Prompt)
- **Função**: CRUD de Prompts (US01, US02, US03).
- **Conteúdo Visual**:
  - **Painel Esquerdo / Lista**: Lista de prompts criados com título e dados resumidos. Ao clicar, carrega o prompt no painel de edição.
  - **Painel Direito / Editor**:
    - Campo `Título` (input text).
    - Campo `Corpo do Prompt` (textarea largo, até 10.000 caracteres).
    - Dropdown `Unidade de Negócio` (obrigatório).
    - Dropdown `Tipo de Atividade` (obrigatório).
  - **Ações**: Botões "Criar Novo Prompt" e "Salvar".
  - **Guard de Navegação**: Intercepta mudança de aba/rota se há alterações não salvas (confirm dialog).

---

### 1.3 `PromptLinkingTabComponent` (Aba 2 — Relacionar Prompt)
- **Função**: Vincular/desvincular prompts a Cursos (US04 a US07).
- **Conteúdo Visual**:
  - **Seletor de Prompt**: Dropdown ou lista de prompts cadastrados (já filtra por Unidade e Atividade automaticamente).
  - **Navegação Hierárquica**: Filtros de Cluster e Curso baseados na Unidade de Negócio do prompt selecionado (cascata).
  - **Tabela de Cursos**: Lista paginada (100/página) exibindo: Cluster, Curso, Prompt Vinculado (ou "—" se não vinculado), Ações.
  - **Ações por Linha**: Vincular prompt, Alterar prompt, Remover vínculo.
  - **Validação de Unicidade**: Bloqueia se o curso já tem prompt para o mesmo tipo de atividade.

---

### 1.4 `CorrectionConfigTabComponent` (Aba 3 — Configurar Correção)
- **Função**: Ativar/inativar correção por IA em cada combinação (US08 a US11).
- **Conteúdo Visual**:
  - **Tabela Consolidada**: Colunas — Checkbox, Status, Unidade, Cluster, Curso, Tipo de Atividade, Prompt.
  - **Filtros**: Input-text ou dropdown em todas as colunas. Status padrão: Inativo.
  - **Ações**: Switch/toggle individual por linha + Checkbox de seleção múltipla com botão "Alterar Status" para operação em lote.

---

### 1.5 `AuditTabComponent` (Aba 4 — Auditoria Correções) — EXISTENTE
- **Função**: Manter a implementação atual (US12).
- **Conteúdo Visual**:
  - Tabela com: Checkbox, Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - Filtros input-text por coluna, ordenação clicável, paginação (25 default).
  - Seleção em lote + botão "Alterar Status".
- **Nenhuma alteração necessária** além de eventual ajuste de posição na ordem das abas.

---

### 1.6 `PublicationTabComponent` (Aba 5 — Publicação de Notas)
- **Função**: Gerenciar publicação automática de notas (US13 a US15).
- **Conteúdo Visual**:
  - **Bloco Superior (Regras de Publicação)**: Exibição das regras RN25, RN26, RN27 — campo de percentual de desempenho (%), indicador visual da regra de corte.
  - **Tabela Espelhada**: Mesma estrutura da Auditoria (Checkbox, Status Publicação, Unidade, Cluster, Curso, Atividade, Prompt, Ativado por, Data).
  - **Lógica de Dependência**: Se a correção (Aba 3) de um registro está Inativa, o toggle de publicação fica bloqueado/disabled nesta aba.
  - **Ações**: Seleção em lote + botão "Alterar Status" (mesmo padrão).

---

## 2. Gerenciamento de Dados (Services & State)

### 2.1 `PromptService` (NOVO)
Serviço dedicado ao CRUD de Prompts.
- `getPrompts()`: Retorna lista de prompts cadastrados.
- `getPromptById(id)`: Retorna um prompt específico.
- `createPrompt(payload)`: Cria um novo prompt (título, corpo, unitId, activityTypeId).
- `updatePrompt(id, payload)`: Atualiza um prompt existente.
- `deletePrompt(id)`: Exclui um prompt (se não houver vínculos).

### 2.2 `PromptLinkingService` (NOVO)
Serviço para gerenciamento de vínculos Prompt ↔ Curso.
- `getLinksByPrompt(promptId)`: Retorna cursos vinculados a um prompt.
- `getCoursesByUnit(unitId)`: Retorna cursos organizados por cluster.
- `linkPromptToCourse(promptId, courseId)`: Cria vínculo (valida unicidade Curso + Atividade).
- `unlinkPromptFromCourse(promptId, courseId)`: Remove vínculo.
- `updateCoursePrompt(courseId, newPromptId)`: Substitui o prompt vinculado.

### 2.3 `CorrectionConfigService` (NOVO)
Serviço para configuração de estado de correção.
- `getCorrectionConfigs(filters?)`: Retorna lista de combinações com status de correção.
- `updateCorrectionStatus(id, status)`: Altera status individual.
- `updateCorrectionStatuses(ids[], status)`: Altera status em lote.

### 2.4 `IaConfigMockService` (EXISTENTE — Refatorar)
Manter para a aba de Auditoria. Avaliar se os métodos existentes (`getAuditLogs`, `updateStatuses`) podem ser reutilizados pela aba de Publicação.

### 2.5 `PublicationService` (NOVO)
Serviço para configuração de publicação automática de notas.
- `getPublicationConfigs()`: Retorna lista com status de publicação.
- `updatePublicationStatus(id, status)`: Altera status individual (valida dependência com correção).
- `updatePublicationStatuses(ids[], status)`: Altera status em lote.
- `setPerformanceThreshold(id, percentage)`: Define o percentual de corte.

---

## 3. Roteamento (Routing)

Manter a rota existente:
```typescript
{ 
  path: 'correcoes-ia', 
  loadComponent: () => import('./features/ia-corrections/ia-corrections-page.component').then(c => c.IaCorrectionsPageComponent) 
}
```
As 5 abas são gerenciadas internamente pelo `IaCorrectionsPageComponent` sem rotas filhas.

---

## 4. Ordem e Plano de Execução

1. **Step 1 — Documentação**: Criar Requirements_v2 completo (Business Rules, User Stories, Tech Spec, Design Patterns). ✅
2. **Step 2 — Scaffolding de Componentes**: Criar os 3 novos componentes (PromptRegistration, PromptLinking, CorrectionConfig, PublicationTab). Refatorar IaCorrectionsPageComponent para 5 abas.
3. **Step 3 — Services**: Criar PromptService, PromptLinkingService, CorrectionConfigService, PublicationService com dados mockados.
4. **Step 4 — UI Layer**: Implementar HTML/CSS de cada aba seguindo Design_Patterns.md.
5. **Step 5 — Binding & Lógica**: Conectar signals, guards de navegação, validações de unicidade e dependência Correção→Publicação.
6. **Step 6 — QA**: Testes manuais via browser, validação de todos os fluxos.
