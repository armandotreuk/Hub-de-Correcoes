# Plano Técnico de Implementação v5 (Tech Spec) - RF001 Correções por IA

> **Escopo v5**: Detalha a arquitetura técnica focada nas abas **Cadastro Prompt** e na nova **Matriz de Configurações**, que unificou as antigas abas (Relacionar Prompt, Ativar Correção, Publicação de Notas).

---

## 1. Arquitetura de Componentes Front-End

Todos os componentes ficam em `/src/app/features/ia-corrections/`.

### 1.0 Componentes Compartilhados

#### 1.0.1 `MultiSelectDropdownComponent` (EXISTENTE)
- Dropdown genérico e reutilizável com checkbox de múltipla seleção e busca por digitação.

#### 1.0.2 `PromptDetailModalComponent` (EXISTENTE)
- **Inputs**: `prompt: Prompt`, `isOpen: boolean`, `allowEdit: boolean`
- Exibe os campos de Título, Unidade, Atividade, Corpo de Avaliação e Corpo de Feedback em modo **readonly**.
- Permite edição no campo de Observações com botão "Salvar Comentário".

#### 1.0.3 `SweetAlertService` (EXISTENTE / EXPANDIDO v5)
- Utilitário para padronizar validações visuais e fluxos com a biblioteca `sweetalert2`.
- **Métodos atualizados**:
  - `showLoading(message)` e `closeLoading()`
  - `confirmAction(title, message)`
  - `showSuccess(title, message)` e `showError(title, message)`
  - `configurePublicationModal()` **(Novo v5)**: Exibe SweetAlert com HTML customizado contendo inputs para Nota Mínima e Prazo, com `preConfirm` que impede a submissão se campos estiverem vazios.

---

### 1.1 `IaCorrectionsPageComponent` (Container Principal)

- **UI**: Título da página, Breadcrumbs e controle de abas:
  1. Cadastro Prompt (Ativa)
  2. Matriz de Configurações (Ativa / Implementação unificada definitiva)
  3. Auditoria Correções (Referência/Histórico)
  *(Demais abas legadas foram totalmente substituídas e podem ser removidas)*

---

### 1.2 `PromptRegistrationTabComponent` (Aba 1 — Cadastro Prompt)

> Nenhuma alteração funcional desde a v4.

- **Função**: CRUD de Prompts. Formulário à direita e grid de visualização à esquerda com contornos definidos nos cards.
- Possui campos para `Prompt Avaliação` e `Prompt Feedback` (ambos até 10.000 chars).
- Filtros na lista: Unidade, Atividade e Situação (checkbox duplo). Dropdown de status posicionado linearmente com dropdowns de entidades de estrutura.
- Validação de save-and-close via HostListener/guard antes da transição de abas.

---

### 1.3 `MatrixConfigurationTabComponent` (Aba 2 — Matriz Unificada)

- **Função**: Visão única combinando Relacionamento de Prompts, Ativação de IA e Publicação Automática de Notas, renderizada como um Dashboard configurador complexo de Grid única.

#### A. Estrutura de Filtros (Painel Superior)
- Componente contém duas linhas (`row`) organizadas:
  - **Linha 1**: `MultiSelectDropdown` de **Atividade**, Unidade, Cluster, Curso e Disciplina.
  - **Linha 2**: `MultiSelectDropdown` de Prompt (reativo ao contexto), Status IA (Ativo/Inativo), Status Publicação (Ativa/Inativa), e Botão `onSearch()`.
- Filtros atuam em array pre-cacheados; busca atualiza o Signal de `filteredRows`.

