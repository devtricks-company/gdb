import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 5600;
  const host = configService.get<string>('host') || 'localhost';
  await app.listen(port,host);
  console.log(`Application is running on: ${host} ${port}`)
}
bootstrap();
