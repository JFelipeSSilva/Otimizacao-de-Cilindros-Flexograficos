# Otimização de Cilindros Flexográficos

Página web para gerenciar cilindros de impressão flexográfica e calcular a melhor otimização de repetições com base em altura, largura e quantidade de cores. O cálculo segue o padrão da máquina de flexografia Comcoflex.

## Funcionalidades

- Cadastro de cilindros em estoque com `Z` e quantidade
- Exibição de cilindros ordenados por valor `Z`
- Cálculo de otimização com indicação de `EFICIENTE` ou `INSUFICIENTE/DESPERDÍCIO`
- Mensagem de aviso quando não há cilindros válidos para a quantidade de cores selecionada
- Indicador de estoque vazio que orienta o usuário a cadastrar cilindros
- Layout responsivo com sidebar e resultados adaptados para visualização em dispositivos menores

## Tecnologias

- HTML
- CSS (Tailwind CDN + estilos personalizados em `styles.css`)
- JavaScript (`main.js`)
- Playwright para testes funcionais

## Como usar

1. Abra o arquivo `index.html` no navegador.
2. Na sidebar, adicione cilindros informando `Z` e quantidade em estoque.
3. Preencha os dados da etiqueta: altura, largura e número de cores.
4. Clique em `Calcular Otimização` para ver o resultado.

## Exemplo de uso

Em vez de realizar o cálculo manualmente, use a interface para testar diferentes cilindros e ver o melhor resultado instantaneamente. O sistema avalia cada cilindro disponível, valida a quantidade de cores e ordena os resultados colocando o cilindro mais ideal no topo.

### Exemplo de cálculo manual exaustivo

Quando há muitos cilindros em estoque, a verificação manual se torna demorada e trabalhosa, pois cada cilindro precisa ser realizado o cálculo um a um para encontrar o mais ideal, com menos desperdício. Por isso, a ferramenta automatiza esse processo e identifica rapidamente o cilindro mais eficiente.

Este exemplo segue o padrão de cálculo usado na máquina de flexografia Comcoflex.

Suponha que você tenha um cilindro com `Z = 24`, quantidade suficiente e os dados da etiqueta sejam:

- Altura: `1 mm`
- Largura: `10 mm`
- Cores: `4`

O cálculo passo a passo é:

1. Calcular o diâmetro do cilindro: `24 × 3.175 = 76.2 mm`
2. Determinar o intervalo de repetições possíveis:
   - mínimo: `floor(76.2 / (1 + 3)) = 19`
   - máximo: `ceil(76.2 / (1 + 2)) = 26`
3. Para cada valor de repetições `R` entre 19 e 26, calcular o gap:
   - `gap = (76.2 / R) - 1`
4. Verificar se o gap está entre `2.0 mm` e `3.0 mm`:
   - `R = 19` → gap = `3.01` (`fora do intervalo`)
   - `R = 20` → gap = `2.81` (`EFICIENTE`)
   - `R = 21` → gap = `2.62` (`EFICIENTE`)
   - e assim por diante

Nesse exemplo, o primeiro valor eficiente encontrado é `R = 20` com gap `2.8 mm`. O sistema considera esse tipo de resultado como o mais adequado e o coloca no topo da lista.

## Estrutura do projeto

- `index.html` - página principal e interface do usuário
- `styles.css` - estilos personalizados e paleta de cores do projeto
- `main.js` - lógica de gerenciamento de cilindros, persistência e cálculo
- `tests/functional.spec.js` - testes automatizados com Playwright
- `package.json` - configuração de dependências e script de testes
- `playwright.config.js` - configuração do Playwright

## Testes

Execute os testes com:

```bash
npm install
npm test
```

Os testes cobrem:

- placeholder de estoque vazio
- adição e ordenação de cilindros
- mensagem de aviso quando não existem cilindros válidos
- cálculo de otimização com resultado eficiente

## Observações

- Os cilindros são armazenados no `localStorage` do navegador.
- A página utiliza o Tailwind via CDN e um arquivo CSS externo para as cores e estilos.
