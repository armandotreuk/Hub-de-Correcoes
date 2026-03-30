# Histórias de Usuário v2 - RF001: Correções por IA

Este documento traduz as Regras de Negócio (RN01 a RN30) em Histórias de Usuário, organizadas pelas 5 abas do módulo.

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

### US02 - Edição de Prompt Existente
**Como um** analista pedagógico,
**Eu quero** selecionar um prompt da lista de prompts criados e editar seu conteúdo
**Para que** eu possa refinar as instruções de correção conforme a evolução do modelo de IA.
- **Relacionado a:** RN03, RN05
- **Critérios de Aceite:**
  - [ ] A tela deve exibir uma lista de todos os prompts cadastrados.
  - [ ] Ao selecionar um prompt, seu título, corpo, unidade e atividade devem ser carregados nos campos de edição (os mesmos campos da criação).
  - [ ] As alterações podem ser salvas via botão "Salvar".

### US03 - Persistência com Validação de Navegação
**Como um** analista pedagógico,
**Eu quero** ser avisado ao tentar sair da aba ou da tela se houver alterações não salvas
**Para que** eu não perca acidentalmente edições importantes em um prompt.
- **Relacionado a:** RN04
- **Critérios de Aceite:**
  - [ ] Se o usuário alterou qualquer campo e tenta navegar para outra aba ou fechar a tela, um diálogo de confirmação deve ser exibido.
  - [ ] O diálogo deve oferecer opções "Salvar", "Descartar" ou "Cancelar".

---

## TEMA 2: Relacionar Prompt

### US04 - Vinculação de Prompt a Cursos
**Como um** analista pedagógico,
**Eu quero** vincular prompts cadastrados a cursos específicos
**Para que** cada curso tenha instruções de correção por IA apropriadas ao seu contexto acadêmico.
- **Relacionado a:** RN06, RN09
- **Critérios de Aceite:**
  - [ ] A tela deve exibir a lista de prompts cadastrados para seleção.
  - [ ] Ao selecionar um prompt, deve ser possível navegar pelos Clusters e Cursos da Unidade de Negócio do prompt.
  - [ ] O sistema deve permitir vincular o prompt selecionado a um ou mais cursos.

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

### US07 - Paginação da Lista de Cursos
**Como um** analista pedagógico,
**Eu quero** que a lista de cursos/vínculos seja paginada com 100 registros por padrão
**Para que** a tela tenha boa performance mesmo com grande volume de cursos.
- **Relacionado a:** RN10
- **Critérios de Aceite:**
  - [ ] A lista de cursos deve ser paginada, exibindo 100 registros por página como padrão.

---

## TEMA 3: Configurar Correção

### US08 - Visão Consolidada de Combinações
**Como um** coordenador de correção,
**Eu quero** visualizar uma lista consolidada com todas as combinações Unidade > Cluster > Curso > Tipo de Atividade > Prompt
**Para que** eu tenha uma visão completa de onde a IA pode atuar e controle qual combinação está ativa ou inativa.
- **Relacionado a:** RN11, RN13
- **Critérios de Aceite:**
  - [ ] A lista exibe todas as combinações possíveis com colunas: Unidade, Cluster, Curso, Tipo de Atividade, Prompt, Status.
  - [ ] Todo novo registro aparece com Status **Inativo** por padrão.

### US09 - Ativação/Desativação Individual
**Como um** coordenador de correção,
**Eu quero** ativar ou inativar a correção por IA de um registro individual diretamente na lista
**Para que** eu possa controlar pontualmente quais combinações cursa/atividade estão usando IA.
- **Relacionado a:** RN15
- **Critérios de Aceite:**
  - [ ] Cada linha da tabela deve possuir um controle (switch ou botão) para alterar o status entre Ativo e Inativo.

### US10 - Ativação/Desativação em Lote
**Como um** coordenador de correção,
**Eu quero** selecionar múltiplos registros e alterar o status de correção em massa
**Para que** eu economize tempo ao configurar grandes volumes de combinações.
- **Relacionado a:** RN16
- **Critérios de Aceite:**
  - [ ] Checkboxes de seleção em cada linha + checkbox master no cabeçalho.
  - [ ] Botão "Alterar Status" visível quando há registros selecionados.
  - [ ] A ação em lote alterna o status dos registros selecionados.

### US11 - Filtros Completos
**Como um** coordenador de correção,
**Eu quero** filtrar a lista por qualquer parâmetro (Unidade, Cluster, Curso, Atividade, Prompt, Status)
**Para que** eu localize rapidamente as combinações que preciso configurar.
- **Relacionado a:** RN14
- **Critérios de Aceite:**
  - [ ] Filtros de texto ou dropdown disponíveis para todas as colunas exibidas.

---

## TEMA 4: Auditoria de Correções

### US12 - Painel de Auditoria (manter atual)
**Como um** auditor ou gestor do sistema,
**Eu quero** acessar a aba de auditoria com a estrutura já implementada
**Para que** eu possa consultar as parametrizações de IA, verificar quem configurou e quando.
- **Relacionado a:** RN17, RN18
- **Critérios de Aceite:**
  - [ ] A tabela exibe: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, Ativado por, Data.
  - [ ] Filtros por coluna, ordenação por cabeçalho, paginação (25 default, opções 10/25/50/100).
  - [ ] Checkboxes de seleção + botão "Alterar Status" para ações em lote.

---

## TEMA 5: Publicação de Notas

### US13 - Painel de Publicação (estrutura espelhada da Auditoria)
**Como um** coordenador de correção,
**Eu quero** uma aba dedicada à gestão da publicação automática de notas, com a mesma estrutura visual da Auditoria
**Para que** eu gerencie separadamente quais combinações têm publicação automática habilitada.
- **Relacionado a:** RN23, RN28
- **Critérios de Aceite:**
  - [ ] A tabela replica a estrutura da Auditoria (filtros por coluna, ordenação, paginação, seleção em lote).
  - [ ] O campo Status indica se o registro está habilitado para **liberação automática de notas**.

### US14 - Regra de Dependência com Correção
**Como um** coordenador de correção,
**Eu quero** que o sistema impeça habilitar publicação automática se a correção estiver desabilitada
**Para que** não exista uma situação inconsistente onde notas são publicadas sem que a correção por IA esteja ativa.
- **Relacionado a:** RN24
- **Critérios de Aceite:**
  - [ ] Se a correção de um registro está Inativa, o sistema deve bloquear a habilitação da publicação para aquele registro.
  - [ ] Correção Ativa + Publicação Desabilitada é um estado **válido**.
  - [ ] Correção Desabilitada + Publicação Ativa é um estado **inválido** (bloqueado).

### US15 - Configuração do Gatilho de Desempenho
**Como um** coordenador de correção,
**Eu quero** configurar o percentual mínimo de desempenho para publicação automática ao habilitar o registro
**Para que** apenas notas com alto nível de confiança sejam liberadas sem revisão humana.
- **Relacionado a:** RN25, RN26, RN27
- **Critérios de Aceite:**
  - [ ] Ao habilitar a publicação de um registro, o sistema deve exibir o campo de percentual de desempenho (%).
  - [ ] Notas com desempenho ≥ percentual configurado são publicadas automaticamente.
  - [ ] Notas abaixo do percentual ficam retidas para curadoria manual.
  - [ ] O percentual pode ser ajustado a qualquer momento.
