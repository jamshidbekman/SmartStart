import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') ?? 3000;
  console.log(PORT);
  await app.listen(PORT, () => {
    console.log('Server is running port', PORT);
  });
}
bootstrap();
