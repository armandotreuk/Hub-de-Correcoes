# Histórias de Usuário v4 - Unificadas

> **Escopo v4**: Este documento consolida as histórias de usuário referentes ao **Cadastro de Prompt** e **Matriz de Configurações**, unificando épicos e otimizando a estrutura documental conforme solicitado.

---

## TEMA 1: Cadastro de Prompt

### US-T1 - Gerenciamento e Ciclo de Vida de Prompts (Unifica US01, US02, US03, US03.1, US03.2, US03.3, US03.4)

**Como um** analista pedagógico,
**Eu quero** gerenciar os prompts de correção, desde a criação e edição até a visualização na lista,
**Para que** o sistema possua instruções instrucionais e de feedback padronizadas.

- **Critérios de Aceite:**
  - **Criação e Edição (US01, US02, US03.1, US03.2)**:
    - O sistema deve permitir a criação/edição preenchendo os campos Título, Prompt Avaliação, Prompt Feedback, Unidade de Negócio, Tipo de Atividade e Situação.
    - O dropdown de Situação deve ficar na mesma linha de Unidade e Atividade, e o primeiro estado deve ser "Ativo".
    - Os campos textareas (Avaliação e Feedback) devem ter tamanho limite de 10.000 caracteres com contadores atualizados dinamicamente.
    - O sistema deve comportar as "Observações" dos prompts, abaixo do feedback, as quais devem ser salvas juntamente ao prompt via botão principal **"Salvar"**. O botão independente "Salvar Comentário" foi removido.
  - **Persistência e Segurança (US03)**:
    - Caso o usuário modifique qualquer parte do prompt na tela e tente trocar de aba ou sair, emitir alerta solicitando Confirmação, Descarte ou Cancelamento.
  - **Consultas e Exibição (US03.3, US03.4)**:
    - O painel de buscas permite filtrar por Unidade de Negócio (Dropdown), Atividade (Dropdown) e Situação (Checkboxes MultiSelect: Ativo configurado como padrão inicial).
    - O card que renderiza o prompt deve estar envelopado visualmente por um contorno (borda visível) e dispor de Badges legíveis de Ativo/Inativo.

**Regras de Negócio Relacionadas (Business Rules v3):**

- **RN01 - Entidade Prompt**: O Prompt é uma entidade de primeira classe composta por: **Título** (identificador textual), **Prompt Avaliação** (textarea até 10.000 caracteres), **Prompt Feedback** (textarea até 10.000 caracteres), **Unidade de Negócio** e **Tipo de Atividade** vinculados obrigatoriamente na criação, **Observações** (campo de texto livre até 10.000 caracteres), e **Situação** (Ativo ou Inativo, default: Ativo). O botão de ação principal para persistência deve ser renomeado para **"Salvar"**.
- **RN01.1 - Dois Tipos de Corpo de Prompt**: Na tela de criação/edição do prompt devem existir **dois campos de texto** (textareas) para o corpo do prompt:
  - O primeiro campo é destinado ao **Prompt de Avaliação**.
  - O segundo campo (abaixo do primeiro) é destinado ao **Prompt de Feedback**.
  - Ambos possuem limite de 10.000 caracteres e contadores independentes.
- **RN02 - Criação de Prompt**: O sistema deve permitir a criação de novos prompts através de um formulário dedicado na aba "Cadastro Prompt".
- **RN03 - Edição de Prompt**: Prompts existentes devem ser editáveis. Ao selecionar um prompt da lista, seus dados (título, corpo avaliação, corpo feedback, unidade, atividade, observações) devem ser carregados nos campos de edição.
- **RN04 - Persistência e Validação de Alterações**: Ao tentar navegar para outra aba ou tela com alterações não salvas, o sistema deve exibir uma confirmação ao usuário perguntando se deseja salvar as alterações pendentes.
- **RN05 - Listagem de Prompts**: O sistema deve manter e exibir uma lista de todos os prompts criados, permitindo seleção para visualização e edição.
- **RN05.1 - Situação do Prompt (Ativo/Inativo)**: A Situação (Ativo/Inativo) deve ser exibida como um **dropdown no padrão visual dos dropdowns de Unidade de Negócio e Tipo de Atividade**, posicionada ao lado direito da caixa de Tipo de Atividade na mesma linha. Ao criar um novo prompt, o valor padrão deve ser **Ativo**. Ao inativar, o prompt é considerado deprecated.
- **RN05.2 - Campo de Observações**: Abaixo dos campos de Corpo do Prompt (Avaliação e Feedback), deve existir um campo de texto "Observações" (até 10.000 caracteres) para comentários dos usuários. Os comentários devem ser salvos juntamente às edições de prompt ao clicar no botão **"Salvar"**. O botão independente "Salvar Comentário" foi removido.
- **RN05.3 - Filtros na Lista de Prompts**: A lista de prompts deve permitir filtragem por:
  - **Unidade de Negócio** (dropdown, não obrigatório)
  - **Tipo de Atividade** (dropdown, não obrigatório)
  - **Situação** (checkbox múltiplo: Ativo e/ou Inativo). Por padrão, o filtro inicia com "Ativo" marcado. Se nenhuma opção for selecionada, nenhum prompt é exibido.
