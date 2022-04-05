const express = require("express");
const router = express.Router();
let startOfToday = require('date-fns/startOfToday');
let formatISO = require('date-fns/formatISO')
const Publicaciones = require("../../../../dao/publicaciones/publicaciones.model");
const publicacionesModel = new Publicaciones();
const { validateContenido, validateComentario } = require("../../../../helpers/validacion_publicaciones");

router.get("/", (req, res) => {
    res.status(200).json({
        endpoint: "Publicaciones",
        updates: new Date(2022, 0, 19, 18, 41, 0),
    });
});

router.get("/all", async (req, res) => {
    try {
        const rows = await publicacionesModel.getAll();
        res.status(200).json({ status: "ok", publicaciones: rows });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: "failed" });
    }
});

router.get("/allusuario", async (req, res) => {
    try {
        const rows = await publicacionesModel.getAllUser(req.user._id);
        res.status(200).json({ status: "ok", publicaciones: rows })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed" });
    }
})

router.post("/new", async (req, res) => {
    try {
        const { contenido } = req.body;
        let validacion = await validateContenido.validateAsync(contenido)
        console.log(validacion)
        try {
            let destacada = false, likes = 0;
            let fecha = formatISO(startOfToday(), { representation: 'date' })
            rslt = await publicacionesModel.new(
                req.user._id,
                req.user.username,
                contenido,
                fecha,
                destacada,
                likes
            );
            res.status(200).json({
                status: "ok",
                result: rslt,
            });
        } catch (ex) {
            console.error(ex);
            res.status(500).json({
                status: "failed",
                result: {},
            });
        }
    } catch (error) {
        console.log(error)
        res.status(422).json({ status: 'Publicacion no valida' });
    }

});

router.put('/nuevocomentario/:id', async (req, res) => {   
    try {
        const { comentario } = req.body;
        let validacion = await validateComentario.validateAsync(comentario)
        console.log(validacion)
        try {
            const { id } = req.params;
            let result = await publicacionesModel.newComentario(id, req.user._id, comentario)
            res.status(200).json({ status: "ok", result });
        } catch (error) {
            console.log(ex);
            res.status(500).json({ status: 'failed' });
        }
    } catch (error) {
        console.log(ex);
        res.status(500).json({ status: 'failed' });
    }
})

router.put("/actualizardestacada/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const row = await publicacionesModel.getById(id);
        let destacada = !row.destacada;
        const result = await publicacionesModel.updateDestacada(id, destacada);
        res.status(200).json({ status: "ok", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed" });
    }
});

router.put("/actualizarlikes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let likesInDb = await publicacionesModel.getLikes(id);
        console.log(likesInDb)
        let likes = likesInDb + 1;
        console.log(likes)
        await publicacionesModel.addLike(id, likes)
        res.status(200).json({ status: "ok", msg: "Su like fue añadido" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed" });
    }
});

router.delete('/eliminarpublicacion/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await publicacionesModel.deletePublicacion(id);
      res.status(200).json({ status: 'ok', result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'failed' });
    }
  });

  router.get('/byByUsername/:username', async(req, res) => {
    try {
        const { username } = req.params;
        const row = await publicacionesModel.getByUsername(username);
        res.status(200).json({ status: 'ok', publicaciones: row });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'failed' });
    }
});


module.exports = router;