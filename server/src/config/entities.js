const BaseRepository = require("../base/BaseRepository");
const database = require("../services/database.service");

const ENTITIES = {
  departamento: {
    tableName: "Departamento",
    primaryKey: "id_departamento",
    columns: ["id_departamento", "nombre", "codigo"],
    requiredFields: ["id_departamento", "nombre", "codigo"],
    routesPath: "/departamentos",
  },
  municipio: {
    tableName: "Municipio",
    primaryKey: "id_municipio",
    columns: ["id_municipio", "nombre", "codigo", "departamento_id_departamento"],
    requiredFields: ["id_municipio", "nombre", "codigo", "departamento_id_departamento"],
    routesPath: "/municipios",
    foreignKeys: {
      departamento_id_departamento: "departamento",
    },
  },
  centroEvaluacion: {
    tableName: "Centro_Evaluacion",
    primaryKey: "id_centro",
    columns: ["id_centro", "nombre"],
    requiredFields: ["id_centro", "nombre"],
    routesPath: "/centros-evaluacion",
  },
  escuela: {
    tableName: "Escuela",
    primaryKey: "id_escuela",
    columns: ["id_escuela", "nombre", "direccion", "acuerdo"],
    requiredFields: ["id_escuela", "nombre", "acuerdo"],
    routesPath: "/escuelas",
  },
  ubicacion: {
    tableName: "Ubicacion",
    primaryKey: null,
    columns: ["escuela_id_escuela", "centro_id_centro"],
    requiredFields: ["escuela_id_escuela", "centro_id_centro"],
    routesPath: "/ubicaciones",
    foreignKeys: {
      escuela_id_escuela: "escuela",
      centro_id_centro: "centroEvaluacion",
    },
    isJoinTable: true,
  },
  tipoLicencia: {
    tableName: "Tipo_Licencia",
    primaryKey: "id_licencia",
    columns: ["id_licencia", "letra"],
    requiredFields: ["id_licencia", "letra"],
    routesPath: "/tipos-licencia",
  },
  tipoTramite: {
    tableName: "Tipo_Tramite",
    primaryKey: "id_tramite",
    columns: ["id_tramite", "descripcion"],
    requiredFields: ["id_tramite", "descripcion"],
    routesPath: "/tipos-tramite",
  },
  registro: {
    tableName: "Registro",
    primaryKey: "id_registro",
    columns: [
      "id_registro",
      "ubicacion_escuela_id_escuela",
      "ubicacion_centro_id_centro",
      "municipio_id_municipio",
      "municipio_departamento_id_departamento",
      "fecha",
      "tipo_tramite",
      "tipo_licencia",
      "nombre_completo",
      "genero",
    ],
    requiredFields: [
      "id_registro",
      "ubicacion_escuela_id_escuela",
      "ubicacion_centro_id_centro",
      "municipio_id_municipio",
      "municipio_departamento_id_departamento",
      "fecha",
      "tipo_tramite",
      "tipo_licencia",
      "nombre_completo",
      "genero",
    ],
    routesPath: "/registros",
    foreignKeys: {
      ubicacion_escuela_id_escuela: "escuela",
      ubicacion_centro_id_centro: "centroEvaluacion",
      municipio_id_municipio: "municipio",
    },
  },
  correlativo: {
    tableName: "Correlativo",
    primaryKey: "id_correlativo",
    columns: ["id_correlativo", "fecha", "no_examen"],
    requiredFields: ["id_correlativo", "fecha", "no_examen"],
    routesPath: "/correlativos",
  },
  examen: {
    tableName: "Examen",
    primaryKey: "id_examen",
    columns: [
      "id_examen",
      "registro_id_registro",
      "correlativo_id_correlativo",
      "registro_id_escuela",
      "registro_id_centro",
      "registro_municipio_id_municipio",
      "registro_municipio_departamento_id_departamento",
    ],
    requiredFields: [
      "id_examen",
      "registro_id_registro",
      "correlativo_id_correlativo",
      "registro_id_escuela",
      "registro_id_centro",
      "registro_municipio_id_municipio",
      "registro_municipio_departamento_id_departamento",
    ],
    routesPath: "/examenes",
    foreignKeys: {
      registro_id_registro: "registro",
      correlativo_id_correlativo: "correlativo",
    },
  },
  pregunta: {
    tableName: "Pregunta",
    primaryKey: "id_pregunta",
    columns: ["id_pregunta", "pregunta_texto", "respuesta_a", "respuesta_b", "respuesta_c", "respuesta_d", "respuesta_correcta"],
    requiredFields: ["id_pregunta", "pregunta_texto", "respuesta_a", "respuesta_b", "respuesta_c", "respuesta_d", "respuesta_correcta"],
    routesPath: "/preguntas",
  },
  preguntaPractico: {
    tableName: "Pregunta_Practico",
    primaryKey: "id_pregunta_practico",
    columns: ["id_pregunta_practico", "pregunta_texto", "punteo"],
    requiredFields: ["id_pregunta_practico", "pregunta_texto", "punteo"],
    routesPath: "/preguntas-practicas",
  },
  respuestaUsuario: {
    tableName: "Respuesta_Usuario",
    primaryKey: null,
    columns: ["pregunta_id_pregunta", "examen_id_examen", "respuesta"],
    requiredFields: ["pregunta_id_pregunta", "examen_id_examen", "respuesta"],
    routesPath: "/respuestas-usuario",
    foreignKeys: {
      pregunta_id_pregunta: "pregunta",
      examen_id_examen: "examen",
    },
    isJoinTable: true,
  },
  respuestaPracticoUsuario: {
    tableName: "Respuesta_Practico_Usuario",
    primaryKey: null,
    columns: ["pregunta_practico_id_pregunta_practico", "examen_id_examen", "nota"],
    requiredFields: ["pregunta_practico_id_pregunta_practico", "examen_id_examen", "nota"],
    routesPath: "/respuestas-practico-usuario",
    foreignKeys: {
      pregunta_practico_id_pregunta_practico: "preguntaPractico",
      examen_id_examen: "examen",
    },
    isJoinTable: true,
  },
};

