# API de busca de ferramentas de IA

API REST que pesquisa um catálogo de ferramentas de IA em português, inglês e
espanhol. Os documentos vêm do MongoDB e são ranqueados pelo **Atlas Search**,
sem carregar o catálogo para a memória do processo.

![Node](https://img.shields.io/badge/Node-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-F05138?style=flat-square)

Demo: [ia-back-nu.vercel.app](https://ia-back-nu.vercel.app)

> **Contexto.** Projeto de estudo — não está em produção. O catálogo é real (coletado do
> FutureTools pelo [ai-crawler](https://github.com/loyfus/ai-crawler)); o foco aqui é a
> camada de busca, o ranqueamento e a superfície HTTP.

## O problema

Catálogo de ferramenta de IA está espalhado: cada site tem busca própria, quase
nenhum tem busca em português, e o resultado muda conforme o dia. Guardar tudo em
um banco e deixar o MongoDB ranquear tira a busca do caminho crítico — a API
responde em *top K* sem varrer a coleção.

Quem popula esse banco é o [ai-crawler](https://github.com/loyfus/ai-crawler),
que raspa o FutureTools e traduz cada descrição para os três idiomas.

## O que faz

- Busca full-text com ranqueamento do Atlas Search
- Traduções em pt, en e es no mesmo documento, buscáveis juntas
- Paginação com contagem total, para o cliente saber quantas páginas existem
- Filtro por categoria
- Rate limit e *slow down* progressivo para segurar abuso

## Decisões

**O Atlas Search ranqueia, o TF-IDF não.** A primeira versão carregava todas as
descrições e calculava similaridade em memória. Com o catálogo crescendo, isso
virou o gargalo. `$search` com `compound` devolve só o que casa, com
`searchMeta` como score, e o *pipeline* inteiro roda no índice.

**O boost no nome é explícito.** O `compound` dá peso 3 ao campo `name` e peso 1
às três descrições: quem busca `cursor` quer a ferramenta que se chama Cursor,
não a que menciona Cursor na descrição.

**`$facet` na mesma volta.** Total e página saem de uma agregação só. Contar em
uma segunda consulta dobrava o custo sem trazer informação nova.

**O logo fica fora da resposta de busca.** `logoBase64` é o campo mais pesado do
documento e vinha em base64 dentro do JSON de cada resultado, o que esticava a
resposta. Virou campo opcional, consultado no detalhe.

## Arquitetura

```
src/
├── config/       porta, conexão e parâmetros de busca (validados uma vez)
├── routes/       uma rota por arquivo, só declara o caminho
├── controllers/  lê query, chama serviço, monta resposta
├── services/     o pipeline de agregação do Atlas Search
├── repository/   acesso ao banco — a única camada que fala mongoose
└── app.js        middlewares de segurança e montagem
```

A separação não é enfeite: o `searchService` não sabe de HTTP e o controller não
sabe de `aggregation`. Trocar o Atlas Search por outra estratégia mexe em um
arquivo só.

## Rodar

```bash
npm install
npm run dev
```

A porta vem de `PORT` (padrão `3000`).

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Para quê |
| --- | --- | --- | --- |
| `MONGODB_URI` | sim | — | String de conexão |
| `MONGODB_DB_NAME` | não | — | Banco de dados |
| `PORT` | não | `3000` | Porta do servidor |
| `ATLAS_INDEX_NAME` | não | `Loyfus-vector` | Índice do Atlas Search |
| `TFIDF_TOP_K` | não | `5` | Tamanho padrão da página |

## API

### `GET /search`

Parâmetros: `q` (obrigatório), `page` (padrão `1`), `pageSize` (padrão `TFIDF_TOP_K`).

```json
{
  "query": "cursor",
  "page": 1,
  "pageSize": 5,
  "total": 42,
  "results": [
    {
      "slug": "cursor",
      "name": "Cursor",
      "description_pt": "Editor de código com IA...",
      "description_en": "AI code editor...",
      "description_es": "Editor de código con IA...",
      "score": 12.31
    }
  ]
}
```

### `GET /tools`

Lista tudo paginado. Aceita `page` e `pageSize` (padrão `20`, máximo `50`).

### `GET /tools/:slug`

Detalhe de uma ferramenta.

### `GET /categories` e `GET /categories/tools`

Lista as categorias, e as ferramentas de uma categoria.

## Segurança

`helmet` para cabeçalhos, `express-mongo-sanitize` e `hpp` contra injeção em
query string, `xss-clean` na resposta, `compression`, limite de corpo em 10 kB,
e rate limit de 60 requisições por 15 minutos por IP — com *slow down* a partir
da 30ª, que degrada antes de cortar.

## Stack

| | |
| --- | --- |
| Runtime | Node 18+ · CommonJS |
| Framework | Express 4 |
| Banco | MongoDB Atlas · Atlas Search |
| ODM | Mongoose 7 |
| Deploy | Vercel (serverless) |

## Licença

MIT — [LICENSE](LICENSE).
