# Histórias de Usuário v4 - RF001: Correções por IA

Este documento traduz as Regras de Negócio (RN01 a RN33) em Histórias de Usuário, organizadas pelas 5 abas do módulo.

---

## TEMA 1: Cadastro de Prompt

### US01 - Criação de Novo Prompt (com dois corpos)
**Como um** analista pedagógico,
**Eu quero** criar um novo prompt de correção preenchendo título, corpo de avaliação, corpo de feedback, unidade de negócio e tipo de atividade
**Para que** o sistema disponha de instruções textuais padronizadas que orientem a IA tanto na avaliação quanto no feedback de cada tipo de avaliação.
- **Relacionado a:** RN01, RN01.1, RN02
- **Critérios de Aceite:**
  - [ ] Deve existir um botão "Criar Novo Prompt" na tela.
  - [ ] Ao clicar, libera os campos: Título (texto curto), **Corpo do Prompt de Avaliação** (textarea até 10.000 caracteres), **Corpo do Prompt de Feedback** (textarea até 10.000 caracteres, posicionado abaixo do de Avaliação), dropdown de Unidade de Negócio, dropdown de Tipo de Atividade, dropdown de Situação (padrão: Ativo).
  - [ ] Os campos de Unidade de Negócio e Tipo de Atividade são **obrigatórios** na criação.
  - [ ] Cada textarea deve possuir contador de caracteres independente (X / 10.000).
  - [ ] O prompt é criado com a Situação **Ativo** por padrão.

### US02 - Edição de Prompt Existente
**Como um** analista pedagógico,
**Eu quero** selecionar um prompt da lista de prompts criados e editar seu conteúdo
**Para que** eu possa refinar as instruções de correção conforme a evolução do modelo de IA.
- **Relacionado a:** RN03, RN05
- **Critérios de Aceite:**
  - [ ] A tela deve exibir uma lista de todos os prompts cadastrados (respeitando filtros).
  - [ ] Ao selecionar um prompt, seu título, corpo de avaliação, corpo de feedback, unidade, atividade, situação e observações devem ser carregados nos campos de edição.
  - [ ] As alterações do prompt podem ser salvas via botão "Salvar".

### US03 - Persistência com Validação de Navegação
**Como um** analista pedagógico,
**Eu quero** ser avisado ao tentar sair da aba ou da tela se houver alterações não salvas
**Para que** eu não perca acidentalmente edições importantes em um prompt.
- **Relacionado a:** RN04
- **Critérios de Aceite:**
  - [ ] Se o usuário alterou qualquer campo e tenta navegar para outra aba ou fechar a tela, um diálogo de confirmação deve ser exibido.
  - [ ] O diálogo deve oferecer opções "Salvar", "Descartar" ou "Cancelar".

### US03.1 - Situação do Prompt como Dropdown (v4)
**Como um** analista pedagógico,
**Eu quero** selecionar a Situação (Ativo/Inativo) através de um dropdown no padrão visual dos demais dropdowns
**Para que** a interface mantenha consistência visual e eu possa alterar o status de forma intuitiva.
- **Relacionado a:** RN05.1
- **Critérios de Aceite:**
  - [ ] O dropdown de Situação deve ficar à direita do dropdown de Tipo de Atividade, **na mesma linha** (layout em row com 3 colunas: Unidade | Atividade | Situação).
  - [ ] O dropdown de Situação deve seguir o **mesmo estilo visual** (mesma altura, borda, ícone de seta) dos dropdowns de Unidade de Negócio e Tipo de Atividade.
  - [ ] Ao criar um novo prompt, o valor padrão deve ser **Ativo**.
  - [ ] Ao selecionar "Inativo", o prompt é considerado deprecated.

### US03.2 - Campo de Observações
**Como um** analista pedagógico,
**Eu quero** registrar observações em um prompt
**Para que** minha equipe possa deixar comentários e anotações sobre o uso ou histórico daquele prompt.
- **Relacionado a:** RN05.2
- **Critérios de Aceite:**
  - [ ] Abaixo dos campos "Corpo do Prompt de Feedback" deve existir um textarea "Observações" (até 10.000 caracteres).
  - [ ] Deve possuir um botão próprio "Salvar Comentário" independente do botão "Salvar" do prompt.
  - [ ] O botão salva apenas o campo Observações, sem alterar os demais campos do prompt.