const STATISTICAL_QUERIES = {
  promediosPunteos: async (req, res, next) => {
    try {
      const { id_centro, anio, mes } = req.query;

      let query = `
        SELECT
          AVG(ru.respuesta) as promedio_teorico,
          AVG(rpu.nota) as promedio_practico,
          (AVG(ru.respuesta) + AVG(rpu.nota)) / 2 as promedio_general,
          COUNT(DISTINCT e.id_examen) as total_examenes
        FROM Examen e
        LEFT JOIN Respuesta_Usuario ru ON ru.examen_id_examen = e.id_examen
        LEFT JOIN Respuesta_Practico_Usuario rpu ON rpu.examen_id_examen = e.id_examen
        WHERE 1=1
      `;

      const params = {};

      if (id_centro) {
        query += ` AND e.registro_id_centro = :id_centro`;
        params.id_centro = parseInt(id_centro);
      }

      if (anio) {
        query += ` AND EXTRACT(YEAR FROM e.registro_id_registro) = :anio`;
        params.anio = parseInt(anio);
      }

      if (mes) {
        query += ` AND EXTRACT(MONTH FROM e.registro_id_registro) = :mes`;
        params.mes = parseInt(mes);
      }

      const result = await database.execute(query, params);
      res.json(success("Promedios de punteos", result.rows?.[0] || null));
    } catch (err) {
      next(err);
    }
  },

  rankingEvaluados: async (req, res, next) => {
    try {
      const { id_centro, limit = 10 } = req.query;

      let query = `
        SELECT
          r.id_registro,
          r.nombre_completo,
          e.registro_id_centro as id_centro,
          ce.nombre as nombre_centro,
          AVG(NVL(ru.respuesta, 0)) as promedio_teorico,
          AVG(NVL(rpu.nota, 0)) as promedio_practico,
          (AVG(NVL(ru.respuesta, 0)) + AVG(NVL(rpu.nota, 0))) / 2 as promedio_general,
          COUNT(e.id_examen) as total_intentos
        FROM Registro r
        INNER JOIN Examen e ON e.registro_id_registro = r.id_registro
        INNER JOIN Centro_Evaluacion ce ON ce.id_centro = e.registro_id_centro
        LEFT JOIN Respuesta_Usuario ru ON ru.examen_id_examen = e.id_examen
        LEFT JOIN Respuesta_Practico_Usuario rpu ON rpu.examen_id_examen = e.id_examen
        WHERE 1=1
      `;

      const params = {};

      if (id_centro) {
        query += ` AND e.registro_id_centro = :id_centro`;
        params.id_centro = parseInt(id_centro);
      }

      query += `
        GROUP BY r.id_registro, r.nombre_completo, e.registro_id_centro, ce.nombre
        ORDER BY promedio_general DESC
        FETCH FIRST :limit ROWS ONLY
      `;

      params.limit = parseInt(limit);

      const result = await database.execute(query, params);
      res.json(success("Ranking de evaluados", result.rows || []));
    } catch (err) {
      next(err);
    }
  },

  analisisDificultadPreguntas: async (req, res, next) => {
    try {
      const { id_examen } = req.query;

      let query = `
        SELECT
          p.id_pregunta,
          p.pregunta_texto,
          p.respuesta_correcta,
          COUNT(ru.respuesta) as total_respuestas,
          SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) as respuestas_correctas,
          SUM(CASE WHEN ru.respuesta != p.respuesta_correcta THEN 1 ELSE 0 END) as respuestas_incorrectas,
          ROUND(
            SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
            NULLIF(COUNT(ru.respuesta), 0),
            2
          ) as porcentaje_acierto,
          CASE
            WHEN ROUND(
              SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
              NULLIF(COUNT(ru.respuesta), 0),
            2) >= 70 THEN 'Fácil'
            WHEN ROUND(
              SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
              NULLIF(COUNT(ru.respuesta), 0),
            2) >= 40 THEN 'Moderada'
            ELSE 'Difícil'
          END as nivel_dificultad
        FROM Pregunta p
        LEFT JOIN Respuesta_Usuario ru ON ru.pregunta_id_pregunta = p.id_pregunta
      `;

      const params = {};

      if (id_examen) {
        query += ` WHERE ru.examen_id_examen = :id_examen`;
        params.id_examen = parseInt(id_examen);
      }

      query += `
        GROUP BY p.id_pregunta, p.pregunta_texto, p.respuesta_correcta
        ORDER BY porcentaje_acierto ASC
      `;

      const result = await database.execute(query, params);
      res.json(success("Análisis de dificultad de preguntas", result.rows || []));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { ENTITIES, STATISTICAL_QUERIES };