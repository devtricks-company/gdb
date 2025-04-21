import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {SwaggerModule,DocumentBuilder} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('GRADegy API')
    .setDescription('API documentation for the GRADegy platform')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    
    .addBearerAuth({ 
      type: 'http', 
      scheme: 'bearer', 
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    
    },
    'JWT-auth') //Add JWT authentication
    
    .build()


    const document = SwaggerModule.createDocument(app,config);
    SwaggerModule.setup('api/docs', app , document,{
      yamlDocumentUrl:'schema'
    })


  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 5600;
  const host = configService.get<string>('host') || 'localhost';
  await app.listen(port, host);
  console.log(`Application is running on: ${host} ${port}`);
}
bootstrap();
