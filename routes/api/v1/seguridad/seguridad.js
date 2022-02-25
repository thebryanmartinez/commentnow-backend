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
      const { names, username, email, description, birthdate, password } = req.body;
      let rslt = usuariosModel.new(names, username, email, description, birthdate, password)
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
    const { username, password } = req.body;
    const userInDb = await usuariosModel.getByUsername(username);
    if (userInDb) {
      const isPasswordValid = await usuariosModel.comparePassword(password, userInDb.password)
      if (isPasswordValid) {
        const { username, roles, _id } = userInDb;
        const payload = {
          jwt: jwt.sign({ username, roles, _id }, process.env.JWT_SECRET),
          user: { username, password, _id }
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