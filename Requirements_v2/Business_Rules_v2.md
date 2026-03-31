# Regras de Negócio v3: RF001 - Correções por IA

Este documento define as regras de negócio para o módulo **Correções por IA**, reestruturado em 5 abas funcionais.

## Hierarquia da Informação

A estrutura organizacional segue a seguinte precedência:

```
1. Unidade de Negócio (ex: Uniasselvi, Unicesumar)
   2. Cluster (ex: Cluster Norte, Cluster Sul)
      3. Curso (ex: Engenharia de Software, Administração)
         4.1 Disciplina (ex: Algoritmos, Gestão de Projetos)
         4.2 Tipo de Atividade (ex: Desafio Profissional, Resenha, Prova, MAPA)
```

---

## 1. Cadastro de Prompt

- **RN01 - Entidade Prompt**: O Prompt é uma entidade de primeira classe composta por: **Título** (identificador textual), **Corpo** (texto do prompt, até 10.000 caracteres), **Unidade de Negócio** e **Tipo de Atividade** vinculados obrigatoriamente na criação, **Observações** (campo de texto livre até 10.000 caracteres para comentários de usuários), e **Situação** (Ativo ou Inativo, default: Ativo).
- **RN02 - Criação de Prompt**: O sistema deve permitir a criação de novos prompts através de um formulário dedicado na aba "Cadastro Prompt".
- **RN03 - Edição de Prompt**: Prompts existentes devem ser editáveis. Ao selecionar um prompt da lista, seus dados (título, corpo, unidade, atividade, observações) devem ser carregados nos campos de edição.
- **RN04 - Persistência e Validação de Alterações**: Ao tentar navegar para outra aba ou tela com alterações não salvas, o sistema deve exibir uma confirmação ao usuário perguntando se deseja salvar as alterações pendentes.
- **RN05 - Listagem de Prompts**: O sistema deve manter e exibir uma lista de todos os prompts criados, permitindo seleção para visualização e edição.
- **RN05.1 - Situação do Prompt (Ativo/Inativo)**: Ao selecionar um prompt, deve existir um botão que permita alternar entre Ativo e Inativo. Ao inativar, o prompt é considerado deprecated no banco de dados.
- **RN05.2 - Campo de Observações**: Abaixo do campo Corpo do Prompt, deve existir um campo de texto "Observações" (até 10.000 caracteres) para comentários dos usuários. O campo possui botão próprio "Salvar Comentário" independente do botão "Salvar" do prompt.
- **RN05.3 - Filtros na Lista de Prompts**: A lista de prompts deve permitir filtragem por:
  - **Unidade de Negócio** (dropdown, não obrigatório)
  - **Tipo de Atividade** (dropdown, não obrigatório)
  - **Situação** (checkbox múltiplo: Ativo e/ou Inativo). Por padrão, o filtro inicia com "Ativo" marcado. Se nenhuma opção for selecionada, nenhum prompt é exibido.
  > **Nota de design (UX intencional)**: O comportamento "sem seleção = nenhum resultado" é deliberado. Ao contrário do padrão "filtro vazio = exibir tudo", este módulo lida com prompts Ativos e Inativos simultaneamente. Exigir ao menos uma seleção explícita evita que o usuário visualize acidentalmente prompts inativos (deprecated). Isso também reforça o estado consciente do filtro: o usuário sabe exatamente o que está vendo.

---

## 2. Relacionamento de Prompt

- **RN06 - Vinculação Prompt-Curso**: Cada prompt cadastrado pode ser vinculado a um ou mais **Cursos**. O vínculo é contextualizado pela Unidade de Negócio e Tipo de Atividade já associados ao prompt.
- **RN07 - Unicidade de Vínculo**: Um Curso não pode ter mais de um prompt vinculado para o mesmo Tipo de Atividade. Exemplo: o curso "Engenharia de Software" só pode ter 1 prompt para "Desafio Profissional".
- **RN08 - Gestão de Vínculos**: O sistema deve permitir: vincular um prompt a um curso, alterar o prompt vinculado a um curso, e remover o vínculo de prompt de um curso.
- **RN09 - Filtros Hierárquicos**: A tela deve possuir filtros hierárquicos em cascata na ordem: Unidade de Negócio → Tipo de Atividade → Prompt. Cada filtro deve ser um dropdown com checkbox de múltipla seleção. Ao selecionar uma opção de filtro superior, os filtros abaixo atualizam suas opções.
- **RN09.1 - Vinculação em Massa**: Após os filtros, deve haver uma área com dropdown de seleção de prompt (obedecendo a hierarquia dos filtros) e um botão para vincular o prompt selecionado a todos os registros com checkbox marcado na tabela.
- **RN09.2 - Registros sem Vínculo**: Podem existir registros na tabela sem vínculo com nenhum prompt.
- **RN09.3 - Modal de Detalhe do Prompt**: Ao clicar no prompt vinculado a um registro, deve abrir um modal centralizado na tela com layout idêntico ao editor da Aba 1:
  - Campos Título, Unidade de Negócio e Tipo de Atividade **bloqueados** para edição (visual diferenciado com outra cor de fundo).
  - Campo Corpo do Prompt **bloqueado** para edição.
  - Campo Observações **liberado** para edição com botão "Salvar Comentário".
