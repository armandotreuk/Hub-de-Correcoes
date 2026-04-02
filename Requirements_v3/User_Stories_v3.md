# Histórias de Usuário v5 - RF001: Correções por IA

> **Escopo v5**: Este documento cobre exclusivamente as abas **Cadastro Prompt** e **Matriz de Configurações**. As user stories das abas legadas (Relacionar Prompt, Ativar Correção, Publicação de Notas) foram consolidadas nas stories da Matriz.

---

## TEMA 1: Cadastro de Prompt

> Todas as stories deste tema são herdadas integralmente da v4, sem alterações.

### US01 - Criação de Novo Prompt (com dois corpos)
**Como um** analista pedagógico,
**Eu quero** criar um novo prompt de correção preenchendo título, corpo de avaliação, corpo de feedback, unidade de negócio e tipo de atividade
**Para que** o sistema disponha de instruções textuais padronizadas que orientem a IA tanto na avaliação quanto no feedback.
- **Relacionado a:** RN01, RN01.1, RN02
- **Critérios de Aceite:**
  - [ ] Deve existir um botão "Criar Novo Prompt" na tela.
  - [ ] Ao clicar, libera os campos: Título (texto curto), **Prompt Avaliação** (textarea até 10.000 caracteres), **Prompt Feedback** (textarea até 10.000 caracteres, posicionado abaixo do de Avaliação), dropdown de Unidade de Negócio, dropdown de Tipo de Atividade, dropdown de Situação (padrão: Ativo).
  - [ ] Os campos de Unidade de Negócio e Tipo de Atividade são **obrigatórios** na criação.
  - [ ] Cada textarea deve possuir contador de caracteres independente (X / 10.000).
  - [ ] O prompt é criado com a Situação **Ativo** por padrão.

### US02 - Edição de Prompt Existente
**Como um** analista pedagógico,
**Eu quero** selecionar um prompt da lista e editar seu conteúdo
**Para que** eu possa refinar as instruções de correção conforme a evolução do modelo de IA.
- **Relacionado a:** RN03, RN05
- **Critérios de Aceite:**
  - [ ] A tela deve exibir uma lista de todos os prompts cadastrados (respeitando filtros).
  - [ ] Ao selecionar um prompt, seu título, corpo de avaliação, corpo de feedback, unidade, atividade, situação e observações devem ser carregados nos campos de edição.
  - [ ] As alterações podem ser salvas via botão "Salvar".

### US03 - Persistência com Validação de Navegação
**Como um** analista pedagógico,
**Eu quero** ser avisado ao tentar sair da aba se houver alterações não salvas
**Para que** eu não perca acidentalmente edições importantes.
- **Relacionado a:** RN04
- **Critérios de Aceite:**
  - [ ] Se o usuário alterou qualquer campo e tenta navegar para outra aba, um diálogo de confirmação deve ser exibido.
  - [ ] O diálogo deve oferecer opções "Salvar", "Descartar" ou "Cancelar".

### US03.1 - Situação do Prompt como Dropdown
**Como um** analista pedagógico,
**Eu quero** selecionar a Situação (Ativo/Inativo) através de um dropdown no padrão visual dos demais
**Para que** a interface mantenha consistência visual.
- **Relacionado a:** RN05.1
- **Critérios de Aceite:**
  - [ ] O dropdown de Situação deve ficar à direita do dropdown de Tipo de Atividade, **na mesma linha** (3 colunas: Unidade | Atividade | Situação).
  - [ ] O dropdown deve seguir o **mesmo estilo visual** dos demais dropdowns.
  - [ ] Ao criar um novo prompt, o valor padrão deve ser **Ativo**.

