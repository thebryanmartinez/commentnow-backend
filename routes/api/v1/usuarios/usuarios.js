const express = require("express");
const router = express.Router();

const Usuarios = require("../../../../dao/usuarios/usuarios.model");
const usuarioModel = new Usuarios();

router.put('/updateEmail/:id', async (req, res) => {
    try{
      const { New_email } = req.body;
      const { id } = req.params;
      const result = await usuarioModel.updateOneEmail(id, New_email);
      res.status(200).json({
        status:'ok',
        result
      });
    } catch(ex){
      console.log(ex);
      res.status(500).json({ status: 'failed' });
    }
  });

router.put('/updateUsername/:id', async (req, res) => {
    try{
      const { username } = req.body;
      const { id } = req.params;
      const result = await usuarioModel.updateOneUsername(id, username);
      res.status(200).json({
        status:'ok',
        result
      });
    } catch(ex){
      console.log(ex);
      res.status(500).json({ status: 'failed' });
    }
  });

module.exports = router;