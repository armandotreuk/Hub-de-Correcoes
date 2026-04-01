# Plano Técnico de Implementação v4 (Tech Spec) - RF001 Correções por IA

Este documento detalha a arquitetura técnica para implementar as 5 abas do módulo Correções por IA conforme definido em `User_Stories_v2.md` (v4). Aplicação Angular (Standalone Components) com identidade visual baseada em `Design_Patterns.md`.

## 1. Arquitetura de Componentes Front-End

Todos os componentes ficam em `/src/app/features/ia-corrections/`.

### 1.0 Componentes Compartilhados

#### 1.0.1 `MultiSelectDropdownComponent` (EXISTENTE — Manter)
**Diretório**: `components/shared/multi-select-dropdown/`
- Dropdown genérico e reutilizável com checkbox de múltipla seleção e busca por digitação.
- Sem alterações na v4.

#### 1.0.2 `PromptDetailModalComponent` (EXISTENTE — Atualizar v4)
**Diretório**: `components/shared/prompt-detail-modal/`
- **Atualização v4**: Adicionar exibição dos dois campos de corpo do prompt (Avaliação e Feedback), ambos em modo **readonly**.
- **Inputs**: `prompt: Prompt` (agora possui `bodyEvaluation` e `bodyFeedback`), `isOpen: boolean`, `allowEdit: boolean`
- **Layout atualizado**:
  - Campos Título, Unidade, Tipo de Atividade → **readonly** com background cinza diferenciado.
  - Campo **Prompt Avaliação** → **readonly** com background cinza.
  - Campo **Prompt Feedback** → **readonly** com background cinza.
  - Campo Observações → **editável** + botão "Salvar Comentário".

#### 1.0.3 `SweetAlertService` (NOVO v4)
**Diretório**: `services/sweet-alert.service.ts`
- Serviço utilitário para padronizar sweet alerts em todo o módulo.
- **Métodos**:
  - `showLoading(message: string)`: Exibe alert de loading (sem botão de fechar).
  - `closeLoading()`: Fecha o loading.
  - `confirmAction(title: string, message: string): Promise<boolean>`: Exibe alert de confirmação (Sim/Não) e retorna true se confirmado.
  - `showSuccess(title: string, message: string)`: Exibe alert de conclusão com sucesso.
  - `showError(title: string, message: string)`: Exibe alert de erro.
- **Dependência**: Utilizar a biblioteca `sweetalert2` (instalar via `npm install sweetalert2`).

---

### 1.1 `IaCorrectionsPageComponent` (Container Principal)
- **Atualização v4**: Renomear o texto da aba 3 de "Configurar Correção" para **"Ativar Correção por IA"**.
- **UI**: Título da página, Breadcrumbs e controle de abas:
  1. Cadastro Prompt
  2. Relacionar Prompt
  3. **Ativar Correção por IA** *(renomeado)*
  4. Auditoria Correções
  5. Publicação de Notas

---

### 1.2 `PromptRegistrationTabComponent` (Aba 1 — Cadastro Prompt)
- **Função**: CRUD de Prompts (US01, US02, US03, US03.1, US03.2, US03.3, US03.4).
- **Alterações v4**:
  - **Dois campos de corpo**: Substituir o campo único "Corpo do Prompt" por dois textareas:
    1. **Prompt Avaliação** (textarea, até 10.000 chars)
    2. **Prompt Feedback** (textarea abaixo, até 10.000 chars)
  - **Situação como Dropdown**: Mover o badge de Ativo/Inativo para um **dropdown** (`<select>`) posicionado **à direita do dropdown de Tipo de Atividade**, na mesma linha (3 colunas: Unidade | Atividade | Situação). O dropdown deve seguir o mesmo estilo visual (mesma altura, borda, cor) dos demais.
  - **Contorno nos Cards**: Adicionar `border` visível a cada `.prompt-item` na lista.
  - **Badge de "Ativo" legível**: Alterar a cor de fundo e fonte do badge "Ativo" nos cards da lista para garantir alta legibilidade (ex: fundo `#0ab39c` com texto branco, ou fundo escuro com texto claro).
