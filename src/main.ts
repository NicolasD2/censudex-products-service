import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import connectDB from './utils/db';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path/win32';


async function bootstrap() {

  dotenv.config();

  await connectDB();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true, forbidNonWhitelisted: true}));

  const grpcPort = process.env.GRPC_PORT || '50051';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'products',
      protoPath: join(process.cwd(), 'proto', 'products.proto'),
      url: `localhost:${grpcPort}`,
    },
  });

  await app.startAllMicroservices();
  console.log(`gRPC Microservice is running on port ${grpcPort}`);


  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
