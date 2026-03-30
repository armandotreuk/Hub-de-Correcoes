# Histórias de Usuário v3 - RF001: Correções por IA

Este documento traduz as Regras de Negócio (RN01 a RN32) em Histórias de Usuário, organizadas pelas 5 abas do módulo.

---

## TEMA 1: Cadastro de Prompt

### US01 - Criação de Novo Prompt
**Como um** analista pedagógico,
**Eu quero** criar um novo prompt de correção preenchendo título, corpo do prompt, unidade de negócio e tipo de atividade
**Para que** o sistema disponha de instruções textuais padronizadas que orientem a IA na correção de cada tipo de avaliação.
- **Relacionado a:** RN01, RN02
- **Critérios de Aceite:**
  - [ ] Deve existir um botão "Criar Novo Prompt" na tela.
  - [ ] Ao clicar, libera os campos: Título (texto curto), Corpo do Prompt (textarea até 10.000 caracteres), dropdown de Unidade de Negócio, dropdown de Tipo de Atividade.
  - [ ] Os campos de Unidade de Negócio e Tipo de Atividade são **obrigatórios** na criação.
  - [ ] O campo de texto do prompt deve ser amplo, oferecendo boa experiência de escrita.
  - [ ] O prompt é criado com a Situação **Ativo** por padrão.

### US02 - Edição de Prompt Existente
**Como um** analista pedagógico,
**Eu quero** selecionar um prompt da lista de prompts criados e editar seu conteúdo
**Para que** eu possa refinar as instruções de correção conforme a evolução do modelo de IA.
- **Relacionado a:** RN03, RN05
- **Critérios de Aceite:**
  - [ ] A tela deve exibir uma lista de todos os prompts cadastrados (respeitando filtros).
  - [ ] Ao selecionar um prompt, seu título, corpo, unidade, atividade e observações devem ser carregados nos campos de edição.
  - [ ] As alterações do prompt podem ser salvas via botão "Salvar".

### US03 - Persistência com Validação de Navegação
**Como um** analista pedagógico,
**Eu quero** ser avisado ao tentar sair da aba ou da tela se houver alterações não salvas
**Para que** eu não perca acidentalmente edições importantes em um prompt.
- **Relacionado a:** RN04
- **Critérios de Aceite:**
  - [ ] Se o usuário alterou qualquer campo e tenta navegar para outra aba ou fechar a tela, um diálogo de confirmação deve ser exibido.
  - [ ] O diálogo deve oferecer opções "Salvar", "Descartar" ou "Cancelar".

### US03.1 - Ativar/Inativar Prompt (Deprecated)
**Como um** analista pedagógico,
**Eu quero** marcar um prompt como Inativo (deprecated)
**Para que** prompts obsoletos não apareçam na listagem padrão sem precisar excluí-los.
- **Relacionado a:** RN05.1
- **Critérios de Aceite:**
  - [ ] Ao selecionar um prompt, deve existir um botão/badge "Ativo" ou "Inativo" exibido.
  - [ ] Ao clicar, alterna entre Ativo e Inativo gravando a situação no banco.
  - [ ] O prompt inativo é considerado deprecated.

### US03.2 - Campo de Observações
**Como um** analista pedagógico,
**Eu quero** registrar observações em um prompt
**Para que** minha equipe possa deixar comentários e anotações sobre o uso ou histórico daquele prompt.
- **Relacionado a:** RN05.2
- **Critérios de Aceite:**
  - [ ] Abaixo do campo "Corpo do Prompt" deve existir um textarea "Observações" (até 10.000 caracteres).
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

---

## TEMA 2: Relacionar Prompt

### US04 - Vinculação de Prompt a Cursos
**Como um** analista pedagógico,
**Eu quero** vincular prompts cadastrados a cursos específicos
**Para que** cada curso tenha instruções de correção por IA apropriadas ao seu contexto acadêmico.
- **Relacionado a:** RN06, RN09
- **Critérios de Aceite:**
  - [ ] A tela deve possuir filtros hierárquicos empilhados: Unidade de Negócio → Tipo de Atividade → Prompt.
  - [ ] Os filtros devem ser checkboxes de múltipla seleção.
  - [ ] Ao selecionar um filtro, os filtros abaixo atualizam com opções relacionadas.
  - [ ] A tabela deve exibir colunas: Checkbox, Unidade de Negócio, Tipo de Atividade, Cluster, Curso, Prompt Vinculado.

