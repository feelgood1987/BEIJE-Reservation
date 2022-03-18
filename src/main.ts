import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // This line added to config custom validator for reservation start time format validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Add Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Call Reservation')
    .setDescription('API endpoints for call reservation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(3000);
}
bootstrap();
