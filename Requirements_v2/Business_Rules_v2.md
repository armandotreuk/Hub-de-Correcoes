# Regras de Negócio v4: RF001 - Correções por IA

Este documento define as regras de negócio para o módulo **Correções por IA**, reestruturado em 5 abas funcionais.

## Hierarquia da Informação

A estrutura organizacional segue a seguinte precedência:

```
1. Unidade de Negócio (ex: Uniasselvi, Unicesumar)
   2. Cluster (ex: Cluster Norte, Cluster Sul)
      3. Curso (ex: Engenharia de Software, Administração)
         4. Disciplina (ex: Algoritmos, Gestão de Projetos)
            5. Tipo de Atividade (ex: Desafio Profissional, Resenha, Prova, MAPA)
```

> **Alteração v4**: Disciplina agora é um nível próprio na hierarquia (nível 4), acima de Tipo de Atividade (nível 5). Os vínculos de prompt passam a ser feitos por **Disciplina**, não mais por Curso.

---

## 1. Cadastro de Prompt

- **RN01 - Entidade Prompt**: O Prompt é uma entidade de primeira classe composta por: **Título** (identificador textual), **Prompt Avaliação** (textarea até 10.000 caracteres), **Prompt Feedback** (textarea até 10.000 caracteres), **Unidade de Negócio** e **Tipo de Atividade** vinculados obrigatoriamente na criação, **Observações** (campo de texto livre até 10.000 caracteres para comentários de usuários), e **Situação** (Ativo ou Inativo, default: Ativo).
- **RN01.1 - Dois Tipos de Corpo de Prompt**: Na tela de criação/edição do prompt devem existir **dois campos de texto** (textareas) para o corpo do prompt:
  - O primeiro campo é destinado ao **Prompt de Avaliação**.
  - O segundo campo (abaixo do primeiro) é destinado ao **Prompt de Feedback**.
  - Ambos possuem limite de 10.000 caracteres e contadores independentes.
- **RN02 - Criação de Prompt**: O sistema deve permitir a criação de novos prompts através de um formulário dedicado na aba "Cadastro Prompt".
- **RN03 - Edição de Prompt**: Prompts existentes devem ser editáveis. Ao selecionar um prompt da lista, seus dados (título, corpo avaliação, corpo feedback, unidade, atividade, observações) devem ser carregados nos campos de edição.
- **RN04 - Persistência e Validação de Alterações**: Ao tentar navegar para outra aba ou tela com alterações não salvas, o sistema deve exibir uma confirmação ao usuário perguntando se deseja salvar as alterações pendentes.
- **RN05 - Listagem de Prompts**: O sistema deve manter e exibir uma lista de todos os prompts criados, permitindo seleção para visualização e edição.
- **RN05.1 - Situação do Prompt (Ativo/Inativo)**: A Situação (Ativo/Inativo) deve ser exibida como um **dropdown no padrão visual dos dropdowns de Unidade de Negócio e Tipo de Atividade**, posicionada ao lado direito da caixa de Tipo de Atividade na mesma linha. Ao criar um novo prompt, o valor padrão deve ser **Ativo**. Ao inativar, o prompt é considerado deprecated no banco de dados.
- **RN05.2 - Campo de Observações**: Abaixo dos campos de Corpo do Prompt (Avaliação e Feedback), deve existir um campo de texto "Observações" (até 10.000 caracteres) para comentários dos usuários. O campo possui botão próprio "Salvar Comentário" independente do botão "Salvar" do prompt.
- **RN05.3 - Filtros na Lista de Prompts**: A lista de prompts deve permitir filtragem por:
  - **Unidade de Negócio** (dropdown, não obrigatório)
  - **Tipo de Atividade** (dropdown, não obrigatório)
  - **Situação** (checkbox múltiplo: Ativo e/ou Inativo). Por padrão, o filtro inicia com "Ativo" marcado. Se nenhuma opção for selecionada, nenhum prompt é exibido.
  > **Nota de design (UX intencional)**: O comportamento "sem seleção = nenhum resultado" é deliberado. Ao contrário do padrão "filtro vazio = exibir tudo", este módulo lida com prompts Ativos e Inativos simultaneamente. Exigir ao menos uma seleção explícita evita que o usuário visualize acidentalmente prompts inativos (deprecated). Isso também reforça o estado consciente do filtro: o usuário sabe exatamente o que está vendo.
