const noticiaService = require("../Application/noticiaService");
const uploadService = require("../Application/uploadService");

const criarNoticia = async (req, res) => {
    if (!req.file || !req.body.titulo || !req.body.descricao || !req.body.texto) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
        const imagemUrl = await uploadService.uploadToS3(req.file);
        const noticia = await noticiaService.criarNoticia(req.body.titulo, req.body.texto, imagemUrl ,req.body.descricao);
        res.status(201).json(noticia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listarNoticias = async (req, res) => {
    try {
        const noticias = await noticiaService.listarNoticias();
        res.json(noticias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { criarNoticia, listarNoticias };
