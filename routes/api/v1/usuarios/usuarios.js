const express = require("express");
const router = express.Router();

const Usuarios = require("../../../../dao/usuarios/usuarios.model");
const usuarioModel = new Usuarios();

router.delete('/delete/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await usuarioModel.deleteOne(id);
        res.status(200).json({
            status: 'ok',
            result
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'failed' });
    }
});



module.exports = router;