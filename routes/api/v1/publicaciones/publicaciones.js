const express = require("express");
const router = express.Router();

const Publicaciones = require("../../../../dao/publicaciones/publicaciones.model");
const publicacionModel = new Publicaciones();

router.get("/", (req, res) => {
    res.status(200).json({
        endpoint: "Publicaciones",
        updates: new Date(2022, 0, 19, 18, 41, 0),
    });
}); //GET /

router.get("/all", async(req, res) => {
    try {
        const rows = await publicacionModel.getAll();
        res.status(200).json({ status: "ok", publicaciones: rows });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: "failed" });
    }
});



router.post("/new", async(req, res) => {
    let destacada = 0,
        likes = 0;
    const { contenido, fecha } = req.body;
    try {
        rslt = await publicacionModel.new(
            req.user._id,
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
}); //POST /new



router.delete("/delete/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const result = await publicacionModel.deleteOne(id);
        res.status(200).json({ status: "ok", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed" });
    }
});

router.put("/actualizarDestacada/:id", async(req, res) => {
    try {
        let destacada;
        const { id } = req.params;
        const row = await publicacionModel.getById(id);
        if (row.destacada) {
            destacada = 0;
        } else {
            destacada = 1;
        }
        const result = await publicacionModel.updateOne(
            id,
            destacada
        );
        res.status(200).json({ status: "ok", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed" });
    }
});

//get likes
router.put("/actualizarLikes/:id", async(req, res) => {
    try {
        let likes;
        const { id } = req.params;
        const row = await publicacionModel.getById(id);
        if (row.likes) {
            likes = likes++;
        }
        const result = await publicacionModel.updateOne(
            id,
            likes
        );
        res.status(200).json({ status: "ok", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed" });
    }
});


module.exports = router;