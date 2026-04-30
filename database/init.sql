-- Script de inicialización de BD
-- Centros de Evaluación de Manejo - Guatemala
-- Ejecutado automáticamente por gvenzl/oracle-xe como SYS

ALTER SESSION SET "_ORACLE_SCRIPT"=true;

-- ============================================
-- PARTE 1: CREAR USUARIO
-- ============================================

BEGIN
  EXECUTE IMMEDIATE 'DROP USER C123 CASCADE';
EXCEPTION WHEN OTHERS THEN
  IF SQLCODE != -1918 THEN
    RAISE;
  END IF;
END;
/

CREATE USER C123 IDENTIFIED BY "12345";

GRANT CONNECT TO C123;
GRANT RESOURCE TO C123;
GRANT DBA TO C123;
GRANT UNLIMITED TABLESPACE TO C123;
GRANT CREATE SESSION TO C123;
GRANT CREATE TABLE TO C123;
GRANT CREATE VIEW TO C123;
GRANT CREATE PROCEDURE TO C123;
GRANT CREATE SEQUENCE TO C123;

COMMIT;

ALTER SESSION SET CURRENT_SCHEMA = C123;

-- ============================================
-- PARTE 2: CREAR TABLAS
-- ============================================

CREATE TABLE Departamento
    (
     id_departamento INTEGER NOT NULL,
     nombre VARCHAR2(100) NOT NULL,
     codigo VARCHAR2(10) NOT NULL
    )
;

ALTER TABLE Departamento
    ADD CONSTRAINT Departamento_PK PRIMARY KEY (id_departamento);

CREATE TABLE Municipio
    (
     id_municipio INTEGER NOT NULL,
     nombre VARCHAR2(100) NOT NULL,
     codigo VARCHAR2(10) NOT NULL,
     departamento_id_departamento INTEGER NOT NULL
    )
;

ALTER TABLE Municipio
    ADD CONSTRAINT Municipio_PK PRIMARY KEY (id_municipio, departamento_id_departamento);

CREATE TABLE Centro_Evaluacion
    (
     id_centro INTEGER NOT NULL,
     nombre VARCHAR2(200) NOT NULL
    )
;

ALTER TABLE Centro_Evaluacion
    ADD CONSTRAINT Centro_Evaluacion_PK PRIMARY KEY (id_centro);

CREATE TABLE Escuela
    (
     id_escuela INTEGER NOT NULL,
     nombre VARCHAR2(200) NOT NULL,
     direccion VARCHAR2(300),
     acuerdo VARCHAR2(50) NOT NULL
    )
;

ALTER TABLE Escuela
    ADD CONSTRAINT Escuela_PK PRIMARY KEY (id_escuela);

CREATE TABLE Ubicacion
    (
     escuela_id_escuela INTEGER NOT NULL,
     centro_id_centro INTEGER NOT NULL
    )
;

ALTER TABLE Ubicacion
    ADD CONSTRAINT Ubicacion_PK PRIMARY KEY (escuela_id_escuela, centro_id_centro);

CREATE TABLE Tipo_Licencia
    (
     id_licencia INTEGER NOT NULL,
     letra CHAR(1) NOT NULL
    )
;

ALTER TABLE Tipo_Licencia
    ADD CONSTRAINT Tipo_Licencia_PK PRIMARY KEY (id_licencia);

CREATE TABLE Tipo_Tramite
    (
     id_tramite INTEGER NOT NULL,
     descripcion VARCHAR2(100) NOT NULL
    )
;

ALTER TABLE Tipo_Tramite
    ADD CONSTRAINT Tipo_Tramite_PK PRIMARY KEY (id_tramite);

CREATE TABLE Registro
    (
     id_registro INTEGER NOT NULL,
     ubicacion_escuela_id_escuela INTEGER NOT NULL,
     ubicacion_centro_id_centro INTEGER NOT NULL,
     municipio_id_municipio INTEGER NOT NULL,
     municipio_departamento_id_departamento INTEGER NOT NULL,
     fecha DATE NOT NULL,
     tipo_tramite VARCHAR2(100) NOT NULL,
     tipo_licencia VARCHAR2(10) NOT NULL,
     nombre_completo VARCHAR2(200) NOT NULL,
     genero CHAR(1) NOT NULL
    )
;

ALTER TABLE Registro
    ADD CONSTRAINT Registro_PK PRIMARY KEY (id_registro);

CREATE TABLE Correlativo
    (
     id_correlativo INTEGER NOT NULL,
     fecha DATE NOT NULL,
     no_examen INTEGER NOT NULL
    )
;

ALTER TABLE Correlativo
    ADD CONSTRAINT Correlativo_PK PRIMARY KEY (id_correlativo);

