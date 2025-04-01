const express = require("express");
const multer = require("multer");
const noticiaController = require('../Controllers/noticiaController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/noticias", upload.single("imagem"), noticiaController.criarNoticia);
router.get("/noticias", noticiaController.listarNoticias);

module.exports = router;