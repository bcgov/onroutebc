import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PowerUnitsModule } from './power-units/power-units.module';
import { TrailersModule } from './trailers/trailers.module';
import { PowerUnitTypesModule } from './power-unit-types/power-unit-types.module';
import { TrailerTypesModule } from './trailer-types/trailer-types.module';
import { CommonModule } from './common/common.module';
import * as path from 'path';

console.log(
  'Var check - DB_TYPE',
  process.env.DB_TYPE === 'mssql' ? 'mssql' : 'postgres',
);
console.log(
  'Var check - DB_HOST',
  process.env.DB_TYPE === 'mssql'
    ? process.env.MSSQL_HOST
    : process.env.POSTGRESQL_HOST,
);
console.log(
  'Var check - DB_PORT',
  process.env.DB_TYPE === 'mssql' ? parseInt(process.env.MSSQL_PORT) : 5432,
);
console.log(
  'Var check - DB_DATABASE',
  process.env.DB_TYPE === 'mssql'
    ? process.env.MSSQL_DB
    : process.env.POSTGRESQL_DATABASE,
);
console.log(
  'Var check - DB_USERNAME',
  process.env.DB_TYPE === 'mssql'
    ? process.env.MSSQL_SA_USER
    : process.env.POSTGRESQL_USER,
);
console.log(
  'Var check - DB_PASSWORD',
  process.env.DB_TYPE === 'mssql'
    ? process.env.MSSQL_SA_PASSWORD
    : process.env.POSTGRESQL_PASSWORD,
);
const envPath = path.resolve(process.cwd() + '/../../');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${envPath}/.env` }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE === 'mssql' ? 'mssql' : 'postgres',
      host:
        process.env.DB_TYPE === 'mssql'
          ? process.env.MSSQL_HOST
          : process.env.POSTGRESQL_HOST,
      port:
        process.env.DB_TYPE === 'mssql'
          ? parseInt(process.env.MSSQL_PORT)
          : 5432,
      database:
        process.env.DB_TYPE === 'mssql'
          ? process.env.MSSQL_DB
          : process.env.POSTGRESQL_DATABASE,
      username:
        process.env.DB_TYPE === 'mssql'
          ? process.env.MSSQL_SA_USER
          : process.env.POSTGRESQL_USER,
      password:
        process.env.DB_TYPE === 'mssql'
          ? process.env.MSSQL_SA_PASSWORD
          : process.env.POSTGRESQL_PASSWORD,
      options: { encrypt: process.env.MSSQL_ENCRYPT === 'true' },
      // entities: [User],
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: false, // This changes the DB schema to match changes to entities, which we might not want.
    }),
    PowerUnitsModule,
    TrailersModule,
    PowerUnitTypesModule,
    TrailerTypesModule,
    CommonModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
