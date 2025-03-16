# psql CloOk -f src/database/kostil.sql
rm -rf src/migrations/*
rm -rf dist
npx ts-node node_modules/.bin/typeorm migration:generate src/migrations/InitialMigration -d src/database/data-source.ts