- **RN05.4 - Estilo Visual dos Cards de Prompt**: Cada item da lista de prompts (prompt-item) deve possuir **contorno visível** (borda) para delimitar cada card. O badge de **Situação "Ativo"** deve ter estilo visual diferenciado com **cor de fundo e fonte que garantam alta legibilidade e fácil identificação** (evitar verde claro sobre fundo claro).

---

## 2. Relacionamento de Prompt

- **RN06 - Vinculação Prompt-Disciplina**: Cada prompt cadastrado pode ser vinculado a uma ou mais **Disciplinas**. O vínculo é contextualizado pela Unidade de Negócio e Tipo de Atividade já associados ao prompt.
- **RN07 - Unicidade de Vínculo**: Uma Disciplina não pode ter mais de um prompt vinculado para o mesmo Tipo de Atividade. Exemplo: a disciplina "Algoritmos" do curso "Engenharia de Software" só pode ter 1 prompt para "Desafio Profissional".
- **RN08 - Gestão de Vínculos**: O sistema deve permitir: vincular um prompt a uma disciplina, alterar o prompt vinculado a uma disciplina, e remover o vínculo de prompt de uma disciplina.
- **RN09 - Filtros Hierárquicos**: A tela deve possuir filtros hierárquicos em cascata na ordem: Unidade de Negócio → Cluster → Curso → Disciplina → Tipo de Atividade. Cada filtro deve ser um dropdown com checkbox de múltipla seleção. Ao selecionar uma opção de filtro superior, os filtros abaixo atualizam suas opções.
- **RN09.0 - Botão Pesquisar**: Após os filtros, deve haver um botão **"Pesquisar"**. Os filtros selecionados **somente são aplicados** na lista de registros ao clicar neste botão. Enquanto o backend processa a requisição, deve ser exibido um **sweet alert de loading**. Isso evita requisições desnecessárias durante a seleção de filtros.
- **RN09.1 - Vinculação em Massa (Lógica Inteligente)**: Após os filtros, deve haver uma área com dropdown de seleção de prompt + botão "Vincular Prompt em Massa":
  - **Caso 1 — Checkboxes marcados**: Se houver registros com checkbox marcado, ao clicar no botão "Vincular Prompt em Massa", o prompt selecionado será vinculado **apenas** aos registros selecionados.
  - **Caso 2 — Nenhum checkbox marcado**: Se não houver nenhum registro com checkbox marcado, ao clicar no botão "Vincular Prompt em Massa", o prompt selecionado será vinculado a **todos** os registros que se enquadrem nos filtros selecionados.
  - O texto do botão deve exibir a **quantidade de registros afetados** (selecionados no Caso 1, filtrados no Caso 2).
  - Ao clicar no botão, deve ser exibido um **sweet alert de confirmação** informando a quantidade de itens que serão vinculados/atualizados.
  - Ao final da execução, exibir outro **sweet alert** confirmando a quantidade de registros efetivamente vinculados.
- **RN09.1.1 - Validação de Vínculo Existente na Massa**: Antes de realizar a atualização de vínculo em massa, o sistema deve validar se já existe prompt vinculado ao registro. Se o registro já possuir o **mesmo** prompt selecionado para a operação em massa, o sistema **não deve atualizar** o registro, mas deve **contabilizá-lo** como "registro já vinculado" no sweet alert final (exibindo separadamente quantos foram efetivamente atualizados vs. quantos já estavam vinculados).
- **RN09.2 - Registros sem Vínculo**: Podem existir registros na tabela sem vínculo com nenhum prompt.
- **RN09.3 - Modal de Detalhe do Prompt**: Ao clicar no prompt vinculado a um registro, deve abrir um modal centralizado na tela com layout idêntico ao editor da Aba 1:
  - Campos Título, Unidade de Negócio e Tipo de Atividade **bloqueados** para edição (visual diferenciado com outra cor de fundo).
  - Campos Prompt Avaliação e Prompt Feedback **bloqueados** para edição.
  - Campo Observações **liberado** para edição com botão "Salvar Comentário".
- **RN10 - Paginação de Registros**: A lista de disciplinas/vínculos deve seguir o padrão de paginação da Auditoria (25 default, opções 10/25/50/100, seletor de itens por página e navegação Anterior/Próximo).

---

## 3. Ativar Correção por IA

> **Alteração v4**: Nome da aba alterado de "Configurar Correção" para "**Ativar Correção por IA**".

