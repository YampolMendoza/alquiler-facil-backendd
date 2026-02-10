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

// 👉 CREAR ALQUILER
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

// 👉 LISTAR ALQUILERES (ESTE FALTABA 🔥)
app.get("/alquileres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM alquileres ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener alquileres" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
// OBTENER ALQUILERES
app.get("/alquileres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM alquileres ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener alquileres" });
  }
});
app.get("/alquileres", async (req, res) => {
  try {
    const { distrito, tipo, minPrecio, maxPrecio } = req.query;

    let query = "SELECT * FROM alquileres WHERE 1=1";
    let values = [];
    let i = 1;

    if (distrito) {
      query += ` AND distrito ILIKE $${i}`;
      values.push(`%${distrito}%`);
      i++;
    }

    if (tipo) {
      query += ` AND tipo = $${i}`;
      values.push(tipo);
      i++;
    }

    if (minPrecio) {
      query += ` AND precio >= $${i}`;
      values.push(minPrecio);
      i++;
    }

    if (maxPrecio) {
      query += ` AND precio <= $${i}`;
      values.push(maxPrecio);
      i++;
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar alquileres" });
  }
});