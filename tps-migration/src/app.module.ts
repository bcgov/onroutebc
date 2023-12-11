import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { TpsPermitModule } from './modules/tps-permit/tps-permit.module';
import { ScheduleModule } from '@nestjs/schedule';

const envPath = path.resolve(process.cwd() + '/../');

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: `${envPath}/.env` }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE === 'mssql' ? 'mssql' : 'postgres',
      useUTC: true,
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
      options: { encrypt: process.env.MSSQL_ENCRYPT === 'true', useUTC: true },
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: false, // This changes the DB schema to match changes to entities, which we might not want.
      logging: false,
    }),
    TpsPermitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