- **Conteúdo Visual Atualizado**:
  - **Painel Esquerdo / Lista**:
    - **Filtros** (acima da lista): Unidade, Atividade, Situação (checkboxes Ativo/Inativo).
    - Lista de prompts com contorno nos cards e badge de status legível.
  - **Painel Direito / Editor**:
    - Campo `Título` (input text)
    - **Linha de 3 colunas**: `Unidade de Negócio` | `Tipo de Atividade` | `Situação` (dropdown, Ativo por padrão)
    - Campo `Prompt Avaliação` (textarea, 10.000 chars)
    - Campo `Prompt Feedback` (textarea abaixo, 10.000 chars)
    - Campo `Observações` (textarea, 10.000 chars) + botão "Salvar Comentário"
  - **Ações**: "Criar Novo Prompt", "Salvar", "Salvar Comentário"
  - **Guard de Navegação**: Intercepta mudança de aba/rota se há alterações não salvas

---

### 1.3 `PromptLinkingTabComponent` (Aba 2 — Relacionar Prompt)
- **Função**: Vincular/desvincular prompts a **Disciplinas**. Vinculação em massa inteligente e modal de detalhe. (US04 a US07)
- **Alterações v4**:
  - Filtros agora incluem: Unidade → Cluster → Curso → Disciplina → Tipo de Atividade.
  - Botão **"Pesquisar"** ao lado dos filtros — filtros só aplicados ao clicar.
  - Lógica inteligente de vinculação em massa com sweet alerts.
  - Coluna **Disciplina** adicionada à tabela.
  - Vínculos são feitos por disciplina, não por curso.
- **Conteúdo Visual**:
  - **Filtros Hierárquicos** (usando `MultiSelectDropdownComponent`):
    1. Unidade de Negócio
    2. Cluster (cascata de Unidade)
    3. Curso (cascata de Cluster)
    4. Disciplina (cascata de Curso)
    5. Tipo de Atividade
    6. **Botão "Pesquisar"** *(NOVO v4)*
  - **Área de Vinculação em Massa**: Dropdown de prompt + botão "Vincular Prompt em Massa" com texto dinâmico mostrando quantidade
  - **Tabela Reestruturada**: Checkbox | Unidade | Atividade | Cluster | Curso | **Disciplina** | Prompt Vinculado (clicável → abre modal)
  - **Modal de Detalhe** (`PromptDetailModalComponent`): ao clicar no prompt vinculado
  - **Paginação**: Padrão Auditoria

---

### 1.4 `CorrectionConfigTabComponent` (Aba 3 — Ativar Correção por IA)
- **Função**: Ativar/inativar correção por IA em cada combinação (US08 a US11).
- **Alterações v4**:
  - **Nome da aba**: "Ativar Correção por IA".
  - Botão **"Pesquisar"** ao lado dos filtros.
  - Botão **"Ativar em Massa"** (fixo, lógica inteligente, renomeado de "Alterar Status").
  - Coluna **Disciplina** na tabela.
  - Modal do prompt ao clicar no nome do prompt.
  - Botão de **exportação**.
  - Sweet alerts padronizados para confirmação e conclusão.
- **Conteúdo Visual**:
  - **Filtros** + **Botão "Pesquisar"** *(NOVO v4)*: Unidade → Cluster → Curso → Disciplina → Atividade → Prompt → Status.
  - **Botão "Ativar em Massa"** *(fixo, com contagem dinâmica, sweet alerts)*
  - **Botão de Exportação** *(NOVO v4)*
  - **Tabela**: Checkbox, Status (badge clicável), Unidade, Cluster, Curso, **Disciplina**, Atividade, **Prompt (clicável → modal)**.
  - **Paginação**: Padrão Auditoria

---

### 1.5 `AuditTabComponent` (Aba 4 — Auditoria Correções) — EXISTENTE / REFERÊNCIA
- **Função**: Manter a implementação atual (US12). **Referência de paginação para todo o módulo.**
- **Nenhuma alteração** funcional na aba na v4.

---