#### B. Ações em Massa (Action Bar)
- Título dinâmico contando registros (`filteredRows().length` ou tamanho do selection Set).
- Botões que chamam métodos com lógica baseada no contexto (seleção customizada vs total filtrado):
  - `onBulkLinkPrompt()`: Valida selectedActivityTypes(). Se < 1 ou > 1, barra com Swal.showError. Retorna options para Swal.select formatadas via reduce de `this.prompts`.
  - `onBulkToggleIa()`: Altera Signal da flag `correctionStatus`.
  - `onBulkConfigurePublication()`: Aciona Swal Form, salva inputs, propaga aos ids alvos do `filteredRows`.

#### C. Renderização Matricial (Grid)
- Checkboxes mestres e individuais gerenciados por Set (`selectedIds`).
- `Activity Type Badge`: Método helper `getActivityColorClass()` injeta a classe Bootstap CSS correta mapenado cada valor (ex: *Resenha -> badge-soft-info*).
- `Prompt Clicável`: Interação que dispara a abertura do `PromptDetailModalComponent`.
- `Status`: Exibe labels textuais (Ativa/Inativa) com classes badge-soft visuais correspondentes.

#### D. Drawer de Parametrização Individual
- Variável booleana `isDrawerOpen` e variável tipada `selectedRowForDrawer`.
- Painel fixado via CSS (`position: fixed; right: 0;`).
- Permite update atômico sem invocar a barra de massa.

#### E. Regras e Validações UI
- Botão Informativo (`showRegras`): Abre swal readonly informando regras sequenciais.

---

## 2. Gerenciamento de Dados (Camada de Serviços / Mocks)

A matriz v5 precisa unir os logs das três "fases" conceituais das antigas abas num Unified Model (DTO Frontend).

### 2.1 Modelo Unificado `UnifiedConfigRow`

```typescript
export interface UnifiedConfigRow {
  id: string; // Aggregate Hash (ex: `disc_${disciplineId}_act_${activityTypeId}`)
  disciplineId: number;
  disciplineName: string;
  courseName: string;
  clusterName: string;
  businessUnitName: string;
  activityTypeName: string;
  promptId?: string;
  promptTitle?: string;
  correctionStatus: 'Ativo' | 'Inativo';
  publicationStatus: 'Ativa' | 'Inativa'; // Atualizado da terminologia antiga Habilitado/Desabilitado
  note?: number | null;
  deadline?: number | null;
}
```

### 2.2 Estratégia de Aggregation (RxJS `forkJoin`)

O componente invoca `forkJoin` ou encadeamento no `ngOnInit` / `loadAllData()` usando os 4 services mantidos:

- `PromptLinkingService.getAllDisciplines()`: Base primária do grid. Cria 1 registro matriz para a disciplina base + array the activity types.
- `PromptLinkingService.getAllLinks()`: Enxerta `promptId` e `promptTitle` onde der Match por Discipline/Activity.
- `CorrectionConfigService.getConfigs()`: Enxerta `correctionStatus` = 'Ativo' se houver record, caso contrário fallback para 'Inativo'.
- `PublicationService.getValidations()`: Enxerta campos de Nota Mínima (`note`), e Prazo Máximo (`deadline`), alterando label do publicStatus para 'Ativa' de acordo.

A lógica mapeia todas as fontes no Signal principal `allRows<UnifiedConfigRow[]>`. O input dos "multi-selects" realiza Array.filter() no Array resultante na propriedade `filteredRows`.

---

## 3. Roteamento (Routing)

Módulo contido operando no Standalone paradigm do Angular v15+:

```typescript
{
  path: 'correcoes-ia',
  loadComponent: () => import('./features/ia-corrections/ia-corrections-page.component')
    .then(c => c.IaCorrectionsPageComponent)
}
```

---

## 4. Estilos Customizados (CSS Componente Matriz)

Além dos tokens Bootstrap padrões do *Velzon Theme*, implementa:
- Tabela de altura condensada minimialista.
- `.side-drawer`: Implementação flex-box em overflow fixado + dark-overlay animado com transition-transform em propriedade `translateX()`.
- `.badge-soft-*`: Extensões base para background das Tags baseadas na RN43.1.
