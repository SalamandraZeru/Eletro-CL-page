# EletroCL — Site Institucional

Site institucional da **EletroCL**, assistência técnica localizada em **Passos/MG**.

O projeto foi pensado para fazer uma coisa simples e importante: apresentar a empresa com clareza, transmitir confiança e facilitar o contato pelo WhatsApp, redes sociais e localização.

A aplicação é propositalmente pequena. Ela usa **HTML, CSS, JavaScript e Vite**, sem backend, banco de dados ou dependências de IA no funcionamento do site. Essa escolha mantém o projeto fácil de entender, rápido de publicar e simples de manter.

---

## Sobre o projeto

Este é um site institucional de uma página (landing page), com navegação por seções e foco em atendimento local.

A página apresenta:

- apresentação da EletroCL;
- serviços de assistência técnica;
- marcas atendidas;
- informações sobre a empresa;
- processo de atendimento;
- estatísticas e depoimentos;
- galeria de imagens;
- endereço e Google Maps;
- WhatsApp para orçamento;
- Instagram e Facebook;
- layout responsivo para celular, tablet e computador;
- animações de interface;
- hero com vídeo em loop;
- SEO básico para buscas locais e compartilhamento;
- página 404;
- headers de segurança para hospedagem no Cloudflare Pages.

A arquitetura foi mantida pequena de propósito. Não há necessidade de criar uma aplicação maior do que o problema exige.

---

## Tecnologias utilizadas

A stack atual é:

- **HTML5** — estrutura e conteúdo;
- **CSS3** — layout, identidade visual, responsividade e animações;
- **JavaScript** — interações e comportamento da página;
- **Vite** — desenvolvimento local e build;
- **Google Fonts** — tipografia;
- **Font Awesome** — ícones;
- **Google Maps** — mapa incorporado;
- **Cloudflare Pages** — plataforma planejada para produção.

O `package.json` atual mantém o Vite como ferramenta principal de build e também possui `ffmpeg-static` listado como dependência. A aplicação da página não faz uso direto de FFmpeg no JavaScript atual; portanto, essa dependência deve ser revisada caso não exista outro processo de build que dependa dela.

---

## Estrutura do projeto

```text
eletro-cl/
├── index.html
├── 404.html                  # Mantido em public/ para entrar no build
├── package.json
├── package-lock.json
├── vite.config.ts
├── .gitignore
├── css/
│   └── style.css
├── js/
│   └── main.js
├── public/
│   ├── 404.html
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _headers
│   └── assets/
│       ├── hero.mp4
│       ├── hero-poster.jpg
│       ├── logo.png
│       ├── fachada-1.webp
│       ├── fachada-2.webp
│       ├── interior.webp
│       └── logos das marcas
├── README.md
└── metadata.json
```

### Sobre `dist/`

O ZIP atualizado ainda contém uma pasta `dist/`, mas ela deve ser tratada como **saída de build**, não como código-fonte.

Ela pode ser recriada executando:

```bash
npm run build
```

No fluxo de desenvolvimento, o ideal é não versionar `dist/` nem `node_modules/`. O `.gitignore` atual já bloqueia os dois.

---

## O que cada parte faz

### `index.html`

É a página principal. Reúne o conteúdo, SEO, dados estruturados, links externos, informações comerciais, serviços, marcas, contato e demais seções.

### `css/style.css`

Concentra a parte visual da aplicação:

- variáveis;
- reset;
- tipografia;
- layout;
- componentes;
- botões;
- navbar;
- seções;
- responsividade;
- animações.

### `js/main.js`

Cuida das interações da página, incluindo:

- menu mobile;
- estado da navbar durante o scroll;
- rolagem suave;
- animações acionadas durante a rolagem;
- contadores;
- carregamento sob demanda de imagens;
- partículas do hero em canvas;
- efeito ripple;
- easter egg via Konami Code.

O arquivo ainda é único porque a aplicação é pequena. Em projetos maiores, faz sentido separar responsabilidades em módulos independentes.

### `public/`

Contém recursos estáticos que precisam ser copiados diretamente para o build, como imagens, vídeo, favicon, sitemap, robots e headers.

### `vite.config.ts`

Configura o comportamento do Vite em desenvolvimento e no build. O arquivo atual também contém ajustes relacionados ao ambiente do AI Studio.

### `metadata.json`

É um arquivo de metadados que veio do ambiente de geração. Ele não participa do funcionamento normal da landing page e pode ser removido em uma etapa futura de limpeza, caso não exista nenhuma integração externa que dependa dele.

---

## Hero e performance

O hero é uma animação e isso faz parte da identidade da página. Por isso, ele não deve ser simplesmente substituído por uma imagem estática.

A versão atual utiliza:

- `hero.mp4` como animação;
- `hero-poster.jpg` como imagem de fallback/carregamento;
- `autoplay`;
- `loop`;
- `muted`;
- `playsinline`.

O vídeo é carregado como elemento principal do hero, enquanto o poster oferece uma imagem pronta para o navegador usar quando necessário.

Essa abordagem reduz o peso em relação ao GIF antigo e mantém a experiência visual pretendida.

