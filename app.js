require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require('./src/Infrastructure/mongodb');
const noticiaRoutes = require('./src/routes/noticiaRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", noticiaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