### 1.6 `PublicationTabComponent` (Aba 5 — Publicação de Notas)
- **Função**: Gerenciar publicação automática de notas (US13 a US15).
- **Alterações v4**:
  - Remover o `%` do campo Nota.
  - Adicionar coluna e filtro de **Disciplina** (após Curso).
  - Botão **"Pesquisar"** após os filtros.
  - Substituir toggle por botão **"Ativar Publicação"** (lógica inteligente de massa).
  - Remover critério de bloqueio retroativo (US14 atualizada).
- **Conteúdo Visual**:
  - **Bloco Superior (Layout 50/50)**:
    - **Esquerda** (50%): Regras textuais de publicação automática.
    - **Direita** (50%): Configurações globais:
      - Campo `Nota` (input number, 0–100, inteiro, **SEM "%"**)
      - Campo `Prazo de publicação` (input number, 0–99, inteiro, em **dias**)
      - Botão `Ativar Publicação` *(substituiu o toggle)* com subtexto "Aprovar liberação de nota automática"
      - Botão desabilitado se Nota/Prazo inválidos.
  - **Filtros** + **Botão "Pesquisar"**: Unidade → Cluster → Curso → **Disciplina** → Atividade → Prompt → Status Pub.
  - **Botão "Ativar Publicação"** *(fixo, com contagem dinâmica, sweet alerts)*
  - **Tabela**: Checkbox, Status Pub. (bloqueado se correção inativa), Correção, Unidade, Cluster, Curso, **Disciplina**, Atividade, Prompt.
  - **Paginação**: Padrão Auditoria

---

## 2. Gerenciamento de Dados (Services & State)

### 2.1 `PromptService` (EXISTENTE — Atualizar v4)
Atualizar para suportar os dois corpos de prompt:
- Interface `Prompt`: substituir `body: string` por `bodyEvaluation: string` e `bodyFeedback: string`.
- `createPrompt(payload)`: Payload agora inclui `bodyEvaluation` e `bodyFeedback`.
- `updatePrompt(id, payload)`: Idem.
- Mock data: atualizar todos os prompts para incluir ambos os campos.
- Manter demais métodos sem alteração.

### 2.2 `PromptLinkingService` (EXISTENTE — Atualizar v4)
Migrar de **Curso** para **Disciplina**:
- Adicionar interface `Discipline` com campos: `id`, `name`, `courseId`, `courseName`, `clusterId`, `clusterName`, `businessUnitId`.
- Adicionar mock data de disciplinas (pelo menos 5 por curso).
- `getAllDisciplines()`: **NOVO** — retorna lista de disciplinas.
- `linkPromptToDisciplines(promptId, promptTitle, disciplineIds[], activityTypeName)`: **NOVO** — vincula prompt a múltiplas disciplinas em lote.
- `unlinkPromptFromDiscipline(linkId)`: **NOVO** — remove vínculo.
- `PromptLink`: atualizar interface para usar `disciplineId` e `disciplineName` ao invés de `courseId` e `courseName`.
- Manter validação de unicidade (Disciplina + Tipo de Atividade).

### 2.3 `CorrectionConfigService` (EXISTENTE — Atualizar v4)
- Adicionar campo `disciplineName` aos mocks de `CorrectionConfig`.
- Adicionar campos de auditoria: `createdAt`, `createdBy`, `updatedAt`, `updatedBy` (para exportação).
- Método de exportação: `exportConfigs(): CorrectionConfig[]` — retorna todos os configs para gerar arquivo.

### 2.4 `IaConfigMockService` (EXISTENTE — Manter para Auditoria)
Sem alterações.

### 2.5 `PublicationService` (EXISTENTE — Atualizar v4)
- Adicionar campo `disciplineName` aos mocks de `PublicationConfig`.
- Manter demais métodos.

### 2.6 `SweetAlertService` (NOVO v4)
- Serviço centralizado para sweet alerts (loading, confirmação, sucesso, erro).
- Dependência: `sweetalert2`.

### 2.7 Modelos de Dados (Atualizações v4)

