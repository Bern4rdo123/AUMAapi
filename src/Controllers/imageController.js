const path = require('path');
const uploadService = require('../Application/uploadService');

// Rota para exibir a interface de upload e galeria
const getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
};

// Endpoint para upload de imagem
const uploadImage = async (req, res) => {
    if (!req.file) {
        console.error('Nenhuma imagem enviada.');
        return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    try {
        const fileUrl = await uploadService.uploadToS3(req.file);
        res.json({ message: 'Upload realizado com sucesso!', url: fileUrl });
    } catch (error) {
        console.error('Erro ao fazer upload para o S3:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Endpoint para listar imagens no S3
const listImages = async (req, res) => {
    try {
        const imageUrls = await uploadService.listImagesFromS3();
        res.json({ imagens: imageUrls });
    } catch (error) {
        console.error('Erro ao listar imagens no S3:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getIndex,
    uploadImage,
    listImages
};
