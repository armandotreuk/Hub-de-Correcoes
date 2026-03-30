# Plano Técnico de Implementação v3 (Tech Spec) - RF001 Correções por IA

Este documento detalha a arquitetura técnica para implementar as 5 abas do módulo Correções por IA conforme definido em `User_Stories_v2.md` (v3). Aplicação Angular (Standalone Components) com identidade visual baseada em `Design_Patterns.md`.

## 1. Arquitetura de Componentes Front-End

Todos os componentes ficam em `/src/app/features/ia-corrections/`.

### 1.0 Componentes Compartilhados (NOVOS)

#### 1.0.1 `MultiSelectDropdownComponent`
**Diretório**: `components/shared/multi-select-dropdown/`
- **Função**: Dropdown genérico e reutilizável com checkbox de múltipla seleção e busca por digitação.
- **Inputs**: `options: {value, label}[]`, `label: string`, `placeholder: string`
- **Outputs**: `selectionChange: EventEmitter<any[]>`
- **Comportamento**:
  - Input de texto no topo para filtrar opções por digitação.
  - Ícone de seta para abrir/fechar dropdown.
  - Primeira opção: "Selecionar todas" — toggle entre selecionar e desselecionar todas.
  - Checkbox a frente de cada opção.
  - Emite array de valores selecionados a cada mudança.
- **Usado em**: Aba 2 (filtros), Aba 3 (filtros), Aba 5 (filtros).

#### 1.0.2 `PromptDetailModalComponent`
**Diretório**: `components/shared/prompt-detail-modal/`
- **Função**: Modal centralizado para exibir detalhes de um prompt com campos parcialmente bloqueados.
- **Inputs**: `prompt: Prompt`, `isOpen: boolean`
- **Outputs**: `close: EventEmitter`, `saveObservations: EventEmitter<{id, observations}>`
- **Comportamento**:
  - Campos Título, Unidade, Tipo de Atividade, Corpo → **readonly** com background cinza diferenciado.
  - Campo Observações → **editável** + botão "Salvar Comentário".
  - Overlay com fundo semi-transparente, modal centralizado.

---

### 1.1 `IaCorrectionsPageComponent` (Container Principal)
- **Função**: Smart Component hospedeiro. Gerencia as 5 abas.
- **UI**: Título da página, Breadcrumbs e controle de abas:
  1. Cadastro Prompt
  2. Relacionar Prompt
  3. Configurar Correção
  4. Auditoria Correções
  5. Publicação de Notas

---

### 1.2 `PromptRegistrationTabComponent` (Aba 1 — Cadastro Prompt)
- **Função**: CRUD de Prompts (US01, US02, US03, US03.1, US03.2, US03.3).
- **Conteúdo Visual**:
  - **Painel Esquerdo / Lista**:
    - **Filtros** (acima da lista):
      - Dropdown "Unidade de Negócio" (não obrigatório)
      - Dropdown "Tipo de Atividade" (não obrigatório)
      - Filtro "Situação": checkboxes "Ativo" e "Inativo" (múltipla seleção, default: Ativo marcado)
    - Lista de prompts filtrados (título + badges de Unidade e Atividade)
  - **Painel Direito / Editor**:
    - **Badge Situação**: Ativo/Inativo clicável (ao lado do título do editor)
    - Campo `Título` (input text)
    - Dropdowns `Unidade de Negócio` e `Tipo de Atividade` (obrigatórios)
    - Campo `Corpo do Prompt` (textarea largo, até 10.000 caracteres)
    - Campo `Observações` (textarea, até 10.000 caracteres) + botão "Salvar Comentário" independente
  - **Ações**: Botões "Criar Novo Prompt", "Salvar" (prompt), "Salvar Comentário" (observações)
  - **Guard de Navegação**: Intercepta mudança de aba/rota se há alterações não salvas

---