```typescript
// Atualizar interface Prompt:
export interface Prompt {
  id: string;
  title: string;
  bodyEvaluation: string;  // v4: substituiu 'body'
  bodyFeedback: string;     // v4: novo campo
  businessUnitId: number;
  businessUnitName: string;
  activityTypeId: number;
  activityTypeName: string;
  createdAt: string;
  createdBy: string;
  status: 'Ativo' | 'Inativo';
  observations: string;
}

// Nova interface:
export interface Discipline {
  id: number;
  name: string;
  courseId: number;
  courseName: string;
  clusterId: number;
  clusterName: string;
  businessUnitId: number;
}

// Atualizar interface PromptLink:
export interface PromptLink {
  id: string;
  promptId: string;
  promptTitle: string;
  disciplineId: number;     // v4: substituiu courseId
  disciplineName: string;   // v4: substituiu courseName
  courseId: number;          // mantido para contexto
  courseName: string;       // mantido para contexto
  clusterId: number;
  clusterName: string;
  activityTypeName: string;
}

// Atualizar interface CorrectionConfig:
export interface CorrectionConfig {
  id: string;
  businessUnitName: string;
  clusterName: string;
  courseName: string;
  disciplineName: string;   // v4: novo campo
  activityTypeName: string;
  promptTitle: string;
  correctionStatus: 'Ativo' | 'Inativo';
  createdAt: string;        // v4: novo para exportação
  createdBy: string;        // v4: novo para exportação
  updatedAt: string;        // v4: novo para exportação
  updatedBy: string;        // v4: novo para exportação
}

// Atualizar interface PublicationConfig:
export interface PublicationConfig {
  id: string;
  businessUnitName: string;
  clusterName: string;
  courseName: string;
  disciplineName: string;   // v4: novo campo
  activityTypeName: string;
  promptTitle: string;
  correctionStatus: 'Ativo' | 'Inativo';
  publicationStatus: 'Habilitado' | 'Desabilitado';
  performanceThreshold: number | null;
  activatedBy: string;
  activatedAt: string;
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

Sem alterações no padrão. Todas as tabelas (Abas 2, 3, 4, 5) mantêm o mesmo layout.

---

## 5. Padrão de Sweet Alerts (NOVO v4)

```typescript
// Loading (durante busca/processamento)
Swal.fire({
  title: 'Processando...',
  text: 'Aguarde enquanto os dados são carregados.',
  allowOutsideClick: false,
  didOpen: () => Swal.showLoading()
});

// Confirmação (antes de ação em massa)
const result = await Swal.fire({
  title: 'Confirmar Vinculação',
  text: `Deseja vincular o prompt a ${count} registros?`,
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar'
});

// Conclusão (após execução)
Swal.fire({
  title: 'Concluído!',
  text: `${updated} registros vinculados. ${skipped} já possuíam este prompt.`,
  icon: 'success'
});
```

---

## 6. Ordem e Plano de Execução v4

1. **Fase A — Dependências & Shared**: Instalar `sweetalert2`, criar `SweetAlertService`, atualizar `PromptDetailModalComponent` (dois corpos).
2. **Fase B — Modelos & Services**: Atualizar `Prompt` (dois corpos), `PromptLink` (disciplina), `CorrectionConfig` (disciplina + auditoria), `PublicationConfig` (disciplina). Criar `Discipline` interface. Atualizar services com novos mocks e métodos.
3. **Fase C — Aba 1 (Cadastro Prompt)**: Implementar dois textareas, dropdown de Situação, contorno nos cards, badge de Ativo legível.
4. **Fase D — Aba 2 (Relacionar Prompt)**: Adicionar filtros Cluster/Curso/Disciplina, botão Pesquisar, coluna Disciplina, lógica inteligente de vinculação em massa com sweet alerts.
5. **Fase E — Aba 3 (Ativar Correção por IA)**: Renomear aba, adicionar botão Pesquisar, botão "Ativar em Massa" fixo com lógica inteligente, coluna Disciplina, modal de prompt, botão de exportação, sweet alerts.
6. **Fase F — Aba 5 (Publicação de Notas)**: Remover %, adicionar coluna/filtro Disciplina, botão Pesquisar, substituir toggle por botão "Ativar Publicação" com lógica inteligente, atualizar US14, sweet alerts.
7. **Fase G — QA & Merge**: Testes manuais, validação de fluxos, commit/push.
