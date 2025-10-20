import { ProductsController } from "src/controllers/products.controller";
import { ProductsService } from "src/services/products.service";

export default {
    controllers: [ProductsController],
    providers: [ProductsService],
};
