import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import productsRoutes from './routes/products.routes';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/censudex-products'),
  ],
  controllers: [...productsRoutes.controllers, AppController],
  providers: [...productsRoutes.providers, AppService],
})
export class AppModule {}
