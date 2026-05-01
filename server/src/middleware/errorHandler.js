const { error } = require("../utils/responses");

/**
 * Middleware para manejo centralizado de errores
 * @param {Error} err - Error capturado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Siguiente middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Error de validación
  if (err.statusCode === 400) {
    return res.status(400).json(error(err.message, err.details));
  }

  // Registro no encontrado
  if (err.statusCode === 404) {
    return res.status(404).json(error(err.message));
  }

  // Error de base de datos
  if (err.code === "ORA") {
    const errorMap = {
      1: "Error en la base de datos",
      1400: "Campo requerido no especificado",
      2291: "Restricción de integridad referencial violada",
      2292: "Hay registros relacionados que no permiten borrar",
    };

    const message = errorMap[err.code] || err.message;
    return res.status(409).json(error(message, { code: err.code }));
  }

  // Error genérico
  res.status(500).json(error("Error interno del servidor", { details: err.message }));
};

module.exports = errorHandler;