### US03.2 - Campo de Observações
**Como um** analista pedagógico,
**Eu quero** registrar observações em um prompt
**Para que** minha equipe possa deixar comentários e anotações.
- **Relacionado a:** RN05.2
- **Critérios de Aceite:**
  - [ ] Abaixo dos campos "Prompt Feedback" deve existir um textarea "Observações" (até 10.000 caracteres).
  - [ ] Deve possuir um botão próprio "Salvar Comentário" independente do botão "Salvar" do prompt.

### US03.3 - Filtros na Lista de Prompts
**Como um** analista pedagógico,
**Eu quero** filtrar a lista de prompts por Unidade de Negócio, Tipo de Atividade e Situação
**Para que** eu encontre rapidamente o prompt que preciso editar.
- **Relacionado a:** RN05.3
- **Critérios de Aceite:**
  - [ ] Dropdown "Unidade de Negócio" (não obrigatório) filtra a lista.
  - [ ] Dropdown "Tipo de Atividade" (não obrigatório) filtra a lista.
  - [ ] Filtro "Situação" com **checkboxes de múltipla seleção** (Ativo / Inativo).
  - [ ] Por padrão, "Ativo" inicia marcado.
  - [ ] Se nenhuma situação for selecionada, nenhum prompt é exibido.

### US03.4 - Estilo Visual dos Cards de Prompt
**Como um** analista pedagógico,
**Eu quero** que os cards da lista tenham contornos visíveis e badges de status legíveis
**Para que** eu consiga identificar rapidamente cada prompt e seu status.
- **Relacionado a:** RN05.4
- **Critérios de Aceite:**
  - [ ] Cada prompt-item na lista deve possuir **borda/contorno visível** delimitando o card.
  - [ ] O badge de **"Ativo"** deve ter cor de fundo e cor de fonte diferenciadas para garantir alta legibilidade.
  - [ ] O badge de "Inativo" deve manter estilo secundário/cinza.

---

## TEMA 2: Matriz de Configurações

> **NOVO na v5**: Este tema unifica as funcionalidades dos antigos Temas 2 (Relacionar Prompt), 3 (Ativar Correção) e 5 (Publicação de Notas) em uma única visão matricial.

### US20 - Visão Matricial Consolidada
**Como um** coordenador de correção,
**Eu quero** visualizar uma tabela unificada que cruza Disciplina × Tipo de Atividade com as três dimensões de configuração (Prompt, Correção, Publicação)
**Para que** eu configure todo o pipeline de IA sem navegar entre múltiplas abas.
- **Relacionado a:** RN40, RN41
- **Critérios de Aceite:**
  - [ ] A tabela exibe uma linha por combinação Disciplina + Tipo de Atividade.
  - [ ] Cada linha mostra: hierarquia, prompt vinculado, status de correção IA, status de publicação.
  - [ ] Dados são produzidos pelo join em memória de PromptLinkingService, CorrectionConfigService e PublicationService.

### US21 - Painel de Filtros Completo
**Como um** coordenador de correção,
**Eu quero** filtrar a matriz usando 8 filtros organizados em duas linhas
**Para que** eu localize rapidamente as combinações que preciso configurar.
- **Relacionado a:** RN42, RN42.1
- **Critérios de Aceite:**
  - [ ] **Linha 1**: Atividade (primeiro), Unidade, Cluster, Curso, Disciplina.
  - [ ] **Linha 2**: Prompt, Status IA (Ativo/Inativo), Publicação (Ativa/Inativa), Botão Pesquisar.
  - [ ] Cada filtro usa o componente `MultiSelectDropdownComponent`.
  - [ ] O botão "Pesquisar e Filtrar" aplica todos os filtros de uma vez. Sweet alert de loading durante processamento.

### US22 - Cores Diferenciadas por Tipo de Atividade
**Como um** coordenador de correção,
**Eu quero** que cada tipo de atividade na tabela possua uma tag com cor diferenciada
**Para que** eu identifique visualmente o tipo de atividade sem precisar ler o texto.
- **Relacionado a:** RN43.1
- **Critérios de Aceite:**
  - [ ] As tags de atividade devem seguir o mapeamento: Desafio Profissional (azul), Resenha (ciano), Fórum (verde), MAPA (cinza), Prova (vermelho).
  - [ ] Tipos não mapeados recebem um estilo neutro (dark).