### US03.3 - Filtros na Lista de Prompts
**Como um** analista pedagógico,
**Eu quero** filtrar a lista de prompts por Unidade de Negócio, Tipo de Atividade e Situação
**Para que** eu encontre rapidamente o prompt que preciso editar.
- **Relacionado a:** RN05.3
- **Critérios de Aceite:**
  - [ ] Dropdown "Unidade de Negócio" (não obrigatório) filtra a lista de prompts.
  - [ ] Dropdown "Tipo de Atividade" (não obrigatório) filtra a lista de prompts.
  - [ ] Filtro "Situação" com **checkboxes de múltipla seleção** (Ativo / Inativo).
  - [ ] Por padrão, "Ativo" inicia marcado. O usuário pode desmarcar "Ativo" e/ou marcar "Inativo".
  - [ ] Se nenhuma situação for selecionada, nenhum prompt é exibido.

### US03.4 - Estilo Visual dos Cards de Prompt (v4)
**Como um** analista pedagógico,
**Eu quero** que os cards da lista de prompts tenham contornos visíveis e badges de status legíveis
**Para que** eu consiga identificar rapidamente cada prompt e seu status na lista.
- **Relacionado a:** RN05.4
- **Critérios de Aceite:**
  - [ ] Cada prompt-item na lista deve possuir **borda/contorno visível** delimitando o card.
  - [ ] O badge de **"Ativo"** deve ter **cor de fundo e cor de fonte diferenciadas** para garantir alta legibilidade (não deve ser texto claro sobre fundo claro).
  - [ ] O badge de "Inativo" deve manter estilo secundário/cinza.

---

## TEMA 2: Relacionar Prompt

### US04 - Vinculação de Prompt a Disciplinas (v4)
**Como um** analista pedagógico,
**Eu quero** vincular prompts cadastrados a disciplinas específicas
**Para que** cada disciplina tenha instruções de correção por IA apropriadas ao seu contexto acadêmico.
- **Relacionado a:** RN06, RN09
- **Critérios de Aceite:**
  - [ ] A tela deve possuir filtros hierárquicos empilhados: Unidade de Negócio → Cluster → Curso → Disciplina → Tipo de Atividade.
  - [ ] Os filtros devem ser checkboxes de múltipla seleção.
  - [ ] Ao selecionar um filtro, os filtros abaixo atualizam com opções relacionadas (cascata).
  - [ ] A tabela deve exibir colunas: Checkbox, Unidade de Negócio, Tipo de Atividade, Cluster, Curso, **Disciplina**, Prompt Vinculado.

### US04.0 - Botão Pesquisar nos Filtros (v4)
**Como um** analista pedagógico,
**Eu quero** que os filtros só sejam aplicados ao clicar no botão "Pesquisar"
**Para que** eu possa selecionar múltiplos critérios antes de disparar a busca, evitando requisições desnecessárias.
- **Relacionado a:** RN09.0
- **Critérios de Aceite:**
  - [ ] Deve existir um botão **"Pesquisar"** ao lado dos filtros.
  - [ ] A lista de registros **não se atualiza** ao alterar filtros — somente ao clicar em Pesquisar.
  - [ ] Ao clicar, deve ser exibido um **sweet alert de loading** enquanto o backend/mock processa a requisição.
  - [ ] Após o retorno, a tabela é atualizada com os registros filtrados.

### US04.1 - Vinculação em Massa Inteligente (v4)
**Como um** analista pedagógico,
**Eu quero** vincular um prompt a múltiplas disciplinas de uma vez, com lógica inteligente
**Para que** eu ganhe produtividade ao configurar grandes volumes de vínculos.
- **Relacionado a:** RN09.1, RN09.1.1
- **Critérios de Aceite:**
  - [ ] Checkbox de seleção na primeira coluna de cada registro.
  - [ ] Dropdown de seleção de prompt + botão "Vincular Prompt em Massa".
  - [ ] **Se houver checkboxes marcados**: o botão exibe a **quantidade de itens selecionados** e aplica o vínculo apenas a eles.
  - [ ] **Se não houver checkboxes marcados**: o botão exibe a **quantidade de registros filtrados** e aplica o vínculo a todos os registros filtrados.
  - [ ] Ao clicar, exibe **sweet alert de confirmação** com a quantidade de registros que serão vinculados.
  - [ ] **Validação de vínculo existente**: se o registro já possui o **mesmo prompt** selecionado, ele **não é atualizado** mas é contabilizado separadamente no sweet alert de conclusão.
  - [ ] Ao final, exibe **sweet alert de conclusão** informando: X registros vinculados com sucesso, Y registros já possuíam este prompt.

