const Noticia = require('../models/noticia');

const criarNoticia = async (titulo, texto, imagemUrl, descricao) => {
    try {
        const noticia = new Noticia({ titulo, texto, imagemUrl, descricao });
        await noticia.save();
        return noticia;
    } catch (error) {
        throw new Error("Erro ao criar notícia: " + error.message);
    }
};

const listarNoticias = async () => {
    try {
        return await Noticia.find().sort({ dataPublicacao: -1 });
    } catch (error) {
        throw new Error("Erro ao listar notícias: " + error.message);
    }
};

module.exports = { criarNoticia, listarNoticias };