### US23 - Modal de Detalhe do Prompt na Matriz
**Como um** coordenador de correção,
**Eu quero** clicar no nome de um prompt vinculado na tabela e visualizar seus detalhes em um modal
**Para que** eu consulte corpo de avaliação, feedback e observações sem sair da matriz.
- **Relacionado a:** RN43.2 (herdado de US06.1)
- **Critérios de Aceite:**
  - [ ] Ao clicar no nome do prompt, abre modal centralizado.
  - [ ] Campos Título, Unidade, Tipo de Atividade, Corpo Avaliação e Corpo Feedback estão **bloqueados**.
  - [ ] Campo Observações está **liberado** para edição com botão "Salvar Comentário".
  - [ ] Ao clicar em "Não vinculado", nenhuma ação é executada.

### US24 - Barra de Ações em Massa com Contagem Dinâmica
**Como um** coordenador de correção,
**Eu quero** ver quantos registros serão afetados pelas ações em massa
**Para que** eu tenha clareza sobre o impacto antes de executar qualquer operação.
- **Relacionado a:** RN44
- **Critérios de Aceite:**
  - [ ] A barra exibe: "Ações em massa para todos os **X** resultados filtrados" quando nenhum checkbox está marcado.
  - [ ] Quando há checkboxes marcados: "**Y** selecionados".
  - [ ] Se nenhum resultado, a barra não é exibida.

### US25 - Vincular Prompt em Massa (com Validação de Atividade)
**Como um** coordenador de correção,
**Eu quero** vincular um prompt a múltiplas disciplinas com validação de atividade obrigatória
**Para que** os vínculos sejam sempre compatíveis com o tipo de atividade.
- **Relacionado a:** RN45, RN45.1, RN45.2
- **Critérios de Aceite:**
  - [ ] O sistema **exige** exatamente uma atividade selecionada no filtro para prosseguir.
  - [ ] Se nenhuma ou múltiplas atividades estão selecionadas, exibe alerta de erro orientando o usuário.
  - [ ] O modal de seleção exibe **somente** prompts compatíveis com a atividade selecionada.
  - [ ] Se não existem prompts para a atividade, exibe alerta informativo.
  - [ ] Sweet alert de confirmação antes, sweet alert de conclusão após.

### US26 - Ativar Correção em Massa
**Como um** coordenador de correção,
**Eu quero** ativar a correção por IA para múltiplos registros simultaneamente
**Para que** eu economize tempo ao habilitar a IA para grandes volumes.
- **Relacionado a:** RN44.1
- **Critérios de Aceite:**
  - [ ] Ao clicar em "Ativar Correção", o status de todos os registros-alvo muda para Ativo.
  - [ ] Sweet alert de confirmação antes, sweet alert de conclusão após.

### US27 - Configurar Publicação em Massa (com Nota e Prazo)
**Como um** coordenador de correção,
**Eu quero** configurar publicação em massa preenchendo Nota Mínima e Prazo obrigatoriamente
**Para que** todas as publicações automáticas tenham parâmetros válidos.
- **Relacionado a:** RN46, RN46.1
- **Critérios de Aceite:**
  - [ ] Ao clicar em "Configurar Publicação", abre diálogo interativo com campos de **Nota Mínima** (0-100) e **Prazo** (dias).
  - [ ] Ambos os campos são **obrigatórios**; o sistema impede confirmação se vazios.
  - [ ] Após confirmação, os registros-alvo recebem publicação Ativa com os valores de Nota e Prazo informados.
  - [ ] Sweet alert de conclusão com contagem de registros atualizados.

