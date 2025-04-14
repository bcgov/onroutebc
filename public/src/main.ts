import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http.filter';
import { FallbackExceptionFilter } from './common/filters/fallback.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { customLogger } from './common/logger/logger.config';
import * as responseTime from 'response-time';
import { CustomValidationPipe } from './common/pipe/custom-validation.pipe';

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

  app.use(responseTime());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Public API')
      .setDescription('The public API description')
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

  await app.listen(5080);
}
void bootstrap();
