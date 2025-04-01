# Documentação da API - AUMA API

## Visão Geral
A **AUMA API** permite o gerenciamento de notícias, incluindo o upload de imagens para o AWS S3 e o armazenamento de metadados no MongoDB.

### Tecnologias Utilizadas:
- **Node.js** com **Express**
- **MongoDB** via **Mongoose**
- **AWS S3** para armazenar imagens
- **Multer** para manipulação de arquivos

## Configuração Inicial
Antes de rodar a API, configure as variáveis de ambiente em um arquivo `.env`:

```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/noticiasDB
AWS_ACCESS_KEY_ID=SEU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=SEU_SECRET_KEY
AWS_BUCKET_NAME=SEU_BUCKET
AWS_REGION=SEU_BUCKET_REGION
```

Instale as dependências:
```sh
npm install
```

Para iniciar o servidor:
```sh
npm start
```

## Endpoints

### **1. Upload de Imagem e Criação de Notícia**
**Rota:** `POST /api/noticias`

**Descrição:** Faz upload de uma imagem para o AWS S3 e cria uma nova notícia com título, descrição e texto.

**Parâmetros:**
- `titulo` (string, obrigatório)
- `descricao` (string, obrigatório)
- `texto` (string, obrigatório)
- `imagem` (arquivo, obrigatório)

**Exemplo de Requisição no Postman:**
- **Tipo:** `multipart/form-data`
- **Body:**
  - `titulo`: "Notícia Importante"
  - `descricao`: "Resumo da Notícia"
  - `texto`: "Conteúdo completo da notícia"
  - `imagem`: Upload de arquivo (JPG/PNG)

**Exemplo de Resposta:**
```json
{
  "_id": "660d1b2f9a7a6c001f0d5678",
  "titulo": "Notícia Importante",
  "texto": "Conteúdo completo da notícia",
  "imagemUrl": "https://seubucket.s3.region.amazonaws.com/imagem.jpg",
  "descricao": "Resumo da Notícia",
  "dataPublicacao": "2024-04-01T12:00:00.000Z"
}
```

### **2. Listar Todas as Notícias**
**Rota:** `GET /api/noticias`

**Descrição:** Retorna uma lista de todas as notícias armazenadas no banco.

**Resposta de Exemplo:**
```json
[
  {
    "_id": "660d1b2f9a7a6c001f0d5678",
    "titulo": "Notícia Importante",
    "texto": "Conteúdo completo da notícia",
    "imagemUrl": "https://seubucket.s3.region.amazonaws.com/imagem.jpg",
    "descricao": "Resumo da Notícia",
    "dataPublicacao": "2024-04-01T12:00:00.000Z"
  }
]
```

### **3. Listar Imagens no S3**
**Rota:** `GET /api/imagens`

**Descrição:** Retorna a lista de URLs das imagens armazenadas no AWS S3.

**Exemplo de Resposta:**
```json
{
  "imagens": [
    "https://seubucket.s3.region.amazonaws.com/imagem1.jpg",
    "https://seubucket.s3.region.amazonaws.com/imagem2.jpg"
  ]
}
```