### US05 - Restrição de Unicidade de Vínculo
**Como um** gestor do sistema,
**Eu quero** que uma disciplina não possua mais de um prompt para o mesmo tipo de atividade
**Para que** não haja conflito de instruções de correção para uma mesma avaliação.
- **Relacionado a:** RN07
- **Critérios de Aceite:**
  - [ ] Se o usuário tentar vincular um prompt a uma disciplina que já possui outro prompt para o mesmo tipo de atividade, o sistema deve bloquear ou alertar sobre o conflito.
  - [ ] A restrição é na combinação (Disciplina + Tipo de Atividade).

### US06 - Gestão de Vínculos (Alterar e Remover)
**Como um** analista pedagógico,
**Eu quero** alterar o prompt vinculado a uma disciplina ou remover completamente o vínculo
**Para que** eu tenha flexibilidade para ajustar as configurações conforme necessário.
- **Relacionado a:** RN08
- **Critérios de Aceite:**
  - [ ] Deve ser possível substituir o prompt de uma disciplina por outro prompt (do mesmo tipo de atividade).
  - [ ] Deve ser possível remover o vínculo de prompt de uma disciplina.
  - [ ] Podem existir registros sem vínculo com prompt (exibido como "—").

### US06.1 - Modal de Detalhe do Prompt Vinculado (v4)
**Como um** analista pedagógico,
**Eu quero** clicar no prompt vinculado a um registro e visualizar seus detalhes em um modal
**Para que** eu possa consultar e adicionar observações sem sair da tela de vínculos.
- **Relacionado a:** RN09.3
- **Critérios de Aceite:**
  - [ ] Ao clicar no nome do prompt vinculado, abre modal no centro da tela.
  - [ ] Layout idêntico ao editor da Aba 1 (Título, Unidade, Atividade, Corpo Avaliação, Corpo Feedback, Observações).
  - [ ] Campos Título, Unidade, Tipo de Atividade, Corpo Avaliação e Corpo Feedback estão **bloqueados** (visual com cor diferente para refletir o bloqueio).
  - [ ] Campo Observações está **liberado** para edição com botão "Salvar Comentário".

### US07 - Paginação Padrão
**Como um** analista pedagógico,
**Eu quero** que a lista de disciplinas/vínculos use o padrão de paginação da Auditoria
**Para que** haja consistência visual em todo o módulo.
- **Relacionado a:** RN10, RN32
- **Critérios de Aceite:**
  - [ ] Paginação com seletor de itens (10/25/50/100), default 25.
  - [ ] Texto "Exibindo X por página", indicador "Página X de Y".
  - [ ] Botões Anterior/Próximo com ícones e estados disabled.

---

## TEMA 3: Ativar Correção por IA (v4 — renomeado)

### US08 - Visão Consolidada de Combinações (v4)
**Como um** coordenador de correção,
**Eu quero** visualizar uma lista consolidada com todas as combinações Unidade > Cluster > Curso > Disciplina > Tipo de Atividade > Prompt
**Para que** eu tenha uma visão completa de onde a IA pode atuar e controle qual combinação está ativa ou inativa.
- **Relacionado a:** RN11, RN13
- **Critérios de Aceite:**
  - [ ] A lista exibe todas as combinações possíveis com colunas: Checkbox, Status, Unidade, Cluster, Curso, **Disciplina**, Tipo de Atividade, Prompt.
  - [ ] Todo novo registro aparece com Status **Inativo** por padrão.

