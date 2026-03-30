# Regras de Negócio v2: RF001 - Correções por IA

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

- **RN01 - Entidade Prompt**: O Prompt é uma entidade de primeira classe composta por: **Título** (identificador textual), **Corpo** (texto do prompt, até 10.000 caracteres), **Unidade de Negócio** e **Tipo de Atividade** vinculados obrigatoriamente na criação.
- **RN02 - Criação de Prompt**: O sistema deve permitir a criação de novos prompts através de um formulário dedicado na aba "Cadastro Prompt".
- **RN03 - Edição de Prompt**: Prompts existentes devem ser editáveis. Ao selecionar um prompt da lista, seus dados (título, corpo, unidade, atividade) devem ser carregados nos campos de edição.
- **RN04 - Persistência e Validação de Alterações**: Ao tentar navegar para outra aba ou tela com alterações não salvas, o sistema deve exibir uma confirmação ao usuário perguntando se deseja salvar as alterações pendentes.
- **RN05 - Listagem de Prompts**: O sistema deve manter e exibir uma lista de todos os prompts criados, permitindo seleção para visualização e edição.

---

## 2. Relacionamento de Prompt

- **RN06 - Vinculação Prompt-Curso**: Cada prompt cadastrado pode ser vinculado a um ou mais **Cursos**. O vínculo é contextualizado pela Unidade de Negócio e Tipo de Atividade já associados ao prompt.
- **RN07 - Unicidade de Vínculo**: Um Curso não pode ter mais de um prompt vinculado para o mesmo Tipo de Atividade. Exemplo: o curso "Engenharia de Software" só pode ter 1 prompt para "Desafio Profissional".
- **RN08 - Gestão de Vínculos**: O sistema deve permitir: vincular um prompt a um curso, alterar o prompt vinculado a um curso, e remover o vínculo de prompt de um curso.
- **RN09 - Filtro por Hierarquia**: A tela deve permitir navegar pelos Clusters e Cursos da Unidade de Negócio do prompt selecionado para facilitar a vinculação.
- **RN10 - Paginação de Registros**: A lista de cursos/vínculos deve ser paginada, exibindo por padrão **100 registros** por página.

---

## 3. Configurar Correção

- **RN11 - Visão Consolidada**: O sistema deve exibir uma lista consolidada no formato: **Unidade de Negócio > Cluster > Curso > Tipo de Atividade > Prompt**, permitindo visualizar todas as combinações configuráveis.
- **RN12 - Status de Correção (Ativo/Inativo)**: Cada registro na lista deve possuir um status indicando se a correção por IA está ativa ou inativa para aquela combinação.
- **RN13 - Default Inativo**: Toda nova combinação deve ser criada com o status de correção **Inativo** por padrão.
- **RN14 - Filtros Completos**: A tela deve oferecer filtros para todos os parâmetros exibidos (Unidade, Cluster, Curso, Tipo de Atividade, Prompt, Status).
- **RN15 - Ativação/Desativação Individual**: Deve ser possível ativar ou inativar a correção de um único registro diretamente na lista.
- **RN16 - Ativação/Desativação em Lote**: Deve ser possível selecionar múltiplos registros e alterar o status de correção em massa através do botão "Alterar Status".

---

## 4. Auditoria de Correções

- **RN17 - Painel de Auditoria**: O sistema deve manter a aba de auditoria listando todas as configurações de correção registradas, preservando a estrutura atual já implementada.
- **RN18 - Dados de Auditoria**: A lista deve exibir, no mínimo: Status, Unidade, Atividade, Cluster, Curso, Disciplina, Prompt, quem configurou e data.
- **RN19 - Filtros por Coluna**: A lista deve oferecer caixas de pesquisa individuais por coluna para filtragem refinada.
- **RN20 - Ordenação**: O usuário deve conseguir ordenar a lista clicando nos cabeçalhos de coluna (crescente/decrescente).
- **RN21 - Paginação**: Paginação com padrão de 25 registros, opções de 10, 25, 50, 100.
- **RN22 - Alteração de Status em Lote**: Checkboxes de seleção múltipla com botão "Alterar Status" para ações em lote.

---

## 5. Publicação de Notas

- **RN23 - Estrutura Espelhada**: A aba de Publicação de Notas deve replicar a estrutura visual e funcional da aba de Auditoria (tabela, filtros por coluna, ordenação, paginação, seleção em lote).
- **RN24 - Dependência da Correção**: Um registro **não pode** ter publicação de notas habilitada se a correção estiver desabilitada. Porém, um registro **pode** ter correção ativa com publicação desabilitada.
- **RN25 - Gatilho de Desempenho (On)**: Ao habilitar a publicação automática de notas, o sistema deve obrigatoriamente exibir um campo para configurar o **percentual de desempenho mínimo** para publicação direta.
- **RN26 - Regra de Corte**: Submissões avaliadas pela IA cujo desempenho (%) fique **igual ou acima** do referencial configurado terão a nota registrada automaticamente. Submissões abaixo ficarão retidas para curadoria manual.
- **RN27 - Ajuste Dinâmico do Percentual**: O valor percentual de desempenho pode ser ajustado/calibrado a qualquer momento pela equipe pedagógica.
- **RN28 - Status de Publicação**: O campo Status na tela de Publicação indica se o registro está habilitado para a **liberação automática das notas**, independentemente do status de correção.

---

## 6. Navegação e Acesso

- **RN29 - Acesso via Menu**: A funcionalidade deve ser acessada através do link "**Correções por IA**" no submenu de "**Acadêmico**" do menu lateral principal.
- **RN30 - Estrutura de Abas**: A tela principal deve apresentar 5 abas na seguinte ordem: *Cadastro Prompt*, *Relacionar Prompt*, *Configurar Correção*, *Auditoria Correções*, *Publicação de Notas*.
