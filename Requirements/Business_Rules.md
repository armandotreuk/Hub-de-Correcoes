# Regras de Negócio: RF001 - Parametrização da Correção por IA

Com base no documento de Especificação de Requisitos, abaixo estão as regras de negócio mapeadas exclusivamente para a funcionalidade de **Parametrização do Processo de Correção (RF001)**:

### 1. Seleção de Escopo e Ativação
- **RN01 - Unidade de Negócio**: A parametrização deve ser feita de forma independente por Unidade de Negócio (ex: Uniasselvi ou Unicesumar).
- **RN02 - Tipo de Atividade**: Os parâmetros devem ser configurados e salvos especificamente para o *Tipo de Atividade* selecionado (ex: Desafio Profissional, Resenha, Prova, MAPA).
- **RN03 - Ativação Global (On/Off)**: O sistema deve possuir um interruptor geral que liga (on) ou desliga (off) todo o fluxo de IA para a atividade selecionada naquela unidade de negócio.

### 2. Associação de Disciplinas
- **RN04 - Listagem de Disciplinas**: O sistema deve retornar e listar todas as disciplinas associadas àquela atividade.
- **RN05 - Flegar/Selecionar Disciplinas**: Deve ser possível marcar (check) individualmente quais disciplinas da lista passarão pelo fluxo de correção por IA.
- **RN06 - Ação em Lote**: Devido ao grande volume, deve haver obrigatoriamente um botão/ação de "Selecionar Todas" (Flegar todas) as disciplinas listadas.
- **RN07 - Exceção Manual**: Qualquer disciplina que *não* for marcada na parametrização terá suas avaliações direcionadas obrigatoriamente para a fila de **correção manual**.

### 3. Registro Automático de Notas e Curadoria
- **RN08 - Atualização Direta de Nota (On/Off)**: O sistema deve permitir configurar se as correções/notas aprovadas pela IA serão publicadas direto para o aluno (sem intervenção humana).
- **RN09 - Obrigatoriedade de Curadoria (Off)**: Caso a atualização direta esteja desativada (Off), **todas** as notas geradas pela IA deverão passar por validação manual humana antes de irem para o histórico do aluno.
- **RN10 - Gatilho de Desempenho (On)**: Ao ativar (On) a atualização direta de nota, o sistema deve **obrigatoriamente abrir um campo** para inserir o "% de desempenho do estudante".
- **RN11 - Regra do Gatilho de Desempenho (Corte)**: 
- Submissões avaliadas pela IA cujo desempenho ($\%$) fique **igual ou acima** do referencial configurado terão a nota registrada e fechada automaticamente.
  - Submissões avaliadas pela IA cujo desempenho fique **abaixo** do referencial configurado (ex: valor estipulado 70%, aluno tira 69%) ficarão logicamente **"retidas"** em status de curadoria manual.
- **RN12 - Ajuste Dinâmico**: O valor percentual de desempenho não é estático. Ele pode e deve ser ajustado/calibrado via painel pela equipe pedagógica conforme a evolução do modelo de IA.

### 4. Auditoria e Gestão de Configurações
- **RN13 - Painel de Auditoria**: O sistema deve possuir uma tela ou aba de auditoria listando todas as configurações atualmente ativas no momento.
- **RN14 - Dados de Auditoria**: A lista deve exibir, no mínimo, as seguintes informações por configuração:
  - Os parâmetros da configuração (Atividade, Disciplinas, etc).
  - O código/identificação do usuário que ativou a configuração.
  - A data exata em que a configuração foi ativada.
- **RN15 - Desativação Rápida**: Cada registro ativo na lista de auditoria deve conter um botão explícito para "Desativar" a configuração imediatamente.
- **RN16 - Filtros e Pesquisa**: A lista deve oferecer pesquisa e filtros em **todas** as colunas disponíveis para facilitar a localização de parâmetros específicos.
- **RN17 - Ordenação**: O usuário deve conseguir ordenar a lista de registros clicando nas colunas (crescente/decrescente).
- **RN18 - Paginação**: A lista de resultados deve ser paginada, garantindo performance e boa usabilidade em casos de alto volume de configurações ativas.

### 5. Navegação e Acesso
- **RN19 - Acesso via Menu**: A funcionalidade de parametrização e auditoria deverá ser acessada através do sistema de navegação principal da aplicação. Um link intitulado "**Correções por IA**" deve estar localizado como um submenu dentro da seção principal("**Acadêmico**").