### US04.1 - Vinculação em Massa
**Como um** analista pedagógico,
**Eu quero** selecionar múltiplos cursos e vincular um prompt de uma vez
**Para que** eu ganhe produtividade ao configurar grandes volumes de vínculos.
- **Relacionado a:** RN09.1
- **Critérios de Aceite:**
  - [ ] Checkbox de seleção na primeira coluna de cada registro.
  - [ ] Após os filtros, área com dropdown de prompt (obedece hierarquia de Unidade + Atividade) + botão "Vincular".
  - [ ] Ao clicar "Vincular", aplica o prompt selecionado a todos os cursos com checkbox marcado.

### US05 - Restrição de Unicidade de Vínculo
**Como um** gestor do sistema,
**Eu quero** que um curso não possua mais de um prompt para o mesmo tipo de atividade
**Para que** não haja conflito de instruções de correção para uma mesma avaliação.
- **Relacionado a:** RN07
- **Critérios de Aceite:**
  - [ ] Se o usuário tentar vincular um prompt a um curso que já possui outro prompt para o mesmo tipo de atividade, o sistema deve bloquear ou alertar sobre o conflito.
  - [ ] A restrição é na combinação (Curso + Tipo de Atividade).

### US06 - Gestão de Vínculos (Alterar e Remover)
**Como um** analista pedagógico,
**Eu quero** alterar o prompt vinculado a um curso ou remover completamente o vínculo
**Para que** eu tenha flexibilidade para ajustar as configurações conforme necessário.
- **Relacionado a:** RN08
- **Critérios de Aceite:**
  - [ ] Deve ser possível substituir o prompt de um curso por outro prompt (do mesmo tipo de atividade).
  - [ ] Deve ser possível remover o vínculo de prompt de um curso.
  - [ ] Podem existir registros sem vínculo com prompt (exibido como "—").

### US06.1 - Modal de Detalhe do Prompt Vinculado
**Como um** analista pedagógico,
**Eu quero** clicar no prompt vinculado a um curso e visualizar seus detalhes em um modal
**Para que** eu possa consultar e adicionar observações sem sair da tela de vínculos.
- **Relacionado a:** RN09.3
- **Critérios de Aceite:**
  - [ ] Ao clicar no nome do prompt vinculado, abre modal no centro da tela.
  - [ ] Layout idêntico ao editor da Aba 1 (Título, Unidade, Atividade, Corpo, Observações).
  - [ ] Campos Título, Unidade, Tipo de Atividade e Corpo do Prompt estão **bloqueados** (visual com cor diferente para refletir o bloqueio).
  - [ ] Campo Observações está **liberado** para edição com botão "Salvar Comentário".

### US07 - Paginação Padrão
**Como um** analista pedagógico,
**Eu quero** que a lista de cursos/vínculos use o padrão de paginação da Auditoria
**Para que** haja consistência visual em todo o módulo.
- **Relacionado a:** RN10, RN32
- **Critérios de Aceite:**
  - [ ] Paginação com seletor de itens (10/25/50/100), default 25.
  - [ ] Texto "Exibindo X por página", indicador "Página X de Y".
  - [ ] Botões Anterior/Próximo com ícones e estados disabled.

---

## TEMA 3: Configurar Correção

### US08 - Visão Consolidada de Combinações
**Como um** coordenador de correção,
**Eu quero** visualizar uma lista consolidada com todas as combinações Unidade > Cluster > Curso > Tipo de Atividade > Prompt
**Para que** eu tenha uma visão completa de onde a IA pode atuar e controle qual combinação está ativa ou inativa.
- **Relacionado a:** RN11, RN13
- **Critérios de Aceite:**
  - [ ] A lista exibe todas as combinações possíveis com colunas: Checkbox, Status, Unidade, Cluster, Curso, Tipo de Atividade, Prompt.
  - [ ] Todo novo registro aparece com Status **Inativo** por padrão.

### US09 - Ativação/Desativação Individual
**Como um** coordenador de correção,
**Eu quero** ativar ou inativar a correção por IA de um registro individual diretamente na lista
**Para que** eu possa controlar pontualmente quais combinações curso/atividade estão usando IA.
- **Relacionado a:** RN15
- **Critérios de Aceite:**
  - [ ] Cada linha da tabela deve possuir um badge clicável para alternar entre Ativo e Inativo.

