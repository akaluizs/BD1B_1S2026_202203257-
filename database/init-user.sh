#!/bin/bash

# Script de inicialización para Oracle XE en Docker
# Espera a que Oracle esté listo y crea el usuario

echo "Esperando que Oracle XE inicie..."
sleep 30

# Crear el usuario si la BD está lista
while ! sqlplus -s / as sysdba @?/rdbms/admin/sqlnet.ftp > /dev/null 2>&1; do
  echo "Esperando Oracle XE..."
  sleep 5
done

echo "Oracle XE está listo. Creando usuario..."

# Script SQL para crear usuario
sqlplus -s / as sysdba << EOF
SET ECHO ON
SET FEEDBACK ON

-- Crear usuario
CREATE USER C123 IDENTIFIED BY 12345;

-- Conceder permisos
GRANT CONNECT, RESOURCE, DBA TO C123;
GRANT UNLIMITED TABLESPACE TO C123;
GRANT ALL PRIVILEGES TO C123;

-- Ejecutar init.sql como el nuevo usuario
@/container-entrypoint-initdb.d/init.sql

COMMIT;
EXIT;
EOF

echo "Usuario C123 creado exitosamente"
