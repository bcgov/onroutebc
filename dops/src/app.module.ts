import 'dotenv/config';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
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
import { HTTPLoggerMiddleware } from './middleware/req.res.logger';
import { TypeormCustomLogger } from './logger/typeorm-logger.config';

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
      maxQueryExecutionTime:
        +process.env.DOPS_API_MAX_QUERY_EXECUTION_TIME_MS || 5000, //5 seconds by default
      logger: new TypeormCustomLogger(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        process.env.DOPS_API_TYPEORM_LOG_LEVEL
          ? JSON.parse(process.env.DOPS_API_TYPEORM_LOG_LEVEL)
          : ['error'],
      ),
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
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly appService: AppService) {}
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes('*');
  }
  async onApplicationBootstrap() {
    await this.appService.initializeCache().catch((err) => {
      this.logger.error('Cache initialization failed:', err);
    });
  }
}
