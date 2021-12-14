import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV_KEYS } from './keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ENV_KEYS.PORT);
  console.log(`APPLICATION STARTED ON PORT ${ENV_KEYS.PORT}`)
}

bootstrap();
