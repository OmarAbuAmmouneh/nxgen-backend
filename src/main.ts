import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',  // Allows all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allows all standard methods
    allowedHeaders: 'Content-Type, Authorization',  // Allows all standard headers
    credentials: false,  // Disables credentials (cookies or authorization headers)
  });
  await app.listen(4000);
}
bootstrap();