---

## JavaScript e comportamento

A aplicação usa JavaScript nativo.

O `main.js` inicializa os principais comportamentos quando o DOM está pronto.

Entre eles:

1. navbar que muda ao rolar;
2. abertura e fechamento do menu mobile;
3. fechamento do menu ao selecionar uma seção;
4. smooth scroll;
5. animações via `IntersectionObserver`;
6. contadores animados;
7. carregamento de imagens sob demanda;
8. partículas em canvas no hero;
9. easter egg.

Não existe necessidade de introduzir um framework apenas para aumentar a complexidade. Caso um próximo projeto tenha necessidade de componentes complexos, estado compartilhado, múltiplas páginas e muitas interações, a escolha de uma arquitetura maior poderá ser avaliada.

---

## SEO

O site possui uma base para SEO local:

- `lang="pt-BR"`;
- title;
- meta description;
- canonical;
- Open Graph;
- JSON-LD;
- `robots.txt`;
- `sitemap.xml`.

O JSON-LD utiliza informações de negócio local, endereço, telefone, horário e links de redes sociais.

Antes da publicação definitiva, os dados comerciais devem ser conferidos com a empresa.

---

## Segurança

A página é estática, então a superfície de ataque é pequena.

O build possui um arquivo `_headers` com políticas como:

- `X-Content-Type-Options`;
- `X-Frame-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `Content-Security-Policy`;
- políticas de cache para assets.

A CSP deve continuar sendo revisada sempre que novos serviços externos forem adicionados.

Cuidados básicos para manutenção:

- não publicar `.env`;
- não colocar senhas ou tokens no repositório;
- revisar links e serviços externos;
- manter dependências atualizadas;
- não versionar `node_modules`;
- não versionar `dist` quando o CI/CD puder gerar o build.

---

## Como executar localmente

### Requisitos

Recomenda-se:

- Node.js 20 ou superior;
- npm;
- Git.

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

O Vite exibirá a URL local no terminal.

### Gerar build de produção

```bash
npm run build
```

A saída será criada em:

```text
dist/
```

### Visualizar o build

```bash
npm run preview
```

---

## Fluxo de publicação

O fluxo esperado é:

```text
Código-fonte
    ↓
npm install
    ↓
npm run build
    ↓
dist/
    ↓
Cloudflare Pages
```

Para integração com GitHub, a configuração prevista é:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

---

## Informações comerciais atuais

### Endereço

`R. do Mercado, 101 - Centro — Passos/MG, 37900-076`

### Telefone

`(35) 3021-8804`

### WhatsApp para orçamento

`(35) 98448-7858`

### Horário

- segunda a sexta: 08:00 às 18:00;
- sábado: 08:00 às 12:00.

### Instagram

`@eletroclpassos`

### Domínio

`https://eletrocl.com.br/`

Esses dados são informações comerciais reais e devem ser confirmados antes da publicação definitiva.

---

## Antes do deploy

### Conteúdo

```text
[ ] Endereço confirmado
[ ] Telefone confirmado
[ ] WhatsApp confirmado
[ ] Horário confirmado
[ ] Estatísticas confirmadas
[ ] Garantia confirmada
[ ] Depoimentos autorizados
[ ] Imagens autorizadas
[ ] Logos e marcas autorizados
```

### Funcionamento

```text
[ ] Menu desktop
[ ] Menu mobile
[ ] Navegação entre seções
[ ] WhatsApp
[ ] Instagram
[ ] Facebook
[ ] Google Maps
[ ] Galeria
[ ] Botões
[ ] Hero animado
[ ] Página 404
```

### Responsividade

Testar pelo menos em:

```text
360 × 800
390 × 844
768 × 1024
1024 × 768
1366 × 768
1440 × 900
```

### Console e rede

```text
[ ] Nenhum erro vermelho no console
[ ] Nenhum 404 de asset
[ ] Nenhuma imagem quebrada
[ ] Nenhum link interno apontando para seção inexistente
[ ] Build concluído sem erro
```

---

## Git

O repositório deve conter código-fonte e configurações, não arquivos gerados ou dependências instaladas.

Antes de publicar:

```bash
git status
git diff --cached
```

Também é recomendável confirmar:

```bash
git check-ignore -v node_modules dist
```

Se os comandos confirmarem que esses diretórios estão ignorados, o repositório fica mais limpo.

---

## Evolução futura

A estrutura atual é suficiente para a proposta do EletroCL.

Não há necessidade de introduzir React, backend, banco de dados ou outras tecnologias apenas para aumentar a complexidade.

Em projetos futuros, a arquitetura pode evoluir conforme o problema:

- site institucional simples → HTML/CSS/JS + Vite;
- site com várias páginas → estrutura modular e componentes reutilizáveis;
- conteúdo administrável → CMS ou API;
- área logada → backend e autenticação;
- aplicação com estado complexo → framework apropriado;
- projetos maiores → testes, lint, CI/CD, observabilidade e documentação de arquitetura.

A regra principal é simples:

> **A arquitetura deve ser proporcional ao problema.**
