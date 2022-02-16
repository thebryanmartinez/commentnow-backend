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

router.get("/all", async (req, res) => {
  try {
    const rows = await pacienteModel.getAll();
    res.status(200).json({ status: "ok", pacientes: rows });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.get("/byid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const row = await pacienteModel.getById(id);
    res.status(200).json({ status: "ok", pacientes: row });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.post("/new", async (req, res) => {
  const { nombres, apellidos, identidad, email, telefono } = req.body;
  try {
    rslt = await pacienteModel.new(
      nombres,
      apellidos,
      identidad,
      telefono,
      email
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

router.put("/update/:id", async (req, res) => {
  try {
    const { nombres, apellidos, identidad, email, telefono } = req.body;
    const { id } = req.params;
    const result = await pacienteModel.updateOne(
      id,
      nombres,
      apellidos,
      identidad,
      email,
      telefono
    );
    res.status(200).json({ status: "ok", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pacienteModel.deleteOne(id);
    res.status(200).json({ status: "ok", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

module.exports = router;
