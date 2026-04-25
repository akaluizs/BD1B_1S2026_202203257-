# API REST - Centro de Evaluación de Manejo

## Base URL
```
http://localhost:3000/api/v1
```

## Endpoints Disponibles (75 total)

### 1. Departamentos (5 endpoints)
```
GET    /api/v1/departamentos              - Obtener todos
GET    /api/v1/departamentos/:id          - Obtener por ID
POST   /api/v1/departamentos              - Crear nuevo
PUT    /api/v1/departamentos/:id          - Actualizar
DELETE /api/v1/departamentos/:id          - Eliminar
```

### 2. Tipos de Licencia (5 endpoints)
```
GET    /api/v1/tipos-licencia
GET    /api/v1/tipos-licencia/:id
POST   /api/v1/tipos-licencia
PUT    /api/v1/tipos-licencia/:id
DELETE /api/v1/tipos-licencia/:id
```

### 3. Tipos de Trámite (5 endpoints)
```
GET    /api/v1/tipos-tramite
GET    /api/v1/tipos-tramite/:id
POST   /api/v1/tipos-tramite
PUT    /api/v1/tipos-tramite/:id
DELETE /api/v1/tipos-tramite/:id
```

### 4. Usuarios del Sistema (5 endpoints)
```
GET    /api/v1/usuarios-sistema
GET    /api/v1/usuarios-sistema/:id
POST   /api/v1/usuarios-sistema
PUT    /api/v1/usuarios-sistema/:id
DELETE /api/v1/usuarios-sistema/:id
```

### 5. Centros de Evaluación (5 endpoints)
```
GET    /api/v1/centros-evaluacion
GET    /api/v1/centros-evaluacion/:id
POST   /api/v1/centros-evaluacion
PUT    /api/v1/centros-evaluacion/:id
DELETE /api/v1/centros-evaluacion/:id
```

### 6. Escuelas (5 endpoints)
```
GET    /api/v1/escuelas
GET    /api/v1/escuelas/:id
POST   /api/v1/escuelas
PUT    /api/v1/escuelas/:id
DELETE /api/v1/escuelas/:id
```

### 7. Municipios (5 endpoints)
```
GET    /api/v1/municipios
GET    /api/v1/municipios/:id
POST   /api/v1/municipios
PUT    /api/v1/municipios/:id
DELETE /api/v1/municipios/:id
```

### 8. Personas (5 endpoints)
```
GET    /api/v1/personas
GET    /api/v1/personas/:id
POST   /api/v1/personas
PUT    /api/v1/personas/:id
DELETE /api/v1/personas/:id
```

### 9. Evaluaciones (5 endpoints)
```
GET    /api/v1/evaluaciones
GET    /api/v1/evaluaciones/:id
POST   /api/v1/evaluaciones
PUT    /api/v1/evaluaciones/:id
DELETE /api/v1/evaluaciones/:id
```

### 10. Evaluaciones Prácticas (5 endpoints)
```
GET    /api/v1/evaluaciones-practicas
GET    /api/v1/evaluaciones-practicas/:id
POST   /api/v1/evaluaciones-practicas
PUT    /api/v1/evaluaciones-practicas/:id
DELETE /api/v1/evaluaciones-practicas/:id
```

### 11. Evaluaciones Teóricas (5 endpoints)
```
GET    /api/v1/evaluaciones-teoricas
GET    /api/v1/evaluaciones-teoricas/:id
POST   /api/v1/evaluaciones-teoricas
PUT    /api/v1/evaluaciones-teoricas/:id
DELETE /api/v1/evaluaciones-teoricas/:id
```

### 12. Instructores (5 endpoints)
```
GET    /api/v1/instructores
GET    /api/v1/instructores/:id
POST   /api/v1/instructores
PUT    /api/v1/instructores/:id
DELETE /api/v1/instructores/:id
```

### 13. Preguntas Teóricas (5 endpoints)
```
GET    /api/v1/preguntas-teoricas
GET    /api/v1/preguntas-teoricas/:id
POST   /api/v1/preguntas-teoricas
PUT    /api/v1/preguntas-teoricas/:id
DELETE /api/v1/preguntas-teoricas/:id
```

### 14. Respuestas Teóricas (5 endpoints)
```
GET    /api/v1/respuestas-teoricas
GET    /api/v1/respuestas-teoricas/:id
POST   /api/v1/respuestas-teoricas
PUT    /api/v1/respuestas-teoricas/:id
DELETE /api/v1/respuestas-teoricas/:id
```

### 15. Relaciones (5 endpoints)
```
GET    /api/v1/relaciones
GET    /api/v1/relaciones/:id
POST   /api/v1/relaciones
PUT    /api/v1/relaciones/:id
DELETE /api/v1/relaciones/:id
```

## Ejemplos de Uso

### GET - Obtener todos los departamentos
```bash
curl -X GET http://localhost:3000/api/v1/departamentos
```

### GET con paginación
```bash
curl -X GET "http://localhost:3000/api/v1/departamentos?limit=10&offset=0"
```

### GET - Obtener por ID
```bash
curl -X GET http://localhost:3000/api/v1/departamentos/1
```

### POST - Crear nuevo departamento
```bash
curl -X POST http://localhost:3000/api/v1/departamentos \
  -H "Content-Type: application/json" \
  -d '{
    "id_departamento": 1,
    "nombre": "San Salvador",
    "abreviatura": "SS"
  }'
```

### PUT - Actualizar departamento
```bash
curl -X PUT http://localhost:3000/api/v1/departamentos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "San Salvador (actualizado)",
    "abreviatura": "SSA"
  }'
```

### DELETE - Eliminar departamento
```bash
curl -X DELETE http://localhost:3000/api/v1/departamentos/1
```

## Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Departamentos obtenidos",
  "data": [
    {
      "id_departamento": 1,
      "nombre": "San Salvador",
      "abreviatura": "SS"
    }
  ]
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Departamento no encontrado"
}
```

## Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no existe |
| 409 | Conflict - Recurso duplicado |
| 500 | Server Error - Error interno |

## Validaciones

Todos los controllers implementan:
-  Validación de IDs numéricos
-  Validación de nombres (sin valores vacíos)
-  Validación de fechas (formato correcto)
-  Validación de Foreign Keys
-  Prevención de duplicados
-  Paginación (limit/offset)

## Estructura de Arquitectura

```
Routes (15 files)
    ↓
Controllers (15 files)
    ↓
Repositories (15 files)
    ↓
Database (Oracle XE)
```

Cada layer (capa) es independiente y reutilizable.
