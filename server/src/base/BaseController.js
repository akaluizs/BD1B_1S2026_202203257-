const { success, error } = require("../utils/responses");
const validators = require("../utils/validators");

class BaseController {
  constructor(repository, entityName, requiredFields = [], customValidation = null) {
    this.repository = repository;
    this.entityName = entityName;
    this.requiredFields = requiredFields;
    this.customValidation = customValidation;
  }

  getAll = async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const data = await this.repository.getAll(
        limit ? parseInt(limit) : null,
        offset ? parseInt(offset) : 0
      );
      res.json(success(`${this.entityName}s obtenidos`, data));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!validators.isValidId(id)) {
        return res.status(400).json(error("ID inválido"));
      }
      const data = await this.repository.getById(parseInt(id));
      if (!data) {
        return res.status(404).json(error(`${this.entityName} no encontrado`));
      }
      res.json(success(`${this.entityName} obtenido`, data));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!validators.hasRequiredFields(data, this.requiredFields)) {
        return res.status(400).json(error(`Campos requeridos: ${this.requiredFields.join(", ")}`));
      }

      if (this.customValidation) {
        const validationResult = await this.customValidation(data, "create");
        if (!validationResult.valid) {
          return res.status(validationResult.status || 400).json(error(validationResult.message));
        }
      }

      const id = await this.repository.create(data);
      res.status(201).json(success(`${this.entityName} creado`, { [this.repository.primaryKey]: id }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!validators.isValidId(id)) {
        return res.status(400).json(error("ID inválido"));
      }

      const existing = await this.repository.getById(parseInt(id));
      if (!existing) {
        return res.status(404).json(error(`${this.entityName} no encontrado`));
      }

      const data = req.body;

      if (this.customValidation) {
        const validationResult = await this.customValidation(data, "update", id);
        if (!validationResult.valid) {
          return res.status(validationResult.status || 400).json(error(validationResult.message));
        }
      }

      await this.repository.update(parseInt(id), data);
      res.json(success(`${this.entityName} actualizado`));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!validators.isValidId(id)) {
        return res.status(400).json(error("ID inválido"));
      }

      const existing = await this.repository.getById(parseInt(id));
      if (!existing) {
        return res.status(404).json(error(`${this.entityName} no encontrado`));
      }

      await this.repository.delete(parseInt(id));
      res.json(success(`${this.entityName} eliminado`));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = BaseController;