### US28 - Parametrização Individual (Side Drawer)
**Como um** coordenador de correção,
**Eu quero** configurar individualmente um registro através de um painel lateral
**Para que** eu faça ajustes finos sem uso de ações em massa.
- **Relacionado a:** RN47, RN47.1
- **Critérios de Aceite:**
  - [ ] Ao clicar no ícone de engrenagem, abre drawer lateral com 3 etapas:
    1. Vincular Prompt (dropdown seleção)
    2. Ativar Correção (toggle, requer prompt vinculado)
    3. Publicação Automática (toggle, requer correção ativa) + campos Nota e Prazo
  - [ ] O drawer possui **apenas um** botão de fechar (X) no cabeçalho.
  - [ ] Botão "Salvar Tudo" grava todas as configurações de uma vez.

### US29 - Modal de Regras do Processo
**Como um** coordenador de correção,
**Eu quero** consultar as regras de publicação em um modal informativo bem formatado
**Para que** eu tenha referência imediata das condições de publicação automática.
- **Relacionado a:** RN48, RN48.1
- **Critérios de Aceite:**
  - [ ] O modal exibe 4 linhas separadas com as regras.
  - [ ] Possui apenas o botão **"OK"** (sem botão Cancelar).
  - [ ] Ícone de informação (`info`).

### US30 - Paginação Padronizada
**Como um** coordenador de correção,
**Eu quero** que a paginação da Matriz siga o mesmo padrão visual da Auditoria
**Para que** haja consistência em todo o módulo.
- **Relacionado a:** RN49 (herdado de RN21, RN32)
- **Critérios de Aceite:**
  - [ ] Seletor de itens por página (10/25/50/100), default 25.
  - [ ] Texto "Exibindo X por página".
  - [ ] Indicador "Página X de Y".
  - [ ] Botões Anterior/Próximo com ícones e estados disabled.

### US31 - Exportação de Registros da Matriz (Auditoria)
**Como um** coordenador de correção,
**Eu quero** exportar os registros da Matriz de Configurações
**Para que** eu tenha um relatório auditável offline com todas as parametrizações, sabendo exatamente quem e quando ativou ou inativou as configurações.
- **Relacionado a:** Evolução da RN16.3 (v4)
- **Critérios de Aceite:**
  - [ ] A tela deve apresentar um botão de "Exportar" (ex: Excel ou CSV) visível na interface da Matriz.
  - [ ] A exportação deve gerar um arquivo contendo os registros da tabela (podendo respeitar os filtros ou exportar a base completa).
  - [ ] **Fluxo de interação**:
    1. Ao clicar em exportar, exibir **Sweet Alert de confirmação** questionando sobre o início da geração do documento.
    2. Durante o processamento, exibir **Sweet Alert temporário de loading** ("Processando a exportação...").
    3. Após gerado, exibir **Sweet Alert informando o sucesso**, contemplando também a contagem estrita de quantos registros foram incluídos na matriz exportada.
  - [ ] O relatório deve conter as colunas estruturais: Disciplina, Curso, Tipo de Atividade, Unidade de Negócio, Cluster, Prompt Vinculado, Correção por IA e Publicação.
  - [ ] O relatório deve conter colunas obrigatórias de auditoria: **Alterado por** (Nome/Email do usuário que ativou ou inativou a configuração) e **Data e Hora da Alteração**.

---

## TEMA 3: Auditoria de Correções (Referência - Sem Alterações)

### US12 - Painel de Auditoria (manter actual)
**Como um** auditor ou gestor do sistema,
**Eu quero** acessar a aba de auditoria com a estrutura já implementada
**Para que** eu possa consultar as parametrizações de IA.
- **Relacionado a:** RN17, RN18, RN21
- **Critérios de Aceite:**
  - [x] A tabela exibe: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - [x] Filtros por coluna, ordenação por cabeçalho, paginação padrão.
  - [x] Este componente de paginação é o **padrão visual** para todo o módulo.
