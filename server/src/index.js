const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes/index");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de Centros de Evaluación de Manejo - SBD1");
});

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API endpoints disponibles en http://localhost:${PORT}/api/v1/`);
});

module.exports = app;