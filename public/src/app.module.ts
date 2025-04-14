import 'dotenv/config';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import * as path from 'path';
import { AppController } from './app.controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { HTTPLoggerMiddleware } from './common/middleware/req.res.logger';
import { TypeormCustomLogger } from './common/logger/typeorm-logger.config';
import { getTypeormLogLevel } from './common/helper/logger.helper';
import { ClsModule } from 'nestjs-cls';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OutageNotificationModule } from './modules/outage-notification/outage-notification.module';

const envPath = path.resolve(process.cwd() + '/../');

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${envPath}/.env` }),
    // Register the ClsModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => {
          const correlationId = req.headers['x-correlation-id'];
          return Array.isArray(correlationId)
            ? correlationId[0]
            : (correlationId ?? uuidv4());
        },
      },
    }),
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
        +process.env.PUBLIC_API_MAX_QUERY_EXECUTION_TIME_MS || 5000, //5 seconds by default
      logger: new TypeormCustomLogger(
        getTypeormLogLevel(process.env.PUBLIC_API_TYPEORM_LOG_LEVEL),
      ),
      pool: { max: +process.env.PUBLIC_API_MSSQL_MAX_CONNECTION || 10 },
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    OutageNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HTTPLoggerMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
