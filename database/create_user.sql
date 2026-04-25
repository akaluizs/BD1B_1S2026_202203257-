-- Script para crear usuario y conceder permisos
-- Este script se ejecuta después de init.sql

-- Conectar como SYSDBA y crear el usuario si no existe
BEGIN
  EXECUTE IMMEDIATE 'DROP USER C123 CASCADE';
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
/

-- Crear usuario C123
CREATE USER C123 IDENTIFIED BY 12345;

-- Conceder permisos básicos
GRANT CONNECT, RESOURCE, DBA TO C123;
GRANT UNLIMITED TABLESPACE TO C123;

-- Conceder permisos adicionales para que pueda acceder a las tablas
GRANT ALL PRIVILEGES TO C123;

COMMIT;
/

-- Verificar que el usuario fue creado
SELECT * FROM all_users WHERE username = 'C123';
/
