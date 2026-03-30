# Padrão de Design (UI/UX) - Vitru Educação

Este documento estabelece as diretrizes visuais e arquiteturais do front-end com base na referência do sistema de parametrização da Vitru. O projeto segue um padrão estético moderno de "Admin Dashboard", altamente consistente com as diretrizes do **Velzon (Bootstrap 5)**.

## 1. Paleta de Cores
A interface baseia-se em um contraste forte entre elementos de navegação escuros e áreas de conteúdo claras.

| Aplicação | Cor (Hex) | Descrição |
| :--- | :--- | :--- |
| **Primária (Brand)** | `#405189` | Azul Escuro, usado em botões primários e destaques de ações. |
| **Secundária / Destaque** | `#f9c851` | Amarelo/Dourado, usado em ícones de destaque (ex: Estrela do logo) e estado ativo do menu lateral. |
| **Fundo Sidebar** | `#2a2f4a` | Azul Marinho/Slate Escuro para a barra de navegação lateral fixa. |
| **Fundo Principal (Body)** | `#f3f3f9` | Cinza-azulado muito claro, garantindo conforto visual nas áreas de fundo. |
| **Fundo de Cards** | `#ffffff` | Branco puro para os contêineres e formulários brancos de conteúdo. |
| **Fundo de Tabela (Header)**| `#f3f6f9` | Cinza claro sutil para diferenciar o cabeçalho das tabelas. |
| **Sucesso / Ativo** | `#0ab39c` | Verde padrão (Status Ativo). |
| **Perigo / Excluir** | `#f06548` | Vermelho, usado em botões de exclusão e alertas de erro. |
| **Informação / Detalhes**| `#299cdb` | Ciano/Azul Claro, usado para visualização de informações adicionais. |

## 2. Tipografia
- **Font-Family Predominante**: Família sem serifa limpa e moderna (recomendado: **Inter**, **Roboto** ou padrão Bootstrap).
- **Títulos de Página (Headers)**: Fonte seminegrito (semi-bold) em cinza escuro (`#495057`), todas as letras em maiúsculo (Uppercase).
- **Rótulos de Formulário (Labels)**: Fonte seminegrito, posicionada sempre **acima** dos campos de entrada.
- **Cabeçalhos de Tabela**: Texto em negrito (bold).
- **Breadcrumbs (Trilha)**: Texto pequeno em cinza, usando `>` como separador.

## 3. Layout, Espaçamento e Estrutura
- **Sidebar (Esquerda)**: Barra fixa vertical contendo logomarca no topo e a lista de menus. Alta legibilidade de ícones.
- **Topbar (Cabeçalho Superior)**: Barra fixa (sticky) contendo a busca unificada, botão hamburger para *collapse* do menu, e atalhos na direita (perfil, dark mode, tela cheia).
- **Conteúdo (Cards)**: Áreas de conteúdo devem sempre ser renderizadas dentro de *Cards* brancos, com sombras quase imperceptíveis e bordas muito sutis.
- **Espaçamento Central**: Preenchimentos internos da página (paddings) de aproximadamente `1.25rem` (20px) uniformemente distribuídos em seções e cards.
- **Arredondamento**: Borda de raio padrão (border-radius) de `4px` a `6px` para botões, inputs e formulários, conferindo aspecto profissional não tão arredondado.

## 4. Estilos de Componentes

### Botões
- **Botões Primários**: Fundo sólido da cor principal (`#405189`), bordas levemente arredondadas e texto branco.
- **Botões de Açōes em Tabelas**: Estilo "Ghost" (Fundo e borda transparentes), ressaltando apenas a cor do ícone (`Remix Icon` ou semelhante) centralizado. *Ex: Lápis azul para Editar, Lixeira vermelha para Excluir*.
- **Botão Fab / Adicionar**: Botão em formato não intrusivo para `+`, podendo acompanhar cabeçalhos de lista ou flutuante.

### Campos de Formulário
- **Text / Buscas**: Borda padrão cinza claro (`#ced4da`), fundo branco, focos padronizados pelo framework que adicionam brilho à borda. Altura consistente de controles HTML responsivos.
- **Selects / Dropdowns**: Utilização de componentes ricos (ex: `ng-select`) seguindo rigorosamente a mesma altura e raio de borda dos campos de texto (`4px`).

### Tabelas e Listas
- **Visual**: Limpas, minimalistas, sem bordas verticais entre as colunas.
- **Separadores**: Utilizam bordas linha por linha (bottom-border) extremamente sutis no cor cinza claríssimo (`#eff2f7`).
- **Alinhamento**: Conteúdo centralizado verticalmente para leitura harmoniosa.
- **Navegação (Paginação)**: Renderizada padrão na parte inferior direita da tabela, com controle dropdown ao lado permitindo seleção de itens exibidos por página (10, 20, 50, etc).

## 5. Ícones e Detalhes
- Utilização de ícones de linha fina (thin-stroke) e contorno suave, alinhados à família **Remix Icon** ou Material Design. 
- Sem gradientes exagerados ou preenchimentos pesados nas sombras. A direção é uma hierarquia de *flat design* moderno.