### US10 - Ativação/Desativação em Lote
**Como um** coordenador de correção,
**Eu quero** selecionar múltiplos registros e alterar o status de correção em massa
**Para que** eu economize tempo ao configurar grandes volumes de combinações.
- **Relacionado a:** RN16
- **Critérios de Aceite:**
  - [ ] Checkboxes de seleção em cada linha + checkbox master no cabeçalho.
  - [ ] Botão "Alterar Status" visível quando há registros selecionados.
  - [ ] A ação em lote alterna o status dos registros selecionados.

### US11 - Filtros Multi-Select com Hierarquia Cascata
**Como um** coordenador de correção,
**Eu quero** filtrar a lista usando dropdowns com checkboxes de múltipla seleção que respeitem a hierarquia
**Para que** eu localize rapidamente as combinações que preciso configurar.
- **Relacionado a:** RN14
- **Critérios de Aceite:**
  - [ ] Cada filtro permite busca por digitação.
  - [ ] Cada filtro possui seta/ícone que abre dropdown com checkboxes.
  - [ ] Primeira opção do dropdown: "Selecionar todas" (toggle).
  - [ ] Ao selecionar no filtro superior, os filtros abaixo atualizam com opções relacionadas.
  - [ ] Hierarquia: Unidade → Cluster → Curso → Atividade → Prompt → Status.

### US11.1 - Paginação Padrão
**Como um** coordenador de correção,
**Eu quero** que a paginação da Configurar Correção siga o padrão visual da Auditoria
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
  - [ ] A tabela exibe: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - [ ] Filtros por coluna, ordenação por cabeçalho, paginação (25 default, opções 10/25/50/100).
  - [ ] Checkboxes de seleção + botão "Alterar Status" para ações em lote.
  - [ ] **Este componente de paginação é o padrão visual para as Abas 2, 3 e 5.**

---

## TEMA 5: Publicação de Notas

### US13 - Painel de Publicação com Layout Split
**Como um** coordenador de correção,
**Eu quero** uma aba com painel superior dividido: regras à esquerda e configurações globais à direita
**Para que** eu tenha acesso às regras de referência enquanto configuro os parâmetros de publicação.
- **Relacionado a:** RN23, RN25
- **Critérios de Aceite:**
  - [ ] Painel superior ocupando 50% esquerda com regras textuais de publicação automática.
  - [ ] 50% direita com os campos:
    - **Nota**: Input numérico inteiro (0–100).
    - **Prazo de publicação**: Input numérico inteiro (0–99) representando **dias**.
    - **Publicação Automática**: Toggle liga/desliga com subtexto "Aprovar liberação de nota automática".
  - [ ] Tabela com filtros multi-select hierárquicos (mesmos da Aba 3).
  - [ ] Paginação padrão Auditoria.

### US14 - Regra de Dependência com Correção
**Como um** coordenador de correção,
**Eu quero** que o sistema impeça habilitar publicação automática se a correção estiver desabilitada
**Para que** não exista uma situação inconsistente onde notas são publicadas sem que a correção por IA esteja ativa.
- **Relacionado a:** RN24
- **Critérios de Aceite:**
  - [ ] Se a correção de um registro está Inativa, o sistema deve bloquear a habilitação da publicação para aquele registro.
  - [ ] Correção Ativa + Publicação Desabilitada é um estado **válido**.
  - [ ] Correção Desabilitada + Publicação Ativa é um estado **inválido** (bloqueado).

### US15 - Validação do Toggle de Publicação Automática
**Como um** coordenador de correção,
**Eu quero** que o toggle de Publicação Automática só possa ser ativado quando Nota e Prazo estiverem preenchidos corretamente
**Para que** todas as publicações automáticas tenham parâmetros válidos configurados.
- **Relacionado a:** RN26, RN27
- **Critérios de Aceite:**
  - [ ] Toggle desabilitado enquanto Nota ou Prazo estiverem vazios ou com valores inválidos (fora dos limites).
  - [ ] Ao ativar/desativar o toggle, grava automaticamente Nota, Prazo e status de Publicação.
  - [ ] Os valores de Nota e Prazo podem ser ajustados a qualquer momento.