### US08.1 - Botão Pesquisar nos Filtros (v4)
**Como um** coordenador de correção,
**Eu quero** que os filtros só sejam aplicados ao clicar em "Pesquisar"
**Para que** eu possa selecionar filtros com calma antes de disparar a busca.
- **Relacionado a:** RN14.1
- **Critérios de Aceite:**
  - [ ] Botão "Pesquisar" ao lado dos filtros.
  - [ ] Sweet alert de loading durante processamento.
  - [ ] Mesmo comportamento descrito em US04.0.

### US09 - Ativação/Desativação Individual
**Como um** coordenador de correção,
**Eu quero** ativar ou inativar a correção por IA de um registro individual diretamente na lista
**Para que** eu possa controlar pontualmente quais combinações curso/atividade estão usando IA.
- **Relacionado a:** RN15
- **Critérios de Aceite:**
  - [ ] Cada linha da tabela deve possuir um badge clicável para alternar entre Ativo e Inativo.

### US10 - Ativar em Massa (v4 — Lógica Inteligente)
**Como um** coordenador de correção,
**Eu quero** ativar ou inativar a correção em múltiplos registros com lógica inteligente
**Para que** eu economize tempo ao configurar grandes volumes de combinações.
- **Relacionado a:** RN16
- **Critérios de Aceite:**
  - [ ] Botão chama-se **"Ativar em Massa"** (renomeado de "Alterar Status").
  - [ ] Botão **fixo na tela**, no mesmo padrão visual do botão "Vincular Prompt em Massa" da Aba 2.
  - [ ] **Se houver checkboxes marcados com ao menos 1 Inativo**: ativa todos os marcados.
  - [ ] **Se todos os marcados já estão Ativos**: inativa todos os marcados.
  - [ ] **Se nenhum checkbox marcado**: aplica lógica acima a todos os registros filtrados.
  - [ ] O texto do botão exibe a **quantidade de itens** (selecionados ou filtrados).
  - [ ] Ao clicar, exibe **sweet alert de confirmação** com quantidade de itens afetados.
  - [ ] Ao final, exibe **sweet alert de conclusão** com total de alterações e adições.

### US10.1 - Modal de Detalhe do Prompt (v4)
**Como um** coordenador de correção,
**Eu quero** clicar no nome do prompt na tabela e ver seus detalhes em um modal
**Para que** eu consulte o conteúdo do prompt sem sair da tela de configuração.
- **Relacionado a:** RN16.2
- **Critérios de Aceite:**
  - [ ] Ao clicar no nome do prompt, abre o modal de detalhe igual ao descrito em US06.1.

### US10.2 - Exportação de Registros (v4)
**Como um** coordenador de correção,
**Eu quero** exportar todos os registros da lista
**Para que** eu tenha um relatório para análise offline ou compartilhamento.
- **Relacionado a:** RN16.3
- **Critérios de Aceite:**
  - [ ] Botão de exportação visível na interface.
  - [ ] Exporta um arquivo (CSV ou Excel) com colunas: Status, Unidade de Negócio, Cluster, Curso, Tipo de Atividade, Prompt, Criado em, Criado por, Atualizado em, Atualizado por.

### US11 - Filtros Multi-Select com Hierarquia Cascata (v4)
**Como um** coordenador de correção,
**Eu quero** filtrar a lista usando dropdowns com checkboxes de múltipla seleção que respeitem a hierarquia
**Para que** eu localize rapidamente as combinações que preciso configurar.
- **Relacionado a:** RN14
- **Critérios de Aceite:**
  - [ ] Cada filtro permite busca por digitação.
  - [ ] Cada filtro possui seta/ícone que abre dropdown com checkboxes.
  - [ ] Primeira opção do dropdown: "Selecionar todas" (toggle).
  - [ ] Ao selecionar no filtro superior, os filtros abaixo atualizam com opções relacionadas.
  - [ ] Hierarquia: Unidade → Cluster → Curso → Disciplina → Atividade → Prompt → Status.

### US11.1 - Paginação Padrão
**Como um** coordenador de correção,
**Eu quero** que a paginação da Ativar Correção siga o padrão visual da Auditoria
**Para que** haja consistência em todo o módulo.
- **Relacionado a:** RN16.1, RN32
- **Critérios de Aceite:**
  - [ ] Seletor de itens (10/25/50/100), default 25.
  - [ ] Botões Anterior/Próximo com ícones, indicador "Página X de Y".

---

## TEMA 4: Auditoria de Correções

