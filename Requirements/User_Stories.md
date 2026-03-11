# Histórias de Usuário (User Stories) - RF001: Parametrização da Correção por IA

Este documento traduz as Regras de Negócio (RN01 a RN19) referentes à configuração da IA em cartões de Histórias de Usuário, utilizando o formato ágil padrão: *Como um [Ator], Eu quero [Ação] Para que [Benefício]*, além de definir os Critérios de Aceite para cada história.

## TEMA 1: Seleção de Escopo e Ativação

### US01 - Seleção de Unidade de Negócio e Atividade
**Como um** analista pedagógico ou gestor de sistema,
**Eu quero** poder selecionar a unidade de negócio (ex: Uniasselvi ou Unicesumar) e o tipo de atividade (resenha, prova, etc.)
**Para que** eu possa estabelecer configurações de IA que sejam específicas para cada marca e tipo de avaliação.
- **Relacionado a:** RN01, RN02
- **Critérios de Aceite:**
  - [ ] A interface deve apresentar um campo (dropdown) para selecionar a Unidade de Negócio.
  - [ ] A interface deve apresentar um campo (dropdown) para selecionar o Tipo de Atividade.
  - [ ] A troca de qualquer um desses campos deve limpar ou recarregar as opções de parâmetros abaixo deles.

### US02 - Ativação/Desativação Global
**Como um** analista pedagógico,
**Eu quero** ter um interruptor global (On/Off) por atividade
**Para que** eu possa ligar ou desligar completamente o fluxo de correção por Inteligência Artificial para aquele escopo em um único clique.
- **Relacionado a:** RN03
- **Critérios de Aceite:**
  - [ ] Um controle visual (toggle/switch) deve ser exibido na tela indicando o estado (Ativo/Inativo) da IA.
  - [ ] Se desativado, toda a configuração abaixo não terá efeito prático até que seja religado.

---

## TEMA 2: Gerenciamento de Disciplinas

### US03 - Associação de Disciplinas Avaliadas pela IA
**Como um** analista pedagógico,
**Eu quero** visualizar uma lista de todas as disciplinas daquela atividade e poder marcar (*checkbox*) quais delas utilizarão a correção por IA
**Para que** eu tenha controle granular sobre quais matérias (ex: Matemática vs História) terão o auxílio do modelo e quais não terão.
- **Relacionado a:** RN04, RN05, RN07
- **Critérios de Aceite:**
  - [ ] O sistema lista as disciplinas associadas àquela atividade.
  - [ ] Cada disciplina possui um *checkbox*.
  - [ ] Disciplinas não flegadas são automaticamente desconsideradas pela IA e enviadas para correção 100% manual por tutores (RN07).

### US04 - Seleção em Lote (Selecionar Todas)
**Como um** analista pedagógico,
**Eu quero** um botão para "Selecionar Todas" as disciplinas listadas
**Para que** eu economize tempo operacional ao habilitar a IA para todas as centenas de disciplinas simultaneamente, em vez de clicar uma a uma.
- **Relacionado a:** RN06
- **Critérios de Aceite:**
  - [ ] Deve existir um botão visível ou *checkbox master* no topo da lista.
  - [ ] Clicar no botão deve ativar ou desativar todas as caixas de seleção da lista de disciplinas ativa.

---

## TEMA 3: Regras de Aprovação e Publicação

### US05 - Configuração de Publicação Direta (Gatilho On/Off)
**Como um** coordenador de correção,
**Eu quero** ligar ou desligar o registro automático da nota gerada pela IA direto para o aluno
**Para que** eu possa decidir se as notas serão publicadas sem revisão humana (em cenários de alta confiança) ou não.
- **Relacionado a:** RN08, RN09
- **Critérios de Aceite:**
  - [ ] Deve existir um *switch* "Publicação Automática de Nota (On/Off)".
  - [ ] Se o switch estiver em "Off", nenhuma nota será registrada sem antes passar pela tela de curadoria manual humana, independentemente do percentual de acerto (RN09).

### US06 - Calibragem do Gatilho de Desempenho
**Como um** coordenador de correção,
**Eu quero** definir um valor numérico (percentual) de desempenho mínimo ao ligar o registro automático
**Para que** apenas as provas muito boas ou precisas (ex: acima de 70%) sejam liberadas direto para o aluno, retendo as demais notas para avaliação manual de um tutor.
- **Relacionado a:** RN10, RN11, RN12
- **Critérios de Aceite:**
  - [ ] O campo decimal numérico (%) de "desempenho" só deve ser visível ou habilitado se o switch de **Publicação Direta** estiver ligado (On) (RN10).
  - [ ] A nota só é considerada "registrada" se for $\ge$ (maior ou igual) ao valor parametrizado (RN11).
  - [ ] O campo deve aceitar edição a qualquer momento para permitir ajuste dinâmico da calibragem (RN12).

---

## TEMA 4: Auditoria e Rastreabilidade

### US07 - Painel Visual de Configurações Ativas
**Como um** auditor ou gestor do sistema,
**Eu quero** acessar uma tela contendo todas as parametrizações de IA que estão rodando naquele momento
**Para que** eu possa consultar rapidamente os cenários ativos sem precisar simular os cadastros e saber exatamente quem ligou cada regra.
- **Relacionado a:** RN13, RN14, RN19
- **Critérios de Aceite:**
  - [ ] A tela de auditoria deve ser acessível via menu lateral principal ("Acadêmico" > "Correções por IA") (RN19).
  - [ ] A grade (tabela) deve exibir no mínimo: Nome/tipo da atividade, o código de usuário (identificação) de quem configurou, e a data/hora exata do aceite da regra (RN14).

### US08 - Controle e Filtros na Tabela de Auditoria
**Como um** auditor ou gestor do sistema,
**Eu quero** pesquisar, ordenar (click nas colunas) e paginar os registros dessa lista
**Para que** eu consiga gerenciar o alto volume de configurações, localizando rapidamente quem alterou algo ou filtrando as regras de uma atividade específica.
- **Relacionado a:** RN16, RN17, RN18
- **Critérios de Aceite:**
  - [ ] A tabela deve comportar caixas de pesquisa (Gerais ou por coluna) (RN16).
  - [ ] Os cabeçalhos de coluna devem ser clicáveis invertendo a ordenação ASC/DESC (RN17).
  - [ ] O componente deve ter paginação visível no rodapé limitando os itens expostos (RN18).

### US09 - Desativação Rápida de Segurança
**Como um** auditor ou coordenador do sistema,
**Eu quero** um botão de ação "Desativar" na linha da tabela de auditoria
**Para que** eu anule imediatamente uma regra configurada por engano, travando o uso da IA para aquela atividade reportada.
- **Relacionado a:** RN15
- **Critérios de Aceite:**
  - [ ] Na respectiva linha configurada, deve haver um botão claro de "Inativar" ou "Desativar regra".
  - [ ] Clicar no botão inativará o interruptor global daquela regra (US02 referenciada) e o registro pode sair da aba de ativos ou receber status "cancelado" (dependendo da convenção).
