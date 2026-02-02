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

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      time: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});