const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/noticiasDB";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => console.error("Erro de conexão com o MongoDB:", err));
db.once("open", () => console.log("Conectado ao MongoDB!"));

module.exports = db;