- **RN05.4 - Estilo Visual dos Cards de Prompt**: Cada item da lista de prompts (prompt-item) deve possuir **contorno visível** (borda) para delimitar cada card. O badge de **Situação "Ativo"** deve ter estilo visual diferenciado com **cor de fundo e fonte que garantam alta legibilidade**.

---

## TEMA 2: Matriz de Configurações

### US-T2 - Visualização, Filtros e Ações Básicas na Matriz (Unifica US20, US21, US22, US23, US24, US28, US29, US30)

**Como um** coordenador de correção,
**Eu quero** visualizar a complexidade da Matriz num painel simplificado, que una consulta, filtros complexos e gestão de parametrizações base num único layout,
**Para que** eu reduza meu esforço cognitivo e possa mapear dados com filtros em lote combinados a parametrizações de alto e baixo nível.

- **Critérios de Aceite:**
  - **Visualização Matricial (US20, US22, US30)**:
    - Apresentar tabela unificando Disciplina, Tipo de Atividade com dimensões Prompt, Correção e Publicação.
    - As labels de "Tipo de Atividade" devem possuir cores distintas a fim de bater o olho e reconhecer de forma pragmática a avaliação (ex: Fórum é Verde, Prova Vermelho).
    - Consistir a paginação no padrão da matriz (10/25/50/100, padrão 25) indicando X por página e botões de navegação.
  - **Sistema de Filtros (US21)**:
    - O painel disporá de 2 linhas complexas de multi seleção: Atividade, Unidade, Cluster, Curso, Disciplina (Linha 1) e Prompt, Status IA e Publicação (Linha 2). Acionamento manual por botão com alerta de loading.
  - **Controles Auxiliares e Diálogos (US23, US29)**:
    - Clicando no Prompt Vinculado, abre um Modal de Contexto (**campos bloqueados para edição**, inclusive observações; sem exibição do botão salvar).
    - O filtro de **Prompt** deve exibir apenas as opções compatíveis com as **Atividades** e/ou **Unidades** selecionadas (Filtro Inteligente). Caso os filtros superiores estejam vazios, exibe todos os prompts.
    - Ícone global de regras abrindo um modal simples com botão "OK" listando os critérios da Publicação Automática.
  - **Interações Primárias de Parametrização (US24, US28)**:
    - Ao selecionar checkboxes da grid, apresentar a Barra de Ações relatando contagem ativa para alertar o usuário ("N selecionados").
    - Pela grid via botão individual de engrenagem, invocar o **Side Drawer** parametrizando em 3 etapas de negócio (Vínculo Prompt, Toggle IA, Toggle Publicação com Nota e Prazo), consolidando por um botão final de gravação "Salvar Tudo".

**Regras de Negócio Relacionadas (Business Rules v3):**

- **RN40 - Visão Matricial Unificada**: O sistema deve exibir uma tabela matricial onde cada linha representa uma combinação única de `Disciplina + Tipo de Atividade`, consolidando numa única visualização: o prompt vinculado, o status de correção por IA e o status de publicação de notas.
- **RN41 - Dados Consolidados (Join)**: Os dados da matriz são produzidos pelo cruzamento (join em memória) de três fontes: vínculos de prompt (`PromptLinkingService`), configurações de correção (`CorrectionConfigService`) e configurações de publicação (`PublicationService`).
- **RN42 - Painel de Filtros Completo**: A tela deve possuir **8 filtros**, organizados em duas linhas:
  - **Linha 1**: Atividade (prioritário), Unidade, Cluster, Curso, Disciplina.
  - **Linha 2**: Prompt, Status IA (Ativo/Inativo), Publicação (Ativa/Inativa), Botão Pesquisar.
