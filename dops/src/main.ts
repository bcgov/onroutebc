import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.filter';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { customLogger } from './logger/logger.config';
import { CorrelationIdInterceptor } from './interceptor/correlationId.interceptor';
import * as responseTime from 'response-time';
import { CustomValidationPipe } from './pipe/custom-validation.pipe';

const allowedOrigins = [process.env.FRONTEND_URL];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: customLogger,
  });
  app.use(helmet());
  app.enableCors({
    origin: function (origin, callback) {
      if (
        (origin && allowedOrigins.includes(origin)) ||
        process.env.NODE_ENV !== 'production' ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    maxAge: 7200,
    credentials: false,
    exposedHeaders: ['Content-Disposition', 'x-correlation-id'],
  });
  app.useGlobalPipes(CustomValidationPipe);
  app.useBodyParser('json', { limit: '20mb' });

  app.use(responseTime());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('DOPS API')
      .setDescription('The Document Operations API description')
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
  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new CorrelationIdInterceptor());

  await app.listen(5001);
}
void bootstrap();