### 1.3 `PromptLinkingTabComponent` (Aba 2 — Relacionar Prompt)
- **Função**: Vincular/desvincular prompts a Cursos. Vinculação em massa e modal de detalhe. (US04 a US07)
- **Conteúdo Visual**:
  - **Filtros Hierárquicos** (usando `MultiSelectDropdownComponent`):
    1. Unidade de Negócio (dropdown multi-select)
    2. Tipo de Atividade (dropdown multi-select, cascata de Unidade)
    3. Prompt (dropdown multi-select, cascata de Unidade + Atividade)
  - **Área de Vinculação em Massa**: Dropdown de prompt + botão "Vincular" (aplica aos registros com checkbox)
  - **Tabela Reestruturada**: Col 1: Checkbox | Col 2: Unidade | Col 3: Tipo de Atividade | Col 4: Cluster | Col 5: Curso | Col 6: Prompt Vinculado (clicável → abre modal)
  - **Modal de Detalhe** (`PromptDetailModalComponent`): ao clicar no prompt vinculado
  - **Paginação**: Padrão Auditoria (25 default, 10/25/50/100, Anterior/Próximo)

---

### 1.4 `CorrectionConfigTabComponent` (Aba 3 — Configurar Correção)
- **Função**: Ativar/inativar correção por IA em cada combinação (US08 a US11).
- **Conteúdo Visual**:
  - **Filtros** (usando `MultiSelectDropdownComponent`): Unidade → Cluster → Curso → Atividade → Prompt → Status. Hierarquia em cascata.
  - **Tabela Consolidada**: Checkbox, Status (badge clicável), Unidade, Cluster, Curso, Atividade, Prompt.
  - **Ações**: Badge clicável individual + Checkbox de seleção múltipla + botão "Alterar Status" (lote).
  - **Paginação**: Padrão Auditoria (25 default, 10/25/50/100, Anterior/Próximo)

---

### 1.5 `AuditTabComponent` (Aba 4 — Auditoria Correções) — EXISTENTE / REFERÊNCIA
- **Função**: Manter a implementação atual (US12). **Referência de paginação para todo o módulo.**
- **Conteúdo Visual**:
  - Tabela com: Checkbox, Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - Filtros input-text por coluna, ordenação clicável.
  - **Paginação padrão**: Seletor "Exibindo [10/25/50/100] por página" + "Página X de Y" + botões "← Anterior" / "Próximo →" com ícones e disabled states.
  - Seleção em lote + botão "Alterar Status".
- **Nenhuma alteração** funcional na aba. Apenas serve como referência visual.

---

### 1.6 `PublicationTabComponent` (Aba 5 — Publicação de Notas)
- **Função**: Gerenciar publicação automática de notas (US13 a US15).
- **Conteúdo Visual**:
  - **Bloco Superior (Layout 50/50)**:
    - **Esquerda** (50%): Regras textuais de publicação automática.
    - **Direita** (50%): Configurações globais:
      - Campo `Nota` (input number, 0–100, inteiro)
      - Campo `Prazo de publicação` (input number, 0–99, inteiro, em **dias**)
      - Toggle `Publicação Automática` com subtexto "Aprovar liberação de nota automática"
      - Toggle desabilitado se Nota/Prazo inválidos.
      - Ao ativar/desativar → grava Nota + Prazo + status.
  - **Filtros** (mesmos da Aba 3 — `MultiSelectDropdownComponent` com cascata)
  - **Tabela**: Checkbox, Status Pub. (bloqueado se correção inativa), Correção, Unidade, Cluster, Curso, Atividade, Prompt.
  - **Paginação**: Padrão Auditoria (25 default, 10/25/50/100, Anterior/Próximo)

---

## 2. Gerenciamento de Dados (Services & State)