- **RN42.1 - Atividade como Filtro Primário**: O filtro de **Atividade** deve ser posicionado como o **primeiro filtro** (extrema esquerda, linha 1), refletindo sua importância como principal direcionador de configurações.
- **RN42.2 - Botão Pesquisar**: Os filtros **somente são aplicados** à tabela ao clicar no botão "Pesquisar e Filtrar". Enquanto o backend/mock processa, exibir sweet alert de loading.
- **RN42.3 - Filtro de Status IA**: Permite selecionar registros com correção Ativo/Inativo.
- **RN42.4 - Filtro de Publicação**: Permite selecionar registros com publicação Ativa/Inativa.
- **RN42.5 - Filtro de Prompt**: Permite selecionar registros vinculados a um prompt específico. Quando houver itens selecionados nos filtros **Atividade** e/ou **Unidade**, o filtro de Prompt deve exibir **somente** as opções relacionadas às seleções desses filtros. Caso esses filtros estejam vazios, o filtro de Prompt exibe todos os prompts (Uso não obrigatório dos filtros superiores para filtrar prompts).
- **RN43 - Colunas da Tabela**: A tabela deve exibir as seguintes colunas:
  - **Checkbox** de seleção
  - **Hierarquia/Atividade**: Curso, Disciplina, Tag de Atividade e informação de Unidade/Cluster em subtexto
  - **Prompt**: Nome do prompt vinculado (clicável) ou indicador "Não vinculado"
  - **Status IA**: Badge Ativo/Inativo com switch visual
  - **Publicação**: Badge Ativa/Inativa. Indicadores de Nota e Prazo devem ser exibidos **somente** se a publicação estiver **"Ativa"**. Casos com publicação **"Inativa"** não devem exibir nota e prazo na tela.
  - **Ação**: Botão de parametrização individual (engrenagem)
- **RN43.1 - Cores por Tipo de Atividade**: Cada tipo de atividade deve possuir uma **tag colorida diferenciada**:
  - Desafio Profissional: Azul (`badge-soft-primary`)
  - Resenha: Ciano (`badge-soft-info`)
  - Fórum: Verde (`badge-soft-success`)
  - MAPA: Cinza (`badge-soft-secondary`)
  - Prova: Vermelho (`badge-soft-danger`)
  - Avaliação Final: Amarelo (`badge-soft-warning`)
- **RN43.2 - Prompt Clicável (Modal de Detalhe)**: Ao clicar no nome de um prompt vinculado em um registro da tabela, deve abrir o **Modal de Detalhe do Prompt** permitindo visualizar os campos do prompt sem sair da matriz:
  - Campos Título, Unidade, Tipo de Atividade, Corpo Avaliação, Corpo Feedback e Observações estão **bloqueados para edição** (visual locked).
  - O modal de visualização a partir da matriz **não deve exibir o botão Salvar** (nem de prompt, nem de comentário).
- **RN43.3 - Status de Publicação (Terminologia)**: Os status de publicação devem usar a terminologia **"Ativa" / "Inativa"** (feminino), substituindo "Habilitado/Desabilitado" da v4.
- **RN44 - Barra de Ações em Massa**: Uma barra fixa deve exibir a mensagem: **"Ações em massa para todos os X resultados filtrados"** (onde X é o count dinâmico) ou **"Y selecionados"** quando houver checkboxes marcados.
- **RN44.2 - Lógica de Alvo**:
  - Se houver checkboxes marcados, a ação é aplicada **apenas** aos registros selecionados.
  - Se não houver checkboxes marcados, a ação é aplicada a **todos** os registros filtrados visíveis.
- **RN47 - Drawer Lateral**: Ao clicar no ícone de engrenagem de um registro, abre-se um painel lateral (side drawer) contendo o formulário completo de parametrização para aquele registro individual:
  1. **Vincular Prompt**: Dropdown de seleção de prompt.
  2. **Ativar Correção por IA**: Toggle switch (requer prompt vinculado para ativação).
  3. **Publicação Automática**: Toggle switch (requer correção Ativa) + campos de Nota e Prazo visíveis quando ativo.
