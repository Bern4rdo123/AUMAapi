# AUMAapi

## Guia Completo: Upload de Imagens para AWS S3 com Node.js e Express

Este guia detalha todo o processo para configurar um ambiente Node.js que permite o upload e listagem de imagens em um bucket S3 da AWS. Inclui a configuração do código, permissões IAM e manipulação de credenciais.

---

## 1. Pré-requisitos
Antes de começar, é necessário ter:

- Uma conta na AWS
- Um bucket no S3 (chamado `teste-bucket-auma` neste exemplo)
- Node.js instalado na máquina
- Criado um usuário IAM para uploads (`UPLOAD_AUMA`)
- Configurado as permissões corretas no S3 e no IAM

---

## 2. Configuração do AWS S3

### Criando um bucket no S3
1. Acesse o AWS Console.
2. Vá para Amazon S3.
3. Clique em Criar bucket.
4. Defina o nome como `teste-bucket-auma`.
5. Desative a configuração de ACLs e configure as permissões de acesso conforme necessário.
6. Finalize a criação.

### Configuração das Políticas IAM
Criamos um usuário IAM chamado `UPLOAD_AUMA` para manipular o S3.

#### Política de permissões do usuário:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::teste-bucket-auma",
                "arn:aws:s3:::teste-bucket-auma/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "s3:GetBucketLocation"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetBucketAcl",
                "s3:GetBucketPolicy"
            ],
            "Resource": "arn:aws:s3:::teste-bucket-auma"
        }
    ]
}
```
---

## 3. Configuração do Projeto

### Instalando dependências
Execute os seguintes comandos para criar o projeto e instalar as dependências:
```sh
mkdir upload-s3 && cd upload-s3
npm init -y
npm install express multer aws-sdk dotenv cors
```

### Configuração das credenciais AWS
Crie um arquivo `.env` na raiz do projeto e adicione:
```sh
AWS_ACCESS_KEY_ID=SEU_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=SEU_SECRET_ACCESS_KEY
AWS_REGION=us-east-1
AWS_BUCKET_NAME=teste-bucket-auma
```
Substitua `SEU_ACCESS_KEY_ID` e `SEU_SECRET_ACCESS_KEY` pelos valores gerados para o usuário `UPLOAD_AUMA`.

---

## 4. Código do Servidor (`app.js`)

```js
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.static('public'));

// Configuração do AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const upload = multer({ storage: multer.memoryStorage() });
const bucketName = process.env.AWS_BUCKET_NAME;

// Exibir página de upload
tapp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para upload de imagem
app.post('/upload', upload.single('imagem'), async (req, res) => {
    if (!req.file) {
        console.error('Nenhuma imagem enviada.');
        return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    console.log('Arquivo recebido:', req.file);

    const fileKey = `${Date.now()}-${req.file.originalname}`;
    const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        console.log('Iniciando upload para o S3...');
        const data = await s3.upload(params).promise();
        console.log('Upload bem-sucedido:', data.Location);
        res.json({ message: 'Upload realizado com sucesso!', url: data.Location });
    } catch (error) {
        console.error('Erro ao fazer upload para o S3:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para listar imagens do S3
app.get('/imagens', async (req, res) => {
    try {
        console.log('Listando imagens do S3...');
        const params = { Bucket: bucketName };
        const data = await s3.listObjectsV2(params).promise();
        const imageUrls = data.Contents.map(item => `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`);
        console.log('Imagens encontradas:', imageUrls);
        res.json({ imagens: imageUrls });
    } catch (error) {
        console.error('Erro ao listar imagens no S3:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
```

---

## 5. Como Rodar o Projeto

1. Certifique-se de que seu bucket S3 está configurado corretamente.
2. Substitua as credenciais no arquivo `.env`.
3. No terminal, execute o servidor:
   ```sh
   node app.js
   ```
4. Acesse `http://localhost:3000` no navegador.

### Testando Upload via cURL
```sh
curl -X POST -F "imagem=@caminho/para/imagem.jpg" http://localhost:3000/upload
```

### Testando Listagem de Imagens
```sh
curl -X GET http://localhost:3000/imagens
```

---

## Próximos passos

Agora que já é possível realizar o upload diretamente, é necessário realizar a integração com o Mongo e salvar o URL da imagem no banco, bem como uma descrição.

