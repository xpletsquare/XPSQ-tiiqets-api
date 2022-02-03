import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG } from './config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tickets API For XPSQ')
    .setVersion('1.0')
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1/api');
  app.enableCors();

  await app.listen(CONFIG.PORT);
  logger.log(`APPLICATION STARTED ON PORT ${CONFIG.PORT}`)
}

bootstrap();
