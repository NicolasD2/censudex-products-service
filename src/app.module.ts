import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import productsRoutes from './routes/products.routes';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [...productsRoutes.controllers, AppController],
  providers: [...productsRoutes.providers, AppService],
})
export class AppModule {}