- **RN11 - Visão Consolidada**: O sistema deve exibir uma lista consolidada no formato: **Unidade de Negócio > Cluster > Curso > Disciplina > Tipo de Atividade > Prompt**, permitindo visualizar todas as combinações configuráveis.
- **RN12 - Status de Correção (Ativo/Inativo)**: Cada registro na lista deve possuir um status indicando se a correção por IA está ativa ou inativa para aquela combinação.
- **RN13 - Default Inativo**: Toda nova combinação deve ser criada com o status de correção **Inativo** por padrão.
- **RN14 - Filtros Multi-Select com Hierarquia**: A tela deve oferecer filtros para todos os parâmetros (Unidade, Cluster, Curso, Disciplina, Tipo de Atividade, Prompt, Status). Cada filtro deve:
  - Permitir pesquisa por digitação
  - Possuir seta/ícone que abre um dropdown com opções selecionáveis via checkbox
  - A primeira opção do dropdown deve ser "Selecionar todas" (se todas selecionadas e clicar, desselecionam; se nem todas, selecionam-se)
  - Ao selecionar uma opção num filtro, os filtros abaixo na hierarquia devem se atualizar com opções relacionadas (cascata de cima para baixo)
- **RN14.1 - Botão Pesquisar**: Os filtros somente são aplicados à lista de registros após clicar no botão **"Pesquisar"**. Enquanto o backend processa, exibir sweet alert de loading. Mesmo comportamento do botão Pesquisar da Aba 2 (RN09.0).
- **RN15 - Ativação/Desativação Individual**: Deve ser possível ativar ou inativar a correção de um único registro diretamente na lista.
- **RN16 - Ativar em Massa (Lógica Inteligente)**:
  - O botão chama-se **"Ativar em Massa"** e deve ficar **fixo na tela**, no mesmo padrão visual do botão "Vincular Prompt em Massa" da Aba 2.
  - **Caso 1 — Checkboxes marcados com ao menos 1 inativo**: Ao clicar, altera o status de **todos** os registros marcados para **Ativo**.
  - **Caso 2 — Todos marcados já estão Ativos**: Ao clicar, altera o status de **todos** os registros marcados para **Inativo**.
  - **Caso 3 — Nenhum checkbox marcado**: Aplica a lógica aos **todos os registros que satisfazem os filtros** (seguindo a mesma regra dos Casos 1/2).
  - O texto do botão deve exibir a **quantidade de registros afetados** (selecionados ou filtrados).
  - Ao clicar, exibir **sweet alert de confirmação** com a quantidade de itens que serão ativados/inativados. Ao final, exibir **sweet alert de conclusão** com o total de alterações e adições.
- **RN16.1 - Paginação Padrão Auditoria**: → Ver **RN21** (seção 4. Auditoria de Correções), que define o padrão de paginação centralizado para todo o módulo. Não duplicar especificação aqui.
- **RN16.2 - Modal de Detalhe do Prompt**: Ao clicar no nome do prompt na tabela, deve abrir o modal de detalhe do prompt (mesmo comportamento da US06.1 na Aba 2).
- **RN16.3 - Botão de Exportação**: Deve existir um botão de **exportação** que gere um arquivo com todos os registros contendo as colunas: Status, Unidade de Negócio, Cluster, Curso, Tipo de Atividade, Prompt, Criado em, Criado por, Atualizado em, Atualizado por.

---

## 4. Auditoria de Correções

- **RN17 - Painel de Auditoria**: O sistema deve manter a aba de auditoria listando todas as configurações de correção registradas, preservando a estrutura atual já implementada.
- **RN18 - Dados de Auditoria**: A lista deve exibir, no mínimo: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, quem configurou e data.
- **RN19 - Filtros por Coluna**: A lista deve oferecer caixas de pesquisa individuais por coluna para filtragem refinada.
- **RN20 - Ordenação**: O usuário deve conseguir ordenar a lista clicando nos cabeçalhos de coluna (crescente/decrescente).
- **RN21 - Paginação**: Paginação com padrão de 25 registros, opções de 10, 25, 50, 100. Seletor de itens por página + botões Anterior/Próximo com indicação de página atual. **Este é o padrão de paginação para todo o módulo**.
- **RN22 - Alteração de Status em Lote**: Checkboxes de seleção múltipla com botão "Alterar Status" para ações em lote.

---

## 5. Publicação de Notas

