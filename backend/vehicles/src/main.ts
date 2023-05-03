import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http.filter';
import { FallbackExceptionFilter } from './common/filters/fallback.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (e) => {
        throw new BadRequestException(e);
      },
      forbidUnknownValues: true,
      validationError: { target: true },
    }),
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Vehicles API')
    .setDescription('The vehicles API description')
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

  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
  );

  await app.listen(5000);
}
void bootstrap();