- **RN10 - Paginação de Registros**: A lista de cursos/vínculos deve seguir o padrão de paginação da Auditoria (25 default, opções 10/25/50/100, seletor de itens por página e navegação Anterior/Próximo).

---

## 3. Configurar Correção

- **RN11 - Visão Consolidada**: O sistema deve exibir uma lista consolidada no formato: **Unidade de Negócio > Cluster > Curso > Tipo de Atividade > Prompt**, permitindo visualizar todas as combinações configuráveis.
- **RN12 - Status de Correção (Ativo/Inativo)**: Cada registro na lista deve possuir um status indicando se a correção por IA está ativa ou inativa para aquela combinação.
- **RN13 - Default Inativo**: Toda nova combinação deve ser criada com o status de correção **Inativo** por padrão.
- **RN14 - Filtros Multi-Select com Hierarquia**: A tela deve oferecer filtros para todos os parâmetros (Unidade, Cluster, Curso, Tipo de Atividade, Prompt, Status). Cada filtro deve:
  - Permitir pesquisa por digitação
  - Possuir seta/ícone que abre um dropdown com opções selecionáveis via checkbox
  - A primeira opção do dropdown deve ser "Selecionar todas" (se todas selecionadas e clicar, desselecionam; se nem todas, selecionam-se)
  - Ao selecionar uma opção num filtro, os filtros abaixo na hierarquia devem se atualizar com opções relacionadas (cascata de cima para baixo)
- **RN15 - Ativação/Desativação Individual**: Deve ser possível ativar ou inativar a correção de um único registro diretamente na lista.
- **RN16 - Ativação/Desativação em Lote**: Deve ser possível selecionar múltiplos registros e alterar o status de correção em massa através do botão "Alterar Status".
- **RN16.1 - Paginação Padrão Auditoria**: → Ver **RN21** (seção 4. Auditoria de Correções), que define o padrão de paginação centralizado para todo o módulo. Não duplicar especificação aqui.

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

- **RN23 - Estrutura Espelhada**: A aba de Publicação de Notas deve replicar a estrutura visual e funcional da aba de Configurar Correção (tabela, filtros multi-select com hierarquia, paginação padrão Auditoria, seleção em lote).
- **RN24 - Dependência da Correção**: Um registro **não pode** ter publicação de notas habilitada se a correção estiver desabilitada. Porém, um registro **pode** ter correção ativa com publicação desabilitada.
- **RN25 - Painel de Regras (Layout Split)**: O painel superior deve ser dividido 50/50 horizontalmente:
  - **Lado Esquerdo**: Regras de Publicação Automática (texto descritivo).
  - **Lado Direito**: Configurações globais:
    - **Nota**: Campo numérico inteiro de 0 a 100.
    - **Prazo de publicação**: Campo numérico inteiro de 0 a 99, representando **dias**.
    - **Publicação Automática**: Botão liga/desliga com subtexto "Aprovar liberação de nota automática".
- **RN26 - Validação de Publicação Automática**: O botão de Publicação Automática só pode ser ativado se os campos Nota e Prazo estiverem preenchidos com números inteiros válidos dentro dos limites.
- **RN27 - Gravação Automática**: Ao ativar ou desativar o toggle de Publicação Automática, devem ser gravadas automaticamente as informações de Nota, Prazo e status de Publicação Automática.
- **RN28 - Regra de Corte por Desempenho**: Submissões avaliadas pela IA cujo desempenho (%) fique **igual ou acima** da Nota configurada terão a nota registrada automaticamente. Submissões abaixo ficarão retidas para curadoria manual dentro do prazo (em dias) configurado.
- **RN29 - Ajuste Dinâmico**: Os valores de Nota e Prazo podem ser ajustados a qualquer momento pela equipe pedagógica.

---

## 6. Navegação e Acesso

- **RN30 - Acesso via Menu**: A funcionalidade deve ser acessada através do link "**Correções por IA**" no submenu de "**Acadêmico**" do menu lateral principal.
- **RN31 - Estrutura de Abas**: A tela principal deve apresentar 5 abas na seguinte ordem: *Cadastro Prompt*, *Relacionar Prompt*, *Configurar Correção*, *Auditoria Correções*, *Publicação de Notas*.
- **RN32 - Componente de Paginação Padronizado**: Todas as abas com tabelas (Relacionar Prompt, Configurar Correção, Auditoria, Publicação) devem usar o mesmo componente de paginação da Auditoria: seletor de itens (10/25/50/100), texto "Exibindo X por página", indicador "Página X de Y", botões Anterior/Próximo com ícones e estados disabled.
