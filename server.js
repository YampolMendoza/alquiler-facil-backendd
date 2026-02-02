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

// CREAR TABLA (solo una vez)
app.get("/init", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alquileres (
        id SERIAL PRIMARY KEY,
        tipo TEXT,
        distrito TEXT,
        direccion TEXT,
        piso TEXT,
        precio INTEGER,
        condiciones TEXT,
        telefono TEXT,
        fecha TEXT
      )
    `);
    res.send("Tabla creada ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creando tabla");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
