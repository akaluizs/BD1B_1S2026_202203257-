const express = require("express");
const router = express.Router();
const BaseRepository = require("../base/BaseRepository");
const BaseController = require("../base/BaseController");
const { ENTITIES } = require("../config/entities");
const { promediosPunteos, rankingEvaluados, analisisDificultadPreguntas } = require("../queries/statisticalQueries");
const { success, error } = require("../utils/responses");
const validators = require("../utils/validators");

router.get("/", (req, res) => {
  const endpoints = Object.values(ENTITIES).map((config) => ({
    resource: config.tableName,
    path: `/api/v1${config.routesPath}`,
    methods: config.isJoinTable
      ? ["GET", "POST", "DELETE"]
      : ["GET", "GET/:id", "POST", "PUT", "DELETE"],
  }));

  const estadisticas = [
    { name: "Promedios de Punteos", path: "/api/v1/estadisticas/promedios", methods: ["GET"] },
    { name: "Ranking de Evaluados", path: "/api/v1/estadisticas/ranking-evaluados", methods: ["GET"] },
    { name: "Análisis de Dificultad", path: "/api/v1/estadisticas/dificultad-preguntas", methods: ["GET"] },
  ];

  res.json(success("API de Centros de Evaluación de Manejo", { endpoints, estadisticas }));
});

const repositories = {};
const controllers = {};

for (const [key, config] of Object.entries(ENTITIES)) {
  repositories[key] = new BaseRepository(
    config.tableName,
    config.primaryKey,
    config.columns,
    config.foreignKeys
  );

  const entityDisplayName = config.tableName
    .replace(/_([a-z])/g, (_, l) => " " + l.toUpperCase())
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  controllers[key] = new BaseController(
    repositories[key],
    entityDisplayName,
    config.requiredFields,
    null
  );
}

for (const [key, config] of Object.entries(ENTITIES)) {
  const ctrl = controllers[key];
  const path = config.routesPath;

  if (config.isJoinTable) {
    router.get(`${path}`, async (req, res, next) => {
      try {
        const database = require("../services/database.service");
        const query = `SELECT * FROM ${config.tableName}`;
        const result = await database.execute(query);
        res.json(success(`${config.tableName}s obtenidos`, result.rows || []));
      } catch (err) {
        next(err);
      }
    });

    router.post(`${path}`, async (req, res, next) => {
      try {
        const database = require("../services/database.service");
        const data = req.body;

        if (Array.isArray(data)) {
          const results = [];
          for (const item of data) {
            const cols = config.columns.join(", ");
            const vals = config.columns.map((col) => `:${col}`).join(", ");
            const query = `INSERT INTO ${config.tableName} (${cols}) VALUES (${vals})`;
            const bindParams = {};
            config.columns.forEach((col) => {
              bindParams[col] = item[col];
            });
            await database.execute(query, bindParams);
            results.push(item);
          }
          return res.status(201).json(success(`${config.tableName}s creados`, results));
        }

        const cols = config.columns.join(", ");
        const vals = config.columns.map((col) => `:${col}`).join(", ");
        const query = `INSERT INTO ${config.tableName} (${cols}) VALUES (${vals})`;
        const bindParams = {};
        config.columns.forEach((col) => {
          bindParams[col] = data[col];
        });
        await database.execute(query, bindParams);

        res.status(201).json(success(`${config.tableName} creado`, data));
      } catch (err) {
        next(err);
      }
    });

    router.delete(`${path}/:fk1/:fk2`, async (req, res, next) => {
      try {
        const database = require("../services/database.service");
        const { fk1, fk2 } = req.params;
        const query = `DELETE FROM ${config.tableName} WHERE ${config.columns[0]} = :fk1 AND ${config.columns[1]} = :fk2`;
        await database.execute(query, { fk1: parseInt(fk1), fk2: parseInt(fk2) });
        res.json(success(`${config.tableName} eliminado`));
      } catch (err) {
        next(err);
      }
    });
  } else {
    router.get(`${path}`, ctrl.getAll);
    router.get(`${path}/:id`, ctrl.getById);

    router.post(`${path}`, async (req, res, next) => {
      try {
        const data = req.body;

        if (Array.isArray(data)) {
          const results = [];
          for (const item of data) {
            const id = await repositories[key].create(item);
            results.push({ [config.primaryKey]: id });
          }
          return res.status(201).json(success(`${config.tableName}s creados`, results));
        }

        if (!validators.hasRequiredFields(data, config.requiredFields)) {
          return res.status(400).json(error(`Campos requeridos: ${config.requiredFields.join(", ")}`));
        }

        const id = await repositories[key].create(data);
        res.status(201).json(success(`${config.tableName} creado`, { [config.primaryKey]: id }));
      } catch (err) {
        next(err);
      }
    });

    router.put(`${path}/:id`, ctrl.update);
    router.delete(`${path}/:id`, ctrl.delete);
  }
}

router.get("/estadisticas/promedios", promediosPunteos);
router.get("/estadisticas/ranking-evaluados", rankingEvaluados);
router.get("/estadisticas/dificultad-preguntas", analisisDificultadPreguntas);

module.exports = router;