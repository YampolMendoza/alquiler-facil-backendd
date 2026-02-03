require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("API Alquiler Fácil Perú funcionando 🚀");
});

// HEALTH CHECK
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});
app.post("/alquileres", async (req, res) => {
  try {
    const {
      tipo,
      distrito,
      direccion,
      piso,
      precio,
      condiciones,
      telefono
    } = req.body;

    const result = await pool.query(
      `INSERT INTO alquileres 
      (tipo, distrito, direccion, piso, precio, condiciones, telefono, fecha)
      VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())
      RETURNING *`,
      [tipo, distrito, direccion, piso, precio, condiciones, telefono]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar alquiler" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
