import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { customLogger } from './common/logger/logger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CorrelationIdInterceptor } from './common/interceptor/correlationId.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: customLogger,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tps Migration API')
      .setDescription(
        'TPS Migration API to migrate TPS pdf from database to S3. This API is responsible for pdf migration to S3. updating document details in ORBC Doument and Permit table. And deleting migrated pdf from TPS_MIGRATED_PERMTI table.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }
  app.useGlobalInterceptors(new CorrelationIdInterceptor());
  await app.listen(5050);
}
void bootstrap();
