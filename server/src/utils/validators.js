/**
 * Validadores para campos comunes
 */

const validators = {
  /**
   * Validar ID (número entero positivo)
   */
  isValidId: (id) => {
    const num = parseInt(id);
    return !isNaN(num) && num > 0;
  },

  /**
   * Validar que un campo no sea vacío
   */
  isNotEmpty: (value) => {
    return value !== undefined && value !== null && value !== "";
  },

  /**
   * Validar que un objeto tenga campos requeridos
   */
  hasRequiredFields: (obj, requiredFields) => {
    return requiredFields.every((field) => validators.isNotEmpty(obj[field]));
  },

  /**
   * Validar formato de identificación (cédula, pasaporte, etc)
   */
  isValidIdentification: (id) => {
    return id && id.toString().trim().length > 0;
  },

  /**
   * Validar teléfono
   */
  isValidPhone: (phone) => {
    return /^[0-9\-\+\s\(\)]{7,20}$/.test(phone);
  },

  /**
   * Validar género (M, F, O)
   */
  isValidGender: (gender) => {
    return ["M", "F", "O"].includes(gender?.toUpperCase());
  },

  /**
   * Validar fecha (formato YYYY-MM-DD)
   */
  isValidDate: (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date));
  },

   /**
    * Validar nombre (no vacío, mínimo 2 caracteres, permite letras, números, espacios y caracteres comunes)
    */
   isValidName: (name) => {
     return /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\(\)\-\.\']{2,}$/.test(name);
   },

  /**
   * Validar dirección
   */
  isValidAddress: (address) => {
    return address && address.toString().trim().length >= 5;
  },

  /**
   * Validar número de autorización
   */
  isValidAuthNumber: (number) => {
    return number && number.toString().trim().length > 0;
  },

  /**
   * Validar descripción
   */
  isValidDescription: (description) => {
    return description && description.toString().trim().length > 0;
  },

  /**
   * Validar letra (Tipo_Licencia)
   */
  isValidLicenseLetter: (letter) => {
    return /^[A-Z]$/.test(letter);
  },

  /**
   * Validar puntaje (0-100)
   */
  isValidScore: (score) => {
    const num = parseInt(score);
    return !isNaN(num) && num >= 0 && num <= 100;
  },

  /**
   * Validar si es correcto (Y/N)
   */
  isValidCorrect: (value) => {
    return ["Y", "N"].includes(value?.toUpperCase());
  },
};

module.exports = validators;
