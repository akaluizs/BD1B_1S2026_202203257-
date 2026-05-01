/**
 * Respuesta de éxito
 * @param {string} message - Mensaje de la respuesta
 * @param {any} data - Datos a retornar
 * @returns {Object} Objeto de respuesta formateado
 */
const success = (message, data = null) => ({
  success: true,
  message,
  data,
});

/**
 * Respuesta de error
 * @param {string} message - Mensaje de error
 * @param {any} errors - Detalles del error
 * @returns {Object} Objeto de error formateado
 */
const error = (message, errors = null) => ({
  success: false,
  message,
  errors,
});

module.exports = {
  success,
  error,
};
