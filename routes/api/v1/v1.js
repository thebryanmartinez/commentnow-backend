const express = require("express");
const router = express.Router();
const { verifyApiHeaderToken } = require("./headerVerifyMiddleware");
const publicacionesRoutes = require("./publicaciones/publicaciones");
const usuariosRoutes = require("./usuarios/usuarios");

//Rutas
//Middlewares
router.use("/publicaciones", verifyApiHeaderToken, publicacionesRoutes);
//router.use("/usuarios", usuariosRoutes);

module.exports = router;