CREATE TABLE Examen
    (
     id_examen INTEGER NOT NULL,
     registro_id_registro INTEGER NOT NULL,
     correlativo_id_correlativo INTEGER NOT NULL,
     registro_id_escuela INTEGER NOT NULL,
     registro_id_centro INTEGER NOT NULL,
     registro_municipio_id_municipio INTEGER NOT NULL,
     registro_municipio_departamento_id_departamento INTEGER NOT NULL
    )
;

ALTER TABLE Examen
    ADD CONSTRAINT Examen_PK PRIMARY KEY (id_examen);

CREATE TABLE Pregunta
    (
     id_pregunta INTEGER NOT NULL,
     pregunta_texto VARCHAR2(500) NOT NULL,
     respuesta_a VARCHAR2(200) NOT NULL,
     respuesta_b VARCHAR2(200) NOT NULL,
     respuesta_c VARCHAR2(200) NOT NULL,
     respuesta_d VARCHAR2(200) NOT NULL,
     respuesta_correcta CHAR(1) NOT NULL
    )
;

ALTER TABLE Pregunta
    ADD CONSTRAINT Pregunta_PK PRIMARY KEY (id_pregunta);

CREATE TABLE Pregunta_Practico
    (
     id_pregunta_practico INTEGER NOT NULL,
     pregunta_texto VARCHAR2(500) NOT NULL,
     punteo INTEGER NOT NULL
    )
;

ALTER TABLE Pregunta_Practico
    ADD CONSTRAINT Pregunta_Practico_PK PRIMARY KEY (id_pregunta_practico);

CREATE TABLE Respuesta_Usuario
    (
     pregunta_id_pregunta INTEGER NOT NULL,
     examen_id_examen INTEGER NOT NULL,
     respuesta CHAR(1) NOT NULL
    )
;

ALTER TABLE Respuesta_Usuario
    ADD CONSTRAINT Respuesta_Usuario_PK PRIMARY KEY (pregunta_id_pregunta, examen_id_examen);

CREATE TABLE Respuesta_Practico_Usuario
    (
     pregunta_practico_id_pregunta_practico INTEGER NOT NULL,
     examen_id_examen INTEGER NOT NULL,
     nota INTEGER NOT NULL
    )
;

ALTER TABLE Respuesta_Practico_Usuario
    ADD CONSTRAINT Respuesta_Practico_Usuario_PK PRIMARY KEY (pregunta_practico_id_pregunta_practico, examen_id_examen);

-- ============================================
-- PARTE 3: LLAVES FORÁNEAS
-- ============================================

ALTER TABLE Municipio
    ADD CONSTRAINT Municipio_Departamento_FK
    FOREIGN KEY (departamento_id_departamento)
    REFERENCES Departamento(id_departamento);

ALTER TABLE Ubicacion
    ADD CONSTRAINT Ubicacion_Escuela_FK
    FOREIGN KEY (escuela_id_escuela)
    REFERENCES Escuela(id_escuela);

ALTER TABLE Ubicacion
    ADD CONSTRAINT Ubicacion_Centro_FK
    FOREIGN KEY (centro_id_centro)
    REFERENCES Centro_Evaluacion(id_centro);

ALTER TABLE Registro
    ADD CONSTRAINT Registro_Ubicacion_FK
    FOREIGN KEY (ubicacion_escuela_id_escuela, ubicacion_centro_id_centro)
    REFERENCES Ubicacion(escuela_id_escuela, centro_id_centro);

ALTER TABLE Registro
    ADD CONSTRAINT Registro_Municipio_FK
    FOREIGN KEY (municipio_id_municipio, municipio_departamento_id_departamento)
    REFERENCES Municipio(id_municipio, departamento_id_departamento);

ALTER TABLE Examen
    ADD CONSTRAINT Examen_Registro_FK
    FOREIGN KEY (registro_id_registro)
    REFERENCES Registro(id_registro);

ALTER TABLE Examen
    ADD CONSTRAINT Examen_Correlativo_FK
    FOREIGN KEY (correlativo_id_correlativo)
    REFERENCES Correlativo(id_correlativo);

ALTER TABLE Respuesta_Usuario
    ADD CONSTRAINT Respuesta_Usuario_Pregunta_FK
    FOREIGN KEY (pregunta_id_pregunta)
    REFERENCES Pregunta(id_pregunta);

ALTER TABLE Respuesta_Usuario
    ADD CONSTRAINT Respuesta_Usuario_Examen_FK
    FOREIGN KEY (examen_id_examen)
    REFERENCES Examen(id_examen);

ALTER TABLE Respuesta_Practico_Usuario
    ADD CONSTRAINT Respuesta_Practico_Usuario_Pregunta_FK
    FOREIGN KEY (pregunta_practico_id_pregunta_practico)
    REFERENCES Pregunta_Practico(id_pregunta_practico);

ALTER TABLE Respuesta_Practico_Usuario
    ADD CONSTRAINT Respuesta_Practico_Usuario_Examen_FK
    FOREIGN KEY (examen_id_examen)
    REFERENCES Examen(id_examen);

COMMIT;