### US12 - Painel de Auditoria (manter atual — REFERÊNCIA DE PAGINAÇÃO)
**Como um** auditor ou gestor do sistema,
**Eu quero** acessar a aba de auditoria com a estrutura já implementada
**Para que** eu possa consultar as parametrizações de IA, verificar quem configurou e quando.
- **Relacionado a:** RN17, RN18, RN32
- **Critérios de Aceite:**
  - [x] A tabela exibe: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - [x] Filtros por coluna, ordenação por cabeçalho, paginação (25 default, opções 10/25/50/100).
  - [x] Checkboxes de seleção + botão "Alterar Status" para ações em lote.
  - [x] **Este componente de paginação é o padrão visual para as Abas 2, 3 e 5.**

---

## TEMA 5: Publicação de Notas

### US13 - Painel de Publicação com Layout Split (v4)
**Como um** coordenador de correção,
**Eu quero** uma aba com painel superior dividido: regras à esquerda e configurações globais à direita
**Para que** eu tenha acesso às regras de referência enquanto configuro os parâmetros de publicação.
- **Relacionado a:** RN23, RN25
- **Critérios de Aceite:**
  - [ ] Painel superior ocupando 50% esquerda com regras textuais de publicação automática.
  - [ ] 50% direita com os campos:
    - **Nota**: Input numérico inteiro (0–100), **sem símbolo de %**.
    - **Prazo de publicação**: Input numérico inteiro (0–99) representando **dias**.
    - **Ativar Publicação**: Botão de ativação (substitui o toggle anterior).
  - [ ] Tabela com filtros multi-select hierárquicos (mesmos da Aba 3), incluindo coluna **Disciplina** após Curso.
  - [ ] Filtro de **Disciplina** adicionado **após o filtro de Curso**.
  - [ ] Botão **Pesquisar** após os filtros (mesmos critérios de US04.0).
  - [ ] Paginação padrão Auditoria.

### US13.1 - Botão Ativar Publicação (v4 — Lógica Inteligente)
**Como um** coordenador de correção,
**Eu quero** ativar ou inativar publicação em massa com lógica inteligente
**Para que** eu gerencie a publicação de notas de forma eficiente.
- **Relacionado a:** RN25.1
- **Critérios de Aceite:**
  - [ ] Botão chama-se **"Ativar Publicação"**.
  - [ ] **Se houver checkboxes marcados com ao menos 1 publicação inativa**: ativa publicação em todos os marcados.
  - [ ] **Se todos os marcados já possuem publicação ativa**: inativa publicação em todos os marcados.
  - [ ] **Se nenhum checkbox marcado**: aplica lógica aos registros filtrados.
  - [ ] O texto do botão exibe a **quantidade de registros afetados**.
  - [ ] Sweet alert de confirmação antes, sweet alert de conclusão depois.

### US14 - Regra de Dependência com Correção (v4 — Atualizada)
**Como um** coordenador de correção,
**Eu quero** que o sistema impeça habilitar publicação automática se a correção estiver desabilitada
**Para que** não exista uma situação inconsistente onde notas são publicadas sem que a correção por IA esteja ativa.
- **Relacionado a:** RN24
- **Critérios de Aceite:**
  - [ ] Se a correção de um registro está Inativa, o botão de publicação fica **indisponível** para aquele registro.
  - [ ] Correção Ativa + Publicação Desabilitada é um estado **válido**.
  - ~~Correção Desabilitada + Publicação Ativa é um estado inválido (bloqueado).~~ **REMOVIDO na v4**.

### US15 - Validação do Botão Ativar Publicação (v4)
**Como um** coordenador de correção,
**Eu quero** que o botão "Ativar Publicação" só possa ser utilizado quando Nota e Prazo estiverem preenchidos corretamente
**Para que** todas as publicações automáticas tenham parâmetros válidos configurados.
- **Relacionado a:** RN26, RN27
- **Critérios de Aceite:**
  - [ ] Botão desabilitado enquanto Nota ou Prazo estiverem vazios ou com valores inválidos (fora dos limites).
  - [ ] Ao ativar/desativar a publicação, grava automaticamente Nota, Prazo e status de Publicação.
  - [ ] Os valores de Nota e Prazo podem ser ajustados a qualquer momento.
