import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';

console.log('Var check - POSTGRESQL_HOST', process.env.POSTGRESQL_HOST);
console.log('Var check - POSTGRESQL_DATABASE', process.env.POSTGRESQL_DATABASE);
console.log('Var check - POSTGRESQL_USER', process.env.POSTGRESQL_USER);
if (process.env.POSTGRESQL_PASSWORD != null) {
  console.log('Var check - POSTGRESQL_PASSWORD present');
} else {
  console.log('Var check - POSTGRESQL_PASSWORD not present');
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ 
      type: process.env.DB_TYPE==='mssql'?'mssql':'postgres',
      host: process.env.DB_TYPE === 'mssql'? process.env.MSSQL_HOST: process.env.POSTGRESQL_HOST,
      port: process.env.DB_TYPE === 'mssql'? parseInt(process.env.MSSQL_PORT):5432,
      database: process.env.DB_TYPE === 'mssql'? process.env.MSSQL_DB : process.env.POSTGRESQL_DATABASE,
      username: process.env.DB_TYPE === 'mssql'? process.env.MSSQL_SA_USER : process.env.POSTGRESQL_USER,
      password: process.env.DB_TYPE === 'mssql'? process.env.MSSQL_SA_PASSWORD : process.env.POSTGRESQL_PASSWORD,
      // entities: [User],
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: process.env.DB_TYPE === 'mssql'? true: true, // This changes the DB schema to match changes to entities, which we might not want.
      options: { encrypt: process.env.DB_TYPE === 'mssql'? false: null },
    }),
    VehiclesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
