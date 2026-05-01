# Guía Rápida - Conexión a Oracle desde DBeaver

## ⚡ Acceso Rápido

### Usuario de Aplicación (Recomendado)
```
Host:       localhost
Port:       1521
Database:   xe
Username:   C123
Password:   12345
```

### Usuario Administrador (SYS)
```
Host:       localhost
Port:       1521
Database:   xe
Username:   sys
Password:   system123
Role:       SYSDBA
```

---

## 🚀 Pasos para Conectar

1. **Levantar Docker Compose** (primera vez):
   ```bash
   docker-compose down -v  # Limpiar si hay BD anterior
   docker-compose up --build
   ```

2. **Esperar a que Oracle inicie**:
   - Ver logs: `docker-compose logs database`
   - Esperar: "Oracle Database is ready to use"
   - El contenedor debe mostrar status "healthy"
   - Tiempo estimado: 3-5 minutos

3. **Abrir DBeaver**:
   - Click en "Database" → "New Database Connection"
   - Seleccionar "Oracle"
   - Copiar datos arriba en "Configuración"

4. **Probar Conexión**:
   - Click en "Test Connection"
   - Debe mostrar "Connected successfully"

---

## 📊 Esquema de Tablas

Las siguientes tablas se crean automáticamente:

- Centro_Evaluacion
- Departamento
- Escuela
- Evaluacion
- Evaluacion_Practica
- Evaluacion_Teorica
- Instructor
- Municipio
- Persona
- Pregunta_Teorica
- Relation_1
- Respuesta_Teorica
- Tipo_Licencia
- Tipo_Tramite
- Usuario_Sistema

---

## ⚠️ Problemas Comunes

### No puedo conectar
- Verificar que Docker está corriendo: `docker ps`
- Verificar que el contenedor está "healthy": `docker ps | grep oracle`
- Esperar 5 minutos más (primera iniciación)

### Conexión rechazada en puerto 1521
- Puerto 1521 ocupado: `lsof -i :1521`
- Parar otros servicios: `docker-compose down`

### Error de credenciales
- Usuario correcto: `C123` (no `C123@xe`)
- Contraseña: `12345`
- Sin espacios extras
- Case-sensitive en usuario

---

## 🔄 Reiniciar BD

```bash
# Detener y limpiar
docker-compose down -v

# Reiniciar
docker-compose up --build
```

---

## 📝 Variables de Entorno

Ver archivo `.env.example` para todas las variables configurables.