### 2.1 `PromptService` (EXISTENTE — Atualizar)
Atualizar para suportar novos campos e métodos:
- `getPrompts()`: Retorna lista de prompts (agora com `status` e `observations`).
- `getPromptById(id)`: Retorna prompt específico.
- `createPrompt(payload)`: Cria novo prompt (status default: Ativo).
- `updatePrompt(id, payload)`: Atualiza prompt existente.
- `updatePromptStatus(id, status)`: **NOVO** — alterna entre Ativo e Inativo.
- `updatePromptObservations(id, observations)`: **NOVO** — salva apenas observações.
- `getBusinessUnits()`: Retorna unidades de negócio.
- `getActivityTypes()`: Retorna tipos de atividade.

### 2.2 `PromptLinkingService` (EXISTENTE — Atualizar)
Atualizar para suportar vinculação em massa:
- `linkPromptToCourses(promptId, courseIds[])`: **NOVO** — vincula prompt a múltiplos cursos em lote.
- Manter métodos existentes.

### 2.3 `CorrectionConfigService` (EXISTENTE — Manter)
Sem alterações de API.

### 2.4 `IaConfigMockService` (EXISTENTE — Manter para Auditoria)
Sem alterações.

### 2.5 `PublicationService` (EXISTENTE — Atualizar)
- `getGlobalSettings()`: **NOVO** — retorna `{ note, deadline, autoPublicationEnabled }`.
- `saveGlobalSettings(note, deadline, enabled)`: **NOVO** — grava configurações globais.
- Manter métodos existentes.

### 2.6 Modelos de Dados (Atualizações)

```typescript
// Adicionar à interface Prompt:
status: 'Ativo' | 'Inativo';     // default: 'Ativo'
observations: string;              // até 10.000 caracteres

// Nova interface:
export interface PublicationGlobalSettings {
  note: number | null;             // 0-100
  deadline: number | null;         // 0-99 (dias)
  autoPublicationEnabled: boolean; // default: false
}
```

---

## 3. Roteamento (Routing)

Manter a rota existente sem alterações:
```typescript
{
  path: 'correcoes-ia',
  loadComponent: () => import('./features/ia-corrections/ia-corrections-page.component')
    .then(c => c.IaCorrectionsPageComponent),
  canDeactivate: [unsavedChangesGuard]
}
```

---

## 4. Padrão de Paginação (Referência: Auditoria)

Todas as tabelas do módulo (Abas 2, 3, 4, 5) devem usar o seguinte layout de paginação:

```html
<div class="pagination-footer d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
  <div class="page-size-selector text-muted">
    Exibindo
    <select class="custom-select-sm" ...>
      <option value="10">10</option>
      <option value="25">25</option>  <!-- default -->
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
    por página
  </div>
  <div class="pagination-controls data-text">
    Página X de Y
    <button class="btn btn-sm btn-light ml-2" [disabled]="currentPage() === 1">
      <i class="ri-arrow-left-s-line"></i> Anterior
    </button>
    <button class="btn btn-sm btn-light ml-1" [disabled]="currentPage() === totalPages()">
      Próximo <i class="ri-arrow-right-s-line"></i>
    </button>
  </div>
</div>
```

---

## 5. Ordem e Plano de Execução v3

1. **Fase A — Componentes Compartilhados**: Criar `MultiSelectDropdownComponent` e `PromptDetailModalComponent`.
2. **Fase B — Modelos & Services**: Atualizar `Prompt` (status, observations), `PublicationService` (global settings), `PromptLinkingService` (bulk link).
3. **Fase C — Aba 1 Aprimorada**: Filtros, badge status, campo observações, botão "Salvar Comentário".
4. **Fase D — Aba 2 Reestruturada**: Filtros hierárquicos, nova ordenação de colunas, vinculação em massa, modal de detalhe.
5. **Fase E — Aba 3 Multi-Select**: Substituir filtros por MultiSelectDropdown com cascata. Padronizar paginação.
6. **Fase F — Aba 5 Layout Split**: Painel 50/50, campos globais (Nota/Prazo/Toggle), filtros multi-select, paginação padronizada.
7. **Fase G — QA & Merge**: Testes manuais via browser, validação de todos os fluxos, commit/push.