- **RN23 - Estrutura Espelhada**: A aba de Publicação de Notas deve replicar a estrutura visual e funcional da aba de Ativar Correção por IA (tabela, filtros multi-select com hierarquia, paginação padrão Auditoria, seleção em lote), incluindo a coluna **Disciplina** após a coluna Curso.
- **RN24 - Dependência da Correção (Atualizada v4)**: Um registro **não pode** ter publicação de notas habilitada se a correção estiver desabilitada. Porém, um registro **pode** ter correção ativa com publicação desabilitada.
  > **Alteração v4**: Removido o critério "Correção Desabilitada + Publicação Ativa é um estado inválido (bloqueado)". A regra agora é apenas: se a correção está Inativa, o botão de publicação fica indisponível para aquele registro. Não há bloqueio retroativo se a correção for desabilitada após a publicação já estar ativa.
- **RN25 - Painel de Regras (Layout Split)**: O painel superior deve ser dividido 50/50 horizontalmente:
  - **Lado Esquerdo**: Regras de Publicação Automática (texto descritivo).
  - **Lado Direito**: Configurações globais:
    - **Nota**: Campo numérico inteiro de 0 a 100 (**sem** símbolo de "%").
    - **Prazo de publicação**: Campo numérico inteiro de 0 a 99, representando **dias**.
    - **Ativar Publicação**: Botão de ativação (substitui o toggle anterior) com subtexto "Aprovar liberação de nota automática".
- **RN25.1 - Botão Ativar Publicação (Lógica Inteligente)**: O botão "Ativar Publicação" possui a mesma lógica inteligente de massa descrita em RN16:
  - **Caso 1 — Checkboxes marcados com ao menos 1 com publicação inativa**: Ativa publicação em todos os marcados.
  - **Caso 2 — Todos marcados já possuem publicação ativa**: Inativa publicação em todos os marcados.
  - **Caso 3 — Nenhum checkbox marcado**: Aplica lógica aos registros que satisfazem os filtros.
  - O texto do botão exibe a **quantidade de registros afetados**.
  - Ao clicar, exibir **sweet alert de confirmação** com quantidade. Ao final, **sweet alert de conclusão** com total de alterações.
- **RN25.2 - Filtro de Disciplina**: O filtro de Disciplina deve ser adicionado **após o filtro de Curso** na barra de filtros hierárquicos.
- **RN25.3 - Botão Pesquisar**: Os filtros somente são aplicados após clicar no botão **"Pesquisar"**. Exibir sweet alert de loading durante processamento.
- **RN26 - Validação de Publicação Automática**: O botão de Ativar Publicação só pode ser usado se os campos Nota e Prazo estiverem preenchidos com números inteiros válidos dentro dos limites.
- **RN27 - Gravação Automática**: Ao ativar ou desativar a Publicação para registros, devem ser gravadas automaticamente as informações de Nota, Prazo e status de Publicação.
- **RN28 - Regra de Corte por Desempenho**: Submissões avaliadas pela IA cujo desempenho fique **igual ou acima** da Nota configurada terão a nota registrada automaticamente. Submissões abaixo ficarão retidas para curadoria manual dentro do prazo (em dias) configurado.
- **RN29 - Ajuste Dinâmico**: Os valores de Nota e Prazo podem ser ajustados a qualquer momento pela equipe pedagógica.

---

## 6. Navegação e Acesso

- **RN30 - Acesso via Menu**: A funcionalidade deve ser acessada através do link "**Correções por IA**" no submenu de "**Acadêmico**" do menu lateral principal.
- **RN31 - Estrutura de Abas**: A tela principal deve apresentar 5 abas na seguinte ordem: *Cadastro Prompt*, *Relacionar Prompt*, *Ativar Correção por IA*, *Auditoria Correções*, *Publicação de Notas*.
- **RN32 - Componente de Paginação Padronizado**: Todas as abas com tabelas (Relacionar Prompt, Ativar Correção por IA, Auditoria, Publicação) devem usar o mesmo componente de paginação da Auditoria: seletor de itens (10/25/50/100), texto "Exibindo X por página", indicador "Página X de Y", botões Anterior/Próximo com ícones e estados disabled.
- **RN33 - Sweet Alerts Padronizados**: Todas as ações de massa e buscas por filtro devem utilizar sweet alerts padronizados:
  - **Loading**: Exibido durante processamento do backend (botão Pesquisar, vinculação em massa, ativação em massa).
  - **Confirmação**: Exibido antes de executar ação de massa, informando a quantidade de registros afetados.
  - **Conclusão**: Exibido após a execução, confirmando quantidades de registros alterados/adicionados.
