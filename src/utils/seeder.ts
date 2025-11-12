import 'dotenv/config';
import connectDB from 'src/utils/db';
import { ProductModel } from 'src/models/products.model';
import mongoose from 'mongoose';

const sampleProducts = [
  {
    name: 'Auriculares Inalámbricos X1',
    description: 'Auriculares bluetooth con cancelación de ruido',
    price: 5900.99,
    category: 'Electrónica',
    imageUrl: '',
    imagePublicId: '',
    isActive: true,
  },
  {
    name: 'Cargador USB-C 65W',
    description: 'Cargador rápido para laptops y móviles',
    price: 2900.99,
    category: 'Accesorios',
    imageUrl: '',
    imagePublicId: '',
    isActive: true,
  },
  {
    name: 'Teclado Mecánico TKL',
    description: 'Teclado compacto con switches táctiles',
    price: 89000.99,
    category: 'Periféricos',
    imageUrl: '',
    imagePublicId: '',
    isActive: true,
  },
];

async function run() {
  try {
    await connectDB();

    const shouldDrop = process.argv.includes('--drop');

    if (shouldDrop) {
      console.log('Limpiando colección products...');
      await ProductModel.deleteMany({});
      console.log('Colección limpiada.');
    }

    console.log('Insertando productos de ejemplo...');
    const result = await ProductModel.insertMany(sampleProducts, { ordered: false });
    console.log(`Insertados ${result.length} productos.`);

  } catch (err) {
    console.error('Error en el seeder:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();