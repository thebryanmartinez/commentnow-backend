const express = require("express");
const router = express.Router();
const Usuarios = require('../../../../dao/usuarios/usuarios.model');
const usuariosModel = new Usuarios();
const jwt = require('jsonwebtoken');
const { authSchema } = require ('../../../../helpers/validacion_usuarios');

router.post("/signin", async (req, res) => {
  try {
    let rslt = await authSchema.validateAsync(req.body);
    console.log(rslt);
    try {
      const { email, password } = req.body;
      let rslt = usuariosModel.new(email, password)
      res.status(200).json({ status: 'success', result: rslt })
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'failed' })
    }
  } catch (error) {
    console.error(error)
    res.status(422).json({status: 'Error de validación de datos'});
  }
    
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInDb = await usuariosModel.getByEmail(email);
    if (userInDb) {
      const isPasswordValid = await usuariosModel.comparePassword(password, userInDb.password)
      if (isPasswordValid) {
        const { email, roles, _id } = userInDb;
        const payload = {
          jwt: jwt.sign({ email, roles, _id }, process.env.JWT_SECRET),
          user: { email, password, _id }
        }
        res.status(200).json(payload);
      } else {
        res.status(400).json({ status: 'failed', error: 2 }) //Sus credenciales no son validas
      }
    } else {
      res.status(400).json({ status: 'failed', error: 1 })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'failed' })
  }
});

module.exports = router;