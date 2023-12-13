import 'dotenv/config';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import * as path from 'path';
import { AppController } from './app.controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AuthModule } from './modules/auth/auth.module';
import { DmsModule } from './modules/dms/dms.module';
import { CacheModule } from '@nestjs/cache-manager';
import { DgenModule } from './modules/dgen/dgen.module';
import { CommonModule } from './modules/common/common.module';

const envPath = path.resolve(process.cwd() + '/../');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${envPath}/.env` }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.MSSQL_HOST,
      port: parseInt(process.env.MSSQL_PORT),
      database: process.env.MSSQL_DB,
      username: process.env.MSSQL_SA_USER,
      password: process.env.MSSQL_SA_PASSWORD,
      options: { encrypt: process.env.MSSQL_ENCRYPT === 'true', useUTC: true },
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: false, // This changes the DB schema to match changes to entities, which we might not want.
      logging: false,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CacheModule.register({
      max: 50, //Max cache items in store. Revisit the number when required.
      ttl: 0, // disable expiration of the cache.
      isGlobal: true, // Allows access to cache manager globally.
    }),
    CommonModule,
    AuthModule,
    DmsModule,
    DgenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {}

  async onApplicationBootstrap() {
    await this.appService.initializeCache().catch((err) => {
      console.error('Cache initialization failed:', err);
    });
  }
}
