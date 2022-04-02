const express = require("express");
const router = express.Router();

const Usuarios = require("../../../../dao/usuarios/usuarios.model");
const { validateEmail, validateUsername } = require("../../../../helpers/validacion_usuarios");
const usuarioModel = new Usuarios();

router.put('/updateemail/:id', async(req, res) => {
    try {
        const { email } = req.body;
        let rslt = await validateEmail.validateAsync(email);
        console.log(rslt)
        try {
            const { id } = req.params;
            const result = await usuarioModel.updateEmail(id, email);
            res.status(200).json({
                status: 'ok',
                result
            });
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ status: 'failed' });
        }
    } catch (ex) {
        console.log(ex)
        res.status(422).json({ status: 'Correo no valido' });

    }
});

router.put('/updateusername/:id', async(req, res) => {
    try {
        const { username } = req.body;
        let rslt = await validateUsername.validateAsync(username)
        console.log(rslt)
        try {
            const { id } = req.params;
            const result = await usuarioModel.updateUsername(id, username);
            res.status(200).json({
                status: 'ok',
                result
            });
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ status: 'failed' });
        }
    } catch (error) {
        console.log(error)
        res.status(422).json({ status: 'Usuario no valido' });
    }
});

router.delete('/deleteuser/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await usuarioModel.deleteUser(id);
        res.status(200).json({
            status: 'ok',
            result
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'failed' });
    }
});

router.get('/byByUsername/:username', async(req, res) => {
    try {
        const { username } = req.params;
        const row = await usuarioModel.getByUsername(username);
        res.status(200).json({ status: 'ok', usuario: row });
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ status: 'failed' });
    }
});


module.exports = router;