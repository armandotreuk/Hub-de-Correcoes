# Padrão de Design (UI/UX) v5 - Vitru Educação

> **Escopo v5**: Diretrizes visuais aplicadas exclusivamente às abas **Cadastro Prompt** e **Matriz de Configurações**. Mantém a base Velzon (Bootstrap 5) da v4 e adiciona padrões específicos da Matriz.

---

## 1. Paleta de Cores

A interface baseia-se em um contraste forte entre elementos de navegação escuros e áreas de conteúdo claras.

| Aplicação | Cor (Hex) | Descrição |
| :--- | :--- | :--- |
| **Primária (Brand)** | `#405189` | Azul Escuro, usado em botões primários e destaques de ações. |
| **Secundária / Destaque** | `#f9c851` | Amarelo/Dourado, usado em ícones de destaque. |
| **Fundo Sidebar** | `#2a2f4a` | Azul Marinho/Slate Escuro para a barra de navegação lateral fixa. |
| **Fundo Principal (Body)** | `#f3f3f9` | Cinza-azulado muito claro para áreas de fundo. |
| **Fundo de Cards** | `#ffffff` | Branco puro para contêineres de conteúdo. |
| **Fundo de Tabela (Header)**| `#f3f6f9` | Cinza claro sutil para cabeçalho de tabelas. |
| **Sucesso / Ativo** | `#0ab39c` | Verde padrão (Status Ativo, Publicação Ativa). |
| **Perigo / Excluir** | `#f06548` | Vermelho, usado em alertas de erro e tag de Prova. |
| **Informação / Detalhes**| `#299cdb` | Ciano/Azul Claro, usado para tag de Resenha e informações. |
| **Warning** | `#f7b84b` | Amarelo, usado para tag de Avaliação Final. |

---

## 2. Paleta de Cores por Tipo de Atividade (NOVO v5)

Cada tipo de atividade na Matriz de Configurações possui uma tag com **cor de fundo e fonte diferenciada** para identificação visual rápida:

| Tipo de Atividade | Classe CSS | Background | Cor do Texto |
| :--- | :--- | :--- | :--- |
| **Desafio Profissional** | `badge-soft-primary` | `#eef1f7` | `#405189` |
| **Resenha** | `badge-soft-info` | `#d8effb` | `#299cdb` |
| **Fórum** | `badge-soft-success` | `#d1f1eb` | `#0ab39c` |
| **MAPA** | `badge-soft-secondary` | `#f3f3f9` | `#878a99` |
| **Prova** | `badge-soft-danger` | `#fce4e4` | `#f06548` |
| **Avaliação Final** | `badge-soft-warning` | `#fff2e1` | `#f7b84b` |
| **Outros (fallback)** | `badge-soft-dark` | `#e1e1e1` | `#212529` |

---

## 3. Tipografia

- **Font-Family**: Família sem serifa limpa e moderna (Inter, Roboto ou padrão Bootstrap).
- **Títulos de Página**: Fonte seminegrito em cinza escuro (`#495057`), uppercase.
- **Rótulos de Formulário**: Fonte seminegrito, posicionada **acima** dos campos de entrada.
- **Cabeçalhos de Tabela**: Texto em negrito, `0.75rem`, uppercase, letter-spacing `0.025em`.
- **Textos de hierarquia na matriz**: 
  - Linha 1 (Curso): `font-weight: 600`, cor `text-dark`.
  - Linha 2 (Disciplina + Tag): `small text-muted` com tag de atividade colorida.
  - Linha 3 (Unidade | Cluster): `x-small` (0.7rem), uppercase, `text-muted`.

---

## 4. Layout e Estrutura

### 4.1 Geral
- **Sidebar (Esquerda)**: Barra fixa vertical com logomarca e menus.
- **Topbar**: Barra sticky com busca unificada, hamburger e atalhos.
- **Cards**: Áreas de conteúdo em cards brancos com sombras quase imperceptíveis.
- **Espaçamento**: Paddings de `1.25rem` (20px).
- **Arredondamento**: `border-radius: 4px` a `6px`.

