const express = require("express");
const router = express.Router();
const { verifyApiHeaderToken } = require("./headerVerifyMiddleware");
const { passport, jwtMiddleWare } = require('./seguridad/jwtHelper');
const publicacionesRoutes = require("./publicaciones/publicaciones");
const UsuariosRoutes = require("./usuarios/usuarios");
const seguridadRoutes = require('./seguridad/seguridad');
router.use(passport.initialize())
    //Rutas
    // Public
router.use("/seguridad", verifyApiHeaderToken, seguridadRoutes);
//Middlewares
router.use("/publicaciones", verifyApiHeaderToken, jwtMiddleWare, publicacionesRoutes);
//router.use("/usuarios", usuariosRoutes);
router.use("/usuarios", UsuariosRoutes);
module.exports = router;