- **RN47.1 - Botão de Fechamento Único**: O drawer deve possuir **apenas um** botão de fechar (X) no cabeçalho, sem duplicidade.
- **RN48 - Conteúdo Estruturado**: O modal "Ver Regras do Processo" deve exibir as regras em **4 linhas separadas**:
  1. "As notas de IA só serão publicadas se:"
  2. "1. A correção estiver Ativa;"
  3. "2. O Prompt estiver vinculado;"
  4. "3. A nota da IA for superior ao limite configurado."
- **RN48.1 - Botão Único**: O modal deve possuir apenas o botão **"OK"** (sem botão Cancelar).
- **RN49 - Paginação Padronizada**: A tabela da Matriz deve seguir o padrão de paginação da Auditoria:
  - Seletor de itens por página: 10, 25, 50, 100 (default: 25).
  - Texto: "Exibindo X por página".
  - Indicador: "Página X de Y".
  - Botões: Anterior/Próximo com ícones e estados disabled.
- **RN50 - Acesso via Menu**: A funcionalidade deve ser acessada através do link "Correções por IA" no submenu de "Acadêmico" do menu lateral principal.
- **RN51 - Estrutura de Abas (v5)**: A tela principal deve apresentar **2 abas ativas** principais:
  1. **Cadastro Prompt** (ativa)
  2. **Matriz de Configurações** (ativa — substitui definitivamente as antigas Abas 2, 3 e 5)
  3. Auditoria Correções (mantida como referência/histórico)
- **RN52 - Sweet Alerts Padronizados**: Todas as ações de massa e buscas por filtro devem utilizar sweet alerts padronizados:
  - **Loading**: Exibido durante processamento (botão Pesquisar, vinculação em massa, ativação em massa).
  - **Confirmação**: Exibido antes de executar ação de massa, informando a quantidade de registros afetados.
  - **Conclusão**: Exibido após a execução, confirmando quantidades de registros alterados/adicionados.
  - **Informativo (Regras)**: Exibido apenas com botão "OK", sem opção de cancelamento.

### US25 - Vincular Prompt em Massa (com Validação de Atividade)

**Como um** coordenador de correção,
**Eu quero** vincular um prompt a múltiplas disciplinas com validação de atividade obrigatória
**Para que** os vínculos sejam sempre compatíveis com o tipo de atividade.

- **Critérios de Aceite:**
  - [ ] O sistema **exige** exatamente uma atividade selecionada no filtro para prosseguir.
  - [ ] Se nenhuma ou múltiplas atividades estão selecionadas, exibe alerta de erro orientando o usuário.
  - [ ] O modal de seleção exibe **somente** prompts compatíveis com a atividade selecionada.
  - [ ] Se não existem prompts para a atividade, exibe alerta informativo.
  - [ ] Sweet alert de confirmação antes, sweet alert de conclusão após.

**Regras de Negócio Relacionadas (Business Rules v3):**

- **RN45 - Obrigatoriedade de Atividade**: Para vincular um prompt em massa, é **obrigatório** que exatamente **um** tipo de atividade esteja selecionado no filtro de Atividade. Se nenhuma ou múltiplas atividades estiverem marcadas, o sistema exibe alerta de erro instruindo o usuário a refinar a seleção.
- **RN45.1 - Filtro Inteligente de Prompts**: O modal de seleção de prompt em massa exibe **somente** prompts cujo tipo de atividade seja compatível com a atividade selecionada no filtro superior. Isso elimina o risco de vincular um prompt incompatível.
- **RN45.2 - Unicidade de Vínculo**: Mantida da v4 (RN07). Uma Disciplina não pode ter mais de um prompt vinculado para o mesmo Tipo de Atividade.

### US26 - Ativar Correção em Massa

**Como um** coordenador de correção,
**Eu quero** ativar a correção por IA para múltiplos registros simultaneamente
**Para que** eu economize tempo ao habilitar a IA para grandes volumes.

- **Critérios de Aceite:**
  - [ ] Ao clicar em "Ativar Correção", o status de todos os registros-alvo muda para Ativo.
  - [ ] Sweet alert de confirmação antes, sweet alert de conclusão após.

**Regras de Negócio Relacionadas (Business Rules v3):**

- **RN44.1 - Três Ações em Massa**:
  1. **Vincular Prompt**: Abre seleção de prompt para vincular aos registros.
  2. **Ativar Correção**: Altera o status de correção para Ativo.
  3. **Configurar Publicação**: Abre formulário para definir Nota e Prazo.

### US27 - Configurar Publicação em Massa (com Nota e Prazo)

**Como um** coordenador de correção,
**Eu quero** configurar publicação em massa preenchendo Nota Mínima e Prazo obrigatoriamente
**Para que** todas as publicações automáticas tenham parâmetros válidos.

- **Critérios de Aceite:**
  - [ ] Ao clicar em "Configurar Publicação", abre diálogo interativo com campos de **Nota Mínima** (0-100) e **Prazo** (dias).
  - [ ] Ambos os campos são **obrigatórios**; o sistema impede confirmação se vazios.
  - [ ] Após confirmação, os registros-alvo recebem publicação Ativa com os valores de Nota e Prazo informados.
  - [ ] Sweet alert de conclusão com contagem de registros atualizados.

**Regras de Negócio Relacionadas (Business Rules v3):**

- **RN46 - Formulário de Publicação**: Ao acionar "Configurar Publicação" em massa, o sistema exibe um diálogo interativo (SweetAlert) contendo dois campos **obrigatórios**:
  - **Nota Mínima**: Campo numérico inteiro, 0 a 100 (sem símbolo de %).
  - **Prazo para Liberação**: Campo numérico inteiro, representando dias.
- **RN46.1 - Validação Obrigatória**: Ambos os campos devem ser preenchidos para confirmar. Se algum estiver vazio, o sistema exibe mensagem de validação impedindo a continuação.
- **RN46.2 - Dependência da Correção**: Um registro **não pode** ter publicação ativada se a correção estiver Inativa. Porém, um registro **pode** ter correção Ativa com publicação Inativa.
- **RN46.3 - Regra de Corte por Desempenho**: Submissões avaliadas pela IA cujo desempenho fique **igual ou acima** da Nota configurada terão a nota registrada automaticamente. Submissões abaixo ficarão retidas para curadoria manual dentro do prazo configurado.

### US31 - Exportação de Registros da Matriz (Relatório de Governança)

**Como um** coordenador de correção,
**Eu quero** exportar os registros da Matriz de Configurações
**Para que** eu tenha um relatório auditável offline com todas as parametrizações, sabendo exatamente quem e quando ativou ou inativou as configurações.

- **Critérios de Aceite:**
  - [ ] A tela deve apresentar um botão de "Exportar" (ex: Excel ou CSV) visível na interface da Matriz.
  - [ ] A exportação deve gerar um arquivo contendo os registros da tabela (podendo respeitar os filtros ou exportar a base completa).
  - [ ] **Fluxo de interação**:
    1. Ao clicar em exportar, exibir **Sweet Alert de confirmação** questionando sobre o início da geração do documento.
    2. Durante o processamento, exibir **Sweet Alert temporário de loading** ("Processando a exportação...").
    3. Após gerado, exibir **Sweet Alert informando o sucesso**, contemplando também a contagem estrita de quantos registros foram incluídos na matriz exportada.
  - [ ] O relatório deve conter **21 colunas** organizadas em 4 seções conforme blueprint abaixo:

#### Seção A: Hierarquia Organizacional

| #   | Coluna             | Tipo   | Notas |
| --- | ------------------ | ------ | ----- |
| A1  | Unidade de Negócio | String |       |
| A2  | Cluster            | String |       |
| A3  | Curso              | String |       |
| A4  | Disciplina         | String |       |
| A5  | Tipo de Atividade  | String |       |

#### Seção B: Configuração do Prompt

| #   | Coluna                      | Tipo   | Notas                   |
| --- | --------------------------- | ------ | ----------------------- |
| B1  | Prompt Vinculado            | String | Nome ou "Não vinculado" |
| B2  | Título do Prompt            | String |                         |
| B3  | Situação do Prompt          | Enum   | Ativo / Inativo         |
| B4  | Criado por (user_id)        | String | Quem criou o vínculo    |
| B5  | Criado por (Nome)           | String |                         |
| B6  | Última Edição por (user_id) | String | Quem editou por último  |

#### Seção C: Correção por IA

| #   | Coluna                          | Tipo     | Notas           |
| --- | ------------------------------- | -------- | --------------- |
| C1  | Status Correção IA              | Enum     | Ativo / Inativo |
| C2  | Data Ativação Correção          | DateTime |                 |
| C3  | Data Inativação Correção        | DateTime |                 |
| C4  | Ativação Original por (user_id) | String   |                 |
| C5  | Ativação Original por (Nome)    | String   |                 |
| C6  | Última Edição por (user_id)     | String   |                 |

#### Seção D: Publicação Automática

| #   | Coluna                          | Tipo     | Notas           |
| --- | ------------------------------- | -------- | --------------- |
| D1  | Status Publicação               | Enum     | Ativa / Inativa |
| D2  | Nota Mínima                     | Integer  | 0–100           |
| D3  | Prazo para Liberação (dias)     | Integer  |                 |
| D4  | Data Ativação Publicação        | DateTime |                 |
| D5  | Data Inativação Publicação      | DateTime |                 |
| D6  | Ativação Original por (user_id) | String   |                 |
| D7  | Ativação Original por (Nome)    | String   |                 |
| D8  | Última Edição por (user_id)     | String   |                 |

- [ ] Quando publicação estiver Inativa, D2 (Nota Mínima) e D3 (Prazo) devem exportar como `N/A` ou vazio.
- [ ] Quando não houver vínculo de prompt, B1 exporta "Não vinculado" e B2–B6 exportam vazios.

**Regras de Negócio Relacionadas (Business Rules v3):**

- **RN53 - Blueprint de Exportação (Relatório de Governança)**: A exportação da Matriz deve gerar um arquivo com 21 colunas fixas organizadas em 4 seções:
  - **Seção A — Hierarquia Organizacional** (5 colunas): Unidade de Negócio, Cluster, Curso, Disciplina, Tipo de Atividade.
  - **Seção B — Configuração do Prompt** (6 colunas): Prompt Vinculado, Título do Prompt, Situação do Prompt, Criado por (user_id), Criado por (Nome), Última Edição por (user_id).
  - **Seção C — Correção por IA** (6 colunas): Status Correção IA, Data Ativação Correção, Data Inativação Correção, Ativação Original por (user_id), Ativação Original por (Nome), Última Edição por (user_id).
  - **Seção D — Publicação Automática** (8 colunas): Status Publicação, Nota Mínima, Prazo para Liberação (dias), Data Ativação Publicação, Data Inativação Publicação, Ativação Original por (user_id), Ativação Original por (Nome), Última Edição por (user_id).
- **RN53.1 - Rastreabilidade de Auditoria**: Cada configuração da Matriz (vínculo de prompt, ativação de correção, configuração de publicação) deve rastrear o `user_id` e `Nome` do usuário que criou a configuração e do usuário que realizou a última edição.
- **RN53.2 - Valores Nulos**: Quando publicação estiver Inativa, Nota Mínima e Prazo devem ser exportados como `N/A` ou vazio. Quando não houver prompt vinculado, os campos de auditoria do prompt (B4–B6) exportam vazios.
- **RN52 - Sweet Alerts Padronizados**: Todas as ações de massa e buscas por filtro devem utilizar sweet alerts padronizados:
  - **Loading**: Exibido durante processamento (botão Pesquisar, vinculação em massa, ativação em massa, exportação).
  - **Confirmação**: Exibido antes de executar ação de massa, informando a quantidade de registros afetados.
  - **Conclusão**: Exibido após a execução, confirmando quantidades de registros alterados/adicionados.

---

## TEMA 3: Auditoria de Correções

### US12 - Painel de Auditoria

**Como um** auditor ou gestor do sistema,
**Eu quero** acessar a aba de auditoria com a estrutura já implementada
**Para que** eu possa consultar as parametrizações de IA.

- **Critérios de Aceite:**
  - [ ] A tabela exibe: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - [ ] Filtros por coluna, ordenação por cabeçalho, paginação padrão.
  - [ ] Este componente de paginação é o **padrão visual** para todo o módulo.

**Regras de Negócio Relacionadas (Business Rules v3):**
_(Nota: Este tema é mantido como referência/histórico no Escopo v5, utilizando o padrão de paginação definido para o módulo)._

- **RN49 - Paginação Padronizada**: A tabela da Matriz deve seguir o padrão de paginação da Auditoria:
  - Seletor de itens por página: 10, 25, 50, 100 (default: 25).
  - Texto: "Exibindo X por página".
  - Indicador: "Página X de Y".
  - Botões: Anterior/Próximo com ícones e estados disabled.
