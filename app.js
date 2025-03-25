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

// Rota para exibir a interface de upload e galeria
app.get('/', (req, res) => {
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
        ContentType: req.file.mimetype,
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

// Endpoint para listar imagens no S3
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

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
