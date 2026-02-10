require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ======================
   TEST / HEALTH
====================== */
app.get("/", (req, res) => {
  res.send("API Alquiler Fácil Perú funcionando 🚀");
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

/* ======================
   CREAR ALQUILER
====================== */
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

/* ======================
   LISTAR / BUSCAR ALQUILERES (CON FILTROS)
====================== */
app.get("/alquileres", async (req, res) => {
  try {
    const { distrito, tipo, minPrecio, maxPrecio } = req.query;

    let query = "SELECT * FROM alquileres WHERE 1=1";
    const values = [];

    if (distrito) {
      values.push(`%${distrito}%`);
      query += ` AND LOWER(distrito) LIKE LOWER($${values.length})`;
    }

    if (tipo) {
      values.push(tipo);
      query += ` AND tipo = $${values.length}`;
    }

    if (minPrecio) {
      values.push(minPrecio);
      query += ` AND precio >= $${values.length}`;
    }

    if (maxPrecio) {
      values.push(maxPrecio);
      query += ` AND precio <= $${values.length}`;
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener alquileres" });
  }
});

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
