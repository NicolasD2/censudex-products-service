const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Cargar el archivo proto
const PROTO_PATH = path.join(__dirname, 'proto/products.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productsProto = grpc.loadPackageDefinition(packageDefinition).products;

// Crear cliente
const client = new productsProto.ProductsService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

console.log('🔧 Cliente gRPC configurado, probando conexión...');

// Test 1: Obtener productos
console.log('\n📋 Test 1: Obtener productos');
client.GetProducts({ limit: 10, offset: 0 }, (error, response) => {
  if (error) {
    console.error('❌ Error obteniendo productos:', error.message);
  } else {
    console.log('✅ Productos obtenidos:', {
      total: response.total,
      productos_encontrados: response.products.length
    });
    response.products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });
  }
});

// Test 2: Crear producto
console.log('\n📝 Test 2: Crear producto');
const newProduct = {
  name: 'Producto gRPC Test',
  description: 'Producto creado via gRPC para pruebas',
  price: 99.99,
  category: 'tecnologia'
};

client.CreateProduct(newProduct, (error, response) => {
  if (error) {
    console.error('❌ Error creando producto:', error.message);
  } else {
    console.log('✅ Producto creado via gRPC:', {
      id: response.id,
      name: response.name,
      price: response.price
    });

    // Test 3: Obtener el producto creado
    console.log('\n🔍 Test 3: Obtener producto específico');
    client.GetProduct({ id: response.id }, (error, product) => {
      if (error) {
        console.error('❌ Error obteniendo producto:', error.message);
      } else {
        console.log('✅ Producto obtenido:', {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price
        });
      }
    });

    // Test 4: Actualizar producto
    setTimeout(() => {
      console.log('\n✏️ Test 4: Actualizar producto');
      client.UpdateProduct({
        id: response.id,
        name: 'Producto gRPC ACTUALIZADO',
        price: 149.99
      }, (error, updatedProduct) => {
        if (error) {
          console.error('❌ Error actualizando producto:', error.message);
        } else {
          console.log('✅ Producto actualizado:', {
            id: updatedProduct.id,
            name: updatedProduct.name,
            price: updatedProduct.price
          });
        }
      });
    }, 1000);

    // Test 5: Eliminar producto (soft delete)
    setTimeout(() => {
      console.log('\n🗑️ Test 5: Eliminar producto');
      client.DeleteProduct({ id: response.id }, (error, result) => {
        if (error) {
          console.error('❌ Error eliminando producto:', error.message);
        } else {
          console.log('✅ Resultado eliminación:', result);
        }
      });
    }, 2000);
  }
});

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando cliente gRPC...');
  process.exit(0);
});