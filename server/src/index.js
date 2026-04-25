const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import Error Handler
const errorHandler = require("./middleware/errorHandler");

// Import Routes (15 routes)
const departamentoRoutes = require("./routes/departamento.routes");
const tipoLicenciaRoutes = require("./routes/tipoLicencia.routes");
const tipoTramiteRoutes = require("./routes/tipoTramite.routes");
const usuarioSistemaRoutes = require("./routes/usuarioSistema.routes");
const centroEvaluacionRoutes = require("./routes/centroEvaluacion.routes");
const escuelaRoutes = require("./routes/escuela.routes");
const municipioRoutes = require("./routes/municipio.routes");
const personaRoutes = require("./routes/persona.routes");
const evaluacionRoutes = require("./routes/evaluacion.routes");
const evaluacionPracticaRoutes = require("./routes/evaluacionPractica.routes");
const evaluacionTeoricaRoutes = require("./routes/evaluacionTeorica.routes");
const instructorRoutes = require("./routes/instructor.routes");
const preguntaTeoricaRoutes = require("./routes/preguntaTeorica.routes");
const respuestaTeoricaRoutes = require("./routes/respuestaTeorica.routes");
const relation1Routes = require("./routes/relation1.routes");

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
    res.send("API de Centros de Evaluación de Manejo - SBD1");
});

// API Routes - v1
const apiV1 = express.Router();

// Mount all 15 routes
apiV1.use("/departamentos", departamentoRoutes);
apiV1.use("/tipos-licencia", tipoLicenciaRoutes);
apiV1.use("/tipos-tramite", tipoTramiteRoutes);
apiV1.use("/usuarios-sistema", usuarioSistemaRoutes);
apiV1.use("/centros-evaluacion", centroEvaluacionRoutes);
apiV1.use("/escuelas", escuelaRoutes);
apiV1.use("/municipios", municipioRoutes);
apiV1.use("/personas", personaRoutes);
apiV1.use("/evaluaciones", evaluacionRoutes);
apiV1.use("/evaluaciones-practicas", evaluacionPracticaRoutes);
apiV1.use("/evaluaciones-teoricas", evaluacionTeoricaRoutes);
apiV1.use("/instructores", instructorRoutes);
apiV1.use("/preguntas-teoricas", preguntaTeoricaRoutes);
apiV1.use("/respuestas-teoricas", respuestaTeoricaRoutes);
apiV1.use("/relaciones", relation1Routes);

// Mount API v1
app.use("/api/v1", apiV1);

// Error Handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 API endpoints disponibles en http://localhost:${PORT}/api/v1/`);
});
