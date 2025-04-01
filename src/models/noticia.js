const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    texto: {type: String, required: true},
    imagemUrl: { type: String, required: true },
    descricao: { type: String, required: true },
    dataPublicacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Noticia", noticiaSchema);