### 4.2 Painel de Filtros (Matriz)
- **Container**: `bg-light`, `padding: 1rem`, `border-radius: 4px`, `border: 1px solid`, `shadow-sm`.
- **Duas linhas** de filtros com espaçamento `g-3` e `mb-3` entre linhas.
- **Linha 1** (5 filtros, `col-md-2` a `col-md-3`): Atividade, Unidade, Cluster, Curso, Disciplina.
- **Linha 2** (3 filtros + botão, `col-md-3`): Prompt, Status IA, Publicação, Botão Pesquisar.

### 4.3 Barra de Ações em Massa (Matriz)
- **Container**: `bg-soft-primary` (`#eef1f7`), `border-primary-subtle`, `border-radius: 4px`, `padding: 8px`.
- **Texto dinâmico**: "Ações em massa para todos os X resultados filtrados" ou "Y selecionados".
- **Botões**: `btn btn-sm btn-white border` com ícones Remix Icon.

### 4.4 Side Drawer (Parametrização Individual)
- **Largura**: 400px fixo, desliza da direita.
- **Overlay**: `rgba(0, 0, 0, 0.4)`.
- **Transição**: `right 0.3s ease-in-out`.
- **Header**: `bg-light`, `border-bottom`, com título e **único** botão de fechar (`btn-close` nativo Bootstrap).
- **Body**: Overflow-y auto, formulário com etapas numeradas (1. Prompt, 2. Correção, 3. Publicação).

---

## 5. Estilos de Componentes

### 5.1 Botões
- **Primários**: Fundo sólido `#405189`, bordas arredondadas, texto branco.
- **Ghost**: Fundo e borda transparentes, cor do ícone como destaque.
- **Botões de Massa**: `btn-sm btn-white border`, agrupados na barra de ações.
- **Botão Pesquisar**: `btn btn-primary w-100`, posicionado ao final da linha de filtros.

### 5.2 Campos de Formulário
- **Inputs/Selects**: Borda padrão `#ced4da`, fundo branco, `border-radius: 4px`.
- **MultiSelect Dropdown**: Componente customizado com busca por digitação e checkboxes.

### 5.3 Tabelas
- **Visual**: Limpas, minimalistas, sem bordas verticais.
- **Separadores**: `border-bottom` sutil em `#eff2f7`.
- **Hover**: Cor de fundo `table-hover` para feedback visual.
- **Linhas selecionadas**: Classe `table-active`.
- **Alinhamento**: Conteúdo centralizado verticalmente (`vertical-align: middle`).

### 5.4 Paginação
- **Footer**: `border-top`, `padding-top: 1rem`, layout `justify-content-between`.
- **Esquerda**: Seletor "Exibindo X por página" com `<select>` de 10/25/50/100.
- **Direita**: "Página X de Y" + botões `btn-sm btn-light` com ícones `ri-arrow-left-s-line` / `ri-arrow-right-s-line`.

### 5.5 SweetAlerts
- **Cor de confirmação**: `#405189` (brand primary).
- **Cor de cancelamento**: `#f06548` (danger).
- **Loading**: Sem botão de fechar, texto "Aguarde...".
- **Informativo (Regras)**: Ícone `info`, sem botão Cancelar, botão "OK".
- **Formulário (Publicação em Massa)**: HTML customizado com inputs e labels, validação inline via `preConfirm`.

---

## 6. Ícones

- Família: **Remix Icon** (thin-stroke, contorno suave).
- Sem gradientes exagerados ou preenchimentos pesados.
- Ícones utilizados na Matriz:
  - `ri-table-alt-line`: Título da Matriz.
  - `ri-search-line`: Botão Pesquisar.
  - `ri-checkbox-multiple-line`: Indicador de seleção na barra de ações.
  - `ri-links-line`: Vincular Prompt.
  - `ri-flashlight-line`: Ativar Correção.
  - `ri-notification-badge-line`: Configurar Publicação.
  - `ri-file-code-line`: Prompt vinculado.
  - `ri-alert-line`: Prompt não vinculado.
  - `ri-settings-line`: Parametrização individual.
  - `ri-equalizer-line`: Drawer de parametrização.
  - `ri-information-line`: Botão Ver Regras.
  - `ri-arrow-left-s-line` / `ri-arrow-right-s-line`: Paginação.
