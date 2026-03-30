# Plano Técnico de Implementação (Tech Spec) - RF001 Correções por IA

Este documento detalha a arquitetura técnica e o plano de ação passo-a-passo ("Solutioning") para implementar as Histórias de Usuário listadas no documento `User_Stories.md`. A aplicação alvo é construída em Angular (Standalone Components) com uma identidade visual baseada no documento `Design_Patterns.md`.

## 1. Arquitetura de Componentes Front-End

A nova funcionalidade será modularizada dentro do diretório `/src/app/features/ia-corrections/`.

### 1.1 `IaCorrectionsPageComponent` (Container Principal)
- **Função**: Atuar como a página hospedeira (Smart Component). Ele gerenciará o estado (abas ativas) e fará a ponte entre as abas e os `Services`.
- **UI**: Título da página, Breadcrumbs ("Acadêmico > Avaliações > Correções por IA") e o controle de abas (Tabs): "Parametrizar Atividade" e "Auditoria de Configurações".

### 1.2 `ParameterizationTabComponent` (Aba 1 - Dumb/Presentational Component)
- **Função**: Cuidar da parametrização (US01 a US06B).
- **Conteúdo Visual**:
  - Filtros Superiores: Dropdowns para `Unidade de Negócio` e `Atividade` (US01). Dropdowns multi-seleção para `Clusters` e `Cursos`.
  - Controle Principal: Switch "Ativar Correção por IA" para o escopo global (US02).
  - Tabela Central: Lista de `Disciplinas` (US03) contendo colunas de Cluster e Curso, com o *checkbox* master "Selecionar Todas" (US04).
  - Bloco de Publicação: Switch "Registro Automático de Nota" (US05), input numérico para "Desempenho de Corte (%)" e input numérico "Publicação de notas em:" dias (US06, US06B).
  - Ações: Botões `Salvar` e `Cancelar`.

### 1.3 `AuditTabComponent` (Aba 2 - Dumb/Presentational Component)
- **Função**: Listar e gerir parâmetros já ativos (US07 a US09).
- **Conteúdo Visual**:
  - Tabela rica em UI baseada no *Design_Patterns.md*.
  - Funcionalidades Tabela: Filtros input-text textuais no header individual das colunas, ordenação clicável e paginação base padrão a 25 registros por página.
  - Colunas: `Checkbox Select`, `Status`, `Unidade`, `Atividade`, `Cluster`, `Curso`, `Disciplina`, `Prompt`, `Usuário Modificador`, `Criado em`.
  - Ações: Checkbox de master select para as linhas com um botão secundário dinâmico superior de título "Alterar Status" para alternar Ativos/Inativos em lotes (US09).

## 2. Gerenciamento de Dados (Services & State)

Como não temos o back-end pronto neste momento do fluxo "BMAD Solutioning", criaremos Mock Services em Angular que simularão as APIs corporativas devolvendo Dados Mockados.

### 2.1 `IaConfigMockService`
A classe injetável responsável por gerenciar Promessas/Observables com dados fictícios.
- `getBusinessUnits()`: Retorna `[ { id: 1, name: 'Uniasselvi' }, { id: 2, name: 'Unicesumar' } ]`
- `getActivities(unitId)`: Retorna lista de provas, resenhas baseada na unidade.
- `getSubjects(unitId, activityId)`: Retorna uma lista longa de disciplinas (50+ para testes de lote).
- `saveConfig(payload)`: Simula salvar a configuração e a injeta no "banco" de auditoria.
- `getAuditLogs()`: Retorna as configurações ativas atuais base com paginação e filtro por coluna do próprio Angular (Signals).
- `updateStatuses(ids, newStatus)`: Salva no mock local em batch o novo status (Ativo/Inativo) da configuração. A cada registro ativado gera também nova chave `promptName` mapeada nos atributos.

## 3. Roteamento (Routing)

- Adicionar a rota principal ao sistema:
  No arquivo de configuração de rotas (`app.routes.ts` ou injetado via `app.config.ts`), a nova rota será estabelecida assim:
  ```typescript
  { 
    path: 'correcoes-ia', 
    loadComponent: () => import('./features/ia-corrections/ia-corrections-page.component').then(c => c.IaCorrectionsPageComponent) 
  }
  ```
- Isso fará com que o link que configuramos anteriormente no menu lateral do `app.ts` passe a funcionar com Lazy Loading.

## 4. Ordem e Plano de Execução (Próximos Passos)

1. **Step 1 - Scaffolding**: 
   - Utilizar o Angular CLI (ou geração manual de arquivos via ferramentas) para criar os três novos componentes (`ia-corrections-page`, `parameterization-tab`, `audit-tab`).
   - Mapear a rota em `app.config.ts` (uma vez que não usamos app-routing).
2. **Step 2 - Criação do Service Mock (Data Layer)**:
   - Criar `ia-config.service.ts` com arrays hardcoded simulando um banco de dados temporário de registros ativos, para que a UI ganhe vida.
3. **Step 3 - Implementação da Tela (UI Layer)**:
   - Traduzir o `.md` de *Design_Patterns* em CSS (`.component.css`) usando variáveis e flexbox limpo simulando os componentes do Velzon.
   - Construir o HTML do Tab System e Tabelas.
4. **Step 4 - Binding Lógico (Eventos)**:
   - Conectar os switches (US05, US02) de Ativar/Desativar às regras de tela (mostrar campo $\%$, desabilitar listagem).
   - Fazer o botão "Selecionar Todas" afetar o modelo de disciplinas iterado no Form / Signals.
5. **Step 5 - QA e Homologação**:
   - Compilar localmente, navegar pela interface e garantir que todas as Regras de Negócio e Acordos visuais descritos foram cumpridos plenamente.
