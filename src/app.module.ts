import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { CloudinaryService } from './services/cloudinary.service';
import { ProductsGrpcController } from './controllers/gRPC.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/censudex-products'),
  ],
  controllers: [ProductsController, AppController, ProductsGrpcController],
  providers: [AppService, ProductsService, CloudinaryService],
})
export class AppModule {}
