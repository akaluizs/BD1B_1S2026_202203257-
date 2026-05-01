const database = require("../services/database.service");
const { success } = require("../utils/responses");

const promediosPunteos = async (req, res, next) => {
  try {
    const query = `
      WITH ExamScores AS (
        SELECT
          e.id_examen,
          r.ubicacion_centro_id_centro as id_centro,
          ce.nombre as centro,
          r.ubicacion_escuela_id_escuela as id_escuela,
          esc.nombre as escuela,
          ROUND(
            SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
            NULLIF(COUNT(ru.pregunta_id_pregunta), 0),
            2
          ) as promedio_teorico,
          NVL(AVG(rpu.nota), 0) as promedio_practico
        FROM Examen e
        INNER JOIN Registro r ON r.id_registro = e.registro_id_registro
        INNER JOIN Centro_Evaluacion ce ON ce.id_centro = r.ubicacion_centro_id_centro
        INNER JOIN Escuela esc ON esc.id_escuela = r.ubicacion_escuela_id_escuela
        LEFT JOIN Respuesta_Usuario ru ON ru.examen_id_examen = e.id_examen
        LEFT JOIN Pregunta p ON p.id_pregunta = ru.pregunta_id_pregunta
        LEFT JOIN Respuesta_Practico_Usuario rpu ON rpu.examen_id_examen = e.id_examen
        GROUP BY
          e.id_examen,
          r.ubicacion_centro_id_centro, ce.nombre,
          r.ubicacion_escuela_id_escuela, esc.nombre
      )
      SELECT
        id_centro,
        centro,
        id_escuela,
        escuela,
        COUNT(id_examen) as total_examenes,
        ROUND(AVG(promedio_teorico), 2) as promedio_examenes_teorico,
        ROUND(AVG(promedio_practico), 2) as promedio_examenes_practico,
        SUM(CASE WHEN promedio_teorico >= 60 AND promedio_practico >= 60 THEN 1 ELSE 0 END) as aprobados
      FROM ExamScores
      GROUP BY id_centro, centro, id_escuela, escuela
      ORDER BY total_examenes DESC
    `;

    const result = await database.execute(query, {});
    res.json(success("Estadísticas de evaluaciones por centro y escuela", result.rows || []));
  } catch (err) {
    next(err);
  }
};

const rankingEvaluados = async (req, res, next) => {
  try {
    const query = `
      SELECT
        r.id_registro,
        r.nombre_completo,
        ce.nombre as centro,
        esc.nombre as escuela,
        r.tipo_licencia,
        ROUND(
          SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
          NULLIF(COUNT(DISTINCT ru.pregunta_id_pregunta), 0),
          2
        ) as promedio_teorico,
        ROUND(NVL(AVG(rpu.nota), 0), 2) as promedio_practico,
        ROUND(
          (
            ROUND(
              SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
              NULLIF(COUNT(DISTINCT ru.pregunta_id_pregunta), 0),
              2
            ) + NVL(AVG(rpu.nota), 0)
          ) / 2,
          2
        ) as resultado_final,
        COUNT(DISTINCT e.id_examen) as total_examenes
      FROM Registro r
      INNER JOIN Examen e ON e.registro_id_registro = r.id_registro
      INNER JOIN Centro_Evaluacion ce ON ce.id_centro = r.ubicacion_centro_id_centro
      INNER JOIN Escuela esc ON esc.id_escuela = r.ubicacion_escuela_id_escuela
      LEFT JOIN Respuesta_Usuario ru ON ru.examen_id_examen = e.id_examen
      LEFT JOIN Pregunta p ON p.id_pregunta = ru.pregunta_id_pregunta
      LEFT JOIN Respuesta_Practico_Usuario rpu ON rpu.examen_id_examen = e.id_examen
      GROUP BY
        r.id_registro,
        r.nombre_completo,
        ce.nombre,
        esc.nombre,
        r.tipo_licencia
      ORDER BY resultado_final DESC
      FETCH FIRST 20 ROWS ONLY
    `;

    const result = await database.execute(query, {});
    res.json(success("Ranking de evaluados por resultado final", result.rows || []));
  } catch (err) {
    next(err);
  }
};

const analisisDificultadPreguntas = async (req, res, next) => {
  try {
    const query = `
      SELECT
        p.id_pregunta,
        p.pregunta_texto,
        p.respuesta_correcta,
        COUNT(ru.respuesta) as total_respuestas,
        SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) as aciertos,
        SUM(CASE WHEN ru.respuesta != p.respuesta_correcta THEN 1 ELSE 0 END) as fallos,
        ROUND(
          SUM(CASE WHEN ru.respuesta = p.respuesta_correcta THEN 1 ELSE 0 END) * 100.0 /
          NULLIF(COUNT(ru.respuesta), 0),
          2
        ) as porcentaje_aciertos
      FROM Pregunta p
      INNER JOIN Respuesta_Usuario ru ON ru.pregunta_id_pregunta = p.id_pregunta
      GROUP BY p.id_pregunta, p.pregunta_texto, p.respuesta_correcta
      ORDER BY porcentaje_aciertos ASC
      FETCH FIRST 1 ROWS ONLY
    `;

    const result = await database.execute(query, {});
    const row = result.rows?.[0];
    if (row) {
      res.json(success("Pregunta con menor porcentaje de aciertos (más difícil)", row));
    } else {
      res.json(success("No hay datos de respuestas disponibles", null));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { promediosPunteos, rankingEvaluados, analisisDificultadPreguntas };
