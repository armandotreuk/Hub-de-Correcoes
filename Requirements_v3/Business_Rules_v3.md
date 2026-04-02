# Regras de Negócio v5: RF001 - Correções por IA

> **Escopo v5**: Este documento cobre exclusivamente as duas abas ativas do módulo: **Cadastro Prompt** e **Matriz de Configurações**. As abas legadas (Relacionar Prompt, Ativar Correção, Publicação de Notas) foram unificadas na Matriz.

---

## Hierarquia da Informação

A estrutura organizacional segue a seguinte precedência:

```
1. Unidade de Negócio (ex: Uniasselvi, Unicesumar)
   2. Cluster (ex: Cluster Norte, Cluster Sul)
      3. Curso (ex: Engenharia de Software, Administração)
         4. Disciplina (ex: Algoritmos, Gestão de Projetos)
            5. Tipo de Atividade (ex: Desafio Profissional, Resenha, Prova, MAPA, Fórum)
```

> Herdada de v4 (RN-hierarquia). Disciplina é nível 4, acima de Tipo de Atividade (nível 5).

---

## 1. Cadastro de Prompt

> Regras integralmente herdadas da v4. Nenhuma alteração funcional nesta aba.

- **RN01 - Entidade Prompt**: O Prompt é uma entidade de primeira classe composta por: **Título** (identificador textual), **Prompt Avaliação** (textarea até 10.000 caracteres), **Prompt Feedback** (textarea até 10.000 caracteres), **Unidade de Negócio** e **Tipo de Atividade** vinculados obrigatoriamente na criação, **Observações** (campo de texto livre até 10.000 caracteres), e **Situação** (Ativo ou Inativo, default: Ativo).
- **RN01.1 - Dois Tipos de Corpo de Prompt**: Na tela de criação/edição do prompt devem existir **dois campos de texto** (textareas) para o corpo do prompt:
  - O primeiro campo é destinado ao **Prompt de Avaliação**.
  - O segundo campo (abaixo do primeiro) é destinado ao **Prompt de Feedback**.
  - Ambos possuem limite de 10.000 caracteres e contadores independentes.
- **RN02 - Criação de Prompt**: O sistema deve permitir a criação de novos prompts através de um formulário dedicado na aba "Cadastro Prompt".
- **RN03 - Edição de Prompt**: Prompts existentes devem ser editáveis. Ao selecionar um prompt da lista, seus dados (título, corpo avaliação, corpo feedback, unidade, atividade, observações) devem ser carregados nos campos de edição.
- **RN04 - Persistência e Validação de Alterações**: Ao tentar navegar para outra aba ou tela com alterações não salvas, o sistema deve exibir uma confirmação ao usuário perguntando se deseja salvar as alterações pendentes.
- **RN05 - Listagem de Prompts**: O sistema deve manter e exibir uma lista de todos os prompts criados, permitindo seleção para visualização e edição.
- **RN05.1 - Situação do Prompt (Ativo/Inativo)**: A Situação (Ativo/Inativo) deve ser exibida como um **dropdown no padrão visual dos dropdowns de Unidade de Negócio e Tipo de Atividade**, posicionada ao lado direito da caixa de Tipo de Atividade na mesma linha. Ao criar um novo prompt, o valor padrão deve ser **Ativo**. Ao inativar, o prompt é considerado deprecated.
- **RN05.2 - Campo de Observações**: Abaixo dos campos de Corpo do Prompt (Avaliação e Feedback), deve existir um campo de texto "Observações" (até 10.000 caracteres) para comentários dos usuários. O campo possui botão próprio "Salvar Comentário" independente do botão "Salvar" do prompt.
- **RN05.3 - Filtros na Lista de Prompts**: A lista de prompts deve permitir filtragem por:
  - **Unidade de Negócio** (dropdown, não obrigatório)
  - **Tipo de Atividade** (dropdown, não obrigatório)
  - **Situação** (checkbox múltiplo: Ativo e/ou Inativo). Por padrão, o filtro inicia com "Ativo" marcado. Se nenhuma opção for selecionada, nenhum prompt é exibido.
  > **Nota de design (UX intencional)**: O comportamento "sem seleção = nenhum resultado" é deliberado. Exigir ao menos uma seleção explícita evita que o usuário visualize acidentalmente prompts inativos (deprecated).
- **RN05.4 - Estilo Visual dos Cards de Prompt**: Cada item da lista de prompts (prompt-item) deve possuir **contorno visível** (borda) para delimitar cada card. O badge de **Situação "Ativo"** deve ter estilo visual diferenciado com **cor de fundo e fonte que garantam alta legibilidade**.

---

## 2. Matriz de Configurações (Unificação de Relacionamento, Correção e Publicação)

> **NOVO na v5**: Esta aba unifica as antigas abas "Relacionar Prompt", "Ativar Correção por IA" e "Publicação de Notas" em uma única visão matricial consolidada.

### 2.1 Visão Geral

- **RN40 - Visão Matricial Unificada**: O sistema deve exibir uma tabela matricial onde cada linha representa uma combinação única de `Disciplina + Tipo de Atividade`, consolidando numa única visualização: o prompt vinculado, o status de correção por IA e o status de publicação de notas.
- **RN41 - Dados Consolidados (Join)**: Os dados da matriz são produzidos pelo cruzamento (join em memória) de três fontes: vínculos de prompt (`PromptLinkingService`), configurações de correção (`CorrectionConfigService`) e configurações de publicação (`PublicationService`).

### 2.2 Filtros

- **RN42 - Painel de Filtros Completo**: A tela deve possuir **8 filtros**, organizados em duas linhas:
  - **Linha 1**: Atividade (prioritário), Unidade, Cluster, Curso, Disciplina.
  - **Linha 2**: Prompt, Status IA (Ativo/Inativo), Publicação (Ativa/Inativa), Botão Pesquisar.
- **RN42.1 - Atividade como Filtro Primário**: O filtro de **Atividade** deve ser posicionado como o **primeiro filtro** (extrema esquerda, linha 1), refletindo sua importância como principal direcionador de configurações.
- **RN42.2 - Botão Pesquisar**: Os filtros **somente são aplicados** à tabela ao clicar no botão "Pesquisar e Filtrar". Enquanto o backend/mock processa, exibir sweet alert de loading. (Herdado de RN09.0)
- **RN42.3 - Filtro de Status IA**: Permite selecionar registros com correção Ativo/Inativo.
- **RN42.4 - Filtro de Publicação**: Permite selecionar registros com publicação Ativa/Inativa.
- **RN42.5 - Filtro de Prompt**: Permite selecionar registros vinculados a um prompt específico.

### 2.3 Tabela Matricial

- **RN43 - Colunas da Tabela**: A tabela deve exibir as seguintes colunas:
  - **Checkbox** de seleção
  - **Hierarquia/Atividade**: Curso, Disciplina, Tag de Atividade e informação de Unidade/Cluster em subtexto
  - **Prompt**: Nome do prompt vinculado (clicável) ou indicador "Não vinculado"
  - **Status IA**: Badge Ativo/Inativo com switch visual
  - **Publicação**: Badge Ativa/Inativa com indicadores de Nota e Prazo
  - **Ação**: Botão de parametrização individual (engrenagem)
- **RN43.1 - Cores por Tipo de Atividade**: Cada tipo de atividade deve possuir uma **tag colorida diferenciada**:
  - Desafio Profissional: Azul (`badge-soft-primary`)
  - Resenha: Ciano (`badge-soft-info`)
  - Fórum: Verde (`badge-soft-success`)
  - MAPA: Cinza (`badge-soft-secondary`)
  - Prova: Vermelho (`badge-soft-danger`)
  - Avaliação Final: Amarelo (`badge-soft-warning`)
- **RN43.2 - Prompt Clicável (Modal de Detalhe)**: Ao clicar no nome de um prompt vinculado em um registro da tabela, deve abrir o **Modal de Detalhe do Prompt** (conforme US06.1 da v4) permitindo visualizar os campos do prompt sem sair da matriz:
  - Campos Título, Unidade, Tipo de Atividade, Corpo Avaliação e Corpo Feedback estão **bloqueados** (visual com cor diferente).
  - Campo Observações está **liberado** para edição com botão "Salvar Comentário".
- **RN43.3 - Status de Publicação (Terminologia)**: Os status de publicação devem usar a terminologia **"Ativa" / "Inativa"** (feminino), substituindo "Habilitado/Desabilitado" da v4.

### 2.4 Ações em Massa

- **RN44 - Barra de Ações em Massa**: Uma barra fixa deve exibir a mensagem: **"Ações em massa para todos os X resultados filtrados"** (onde X é o count dinâmico) ou **"Y selecionados"** quando houver checkboxes marcados.
- **RN44.1 - Três Ações em Massa**:
  1. **Vincular Prompt**: Abre seleção de prompt para vincular aos registros.
  2. **Ativar Correção**: Altera o status de correção para Ativo.
  3. **Configurar Publicação**: Abre formulário para definir Nota e Prazo.
- **RN44.2 - Lógica de Alvo**:
  - Se houver checkboxes marcados, a ação é aplicada **apenas** aos registros selecionados.
  - Se não houver checkboxes marcados, a ação é aplicada a **todos** os registros filtrados visíveis.

### 2.5 Vincular Prompt em Massa (Regras Específicas)

- **RN45 - Obrigatoriedade de Atividade**: Para vincular um prompt em massa, é **obrigatório** que exatamente **um** tipo de atividade esteja selecionado no filtro de Atividade. Se nenhuma ou múltiplas atividades estiverem marcadas, o sistema exibe alerta de erro instruindo o usuário a refinar a seleção.
- **RN45.1 - Filtro Inteligente de Prompts**: O modal de seleção de prompt em massa exibe **somente** prompts cujo tipo de atividade seja compatível com a atividade selecionada no filtro superior. Isso elimina o risco de vincular um prompt incompatível.
- **RN45.2 - Unicidade de Vínculo**: Mantida da v4 (RN07). Uma Disciplina não pode ter mais de um prompt vinculado para o mesmo Tipo de Atividade.

### 2.6 Configurar Publicação em Massa (Regras Específicas)

- **RN46 - Formulário de Publicação**: Ao acionar "Configurar Publicação" em massa, o sistema exibe um diálogo interativo (SweetAlert) contendo dois campos **obrigatórios**:
  - **Nota Mínima**: Campo numérico inteiro, 0 a 100 (sem símbolo de %).
  - **Prazo para Liberação**: Campo numérico inteiro, representando dias.
- **RN46.1 - Validação Obrigatória**: Ambos os campos devem ser preenchidos para confirmar. Se algum estiver vazio, o sistema exibe mensagem de validação impedindo a continuação.
- **RN46.2 - Dependência da Correção**: Um registro **não pode** ter publicação ativada se a correção estiver Inativa. Porém, um registro **pode** ter correção Ativa com publicação Inativa. (Herdado de RN24)
- **RN46.3 - Regra de Corte por Desempenho**: Submissões avaliadas pela IA cujo desempenho fique **igual ou acima** da Nota configurada terão a nota registrada automaticamente. Submissões abaixo ficarão retidas para curadoria manual dentro do prazo configurado. (Herdado de RN28)

### 2.7 Parametrização Individual (Side Drawer)

- **RN47 - Drawer Lateral**: Ao clicar no ícone de engrenagem de um registro, abre-se um painel lateral (side drawer) contendo o formulário completo de parametrização para aquele registro individual:
  1. **Vincular Prompt**: Dropdown de seleção de prompt.
  2. **Ativar Correção por IA**: Toggle switch (requer prompt vinculado para ativação).
  3. **Publicação Automática**: Toggle switch (requer correção Ativa) + campos de Nota e Prazo visíveis quando ativo.
- **RN47.1 - Botão de Fechamento Único**: O drawer deve possuir **apenas um** botão de fechar (X) no cabeçalho, sem duplicidade.

### 2.8 Modal de Regras do Processo

- **RN48 - Conteúdo Estruturado**: O modal "Ver Regras do Processo" deve exibir as regras em **4 linhas separadas**:
  1. "As notas de IA só serão publicadas se:"
  2. "1. A correção estiver Ativa;"
  3. "2. O Prompt estiver vinculado;"
  4. "3. A nota da IA for superior ao limite configurado."
- **RN48.1 - Botão Único**: O modal deve possuir apenas o botão **"OK"** (sem botão Cancelar).

### 2.9 Paginação

- **RN49 - Paginação Padronizada**: A tabela da Matriz deve seguir o padrão de paginação da Auditoria:
  - Seletor de itens por página: 10, 25, 50, 100 (default: 25).
  - Texto: "Exibindo X por página".
  - Indicador: "Página X de Y".
  - Botões: Anterior/Próximo com ícones e estados disabled.

---

## 3. Navegação e Acesso

- **RN50 - Acesso via Menu**: A funcionalidade deve ser acessada através do link "Correções por IA" no submenu de "Acadêmico" do menu lateral principal.
- **RN51 - Estrutura de Abas (v5)**: A tela principal deve apresentar **2 abas ativas** principais:
  1. **Cadastro Prompt** (ativa)
  2. **Matriz de Configurações** (ativa — substitui definitivamente as antigas Abas 2, 3 e 5)
  3. Auditoria Correções (mantida como referência/histórico)
  > **Nota**: As abas legadas (Relacionar Prompt, Ativar Correção por IA, Publicação de Notas) foram totalmente descontinuadas e consolidadas na Matriz.
- **RN52 - Sweet Alerts Padronizados**: Todas as ações de massa e buscas por filtro devem utilizar sweet alerts padronizados:
  - **Loading**: Exibido durante processamento (botão Pesquisar, vinculação em massa, ativação em massa).
  - **Confirmação**: Exibido antes de executar ação de massa, informando a quantidade de registros afetados.
  - **Conclusão**: Exibido após a execução, confirmando quantidades de registros alterados/adicionados.
  - **Informativo (Regras)**: Exibido apenas com botão "OK", sem opção de cancelamento.
