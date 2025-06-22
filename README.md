# Loyfus API

This project is a simple Express API used for searching AI tools. It exposes endpoints to query tools stored in MongoDB Atlas and uses an Atlas Search index to rank results.

## Getting Started

Install dependencies and run in development mode:

```bash
npm install
npm run dev
```

The server will start on the port defined by the `PORT` environment variable (default `3000`).

## Environment Variables

- `PORT` – server port (default `3000`)
- `MONGODB_URI` – MongoDB connection string
- `MONGODB_DB_NAME` – database name
- `TFIDF_TOP_K` – default number of search results returned
- `ATLAS_INDEX_NAME` – name of the Atlas Search index

## API Routes

### `GET /api/search`

Searches the tools collection using MongoDB Atlas Search.

**Query Parameters**

- `q` (required) – search term
- `page` – result page number (default `1`)
- `pageSize` – number of results per page (defaults to `TFIDF_TOP_K`)

**Response**

Returns a JSON object containing the executed query, pagination data and a list of tool results ordered by relevance.

```json
{
  "query": "example",
  "page": 1,
  "pageSize": 5,
  "results": [
    {
      "slug": "tool-slug",
      "name": "Tool Name",
      "logoBase64": "...",
      "score": 1.23
    }
  ]
}
```


