import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/censudex-products';
    
    const connection = await mongoose.connect(mongoURI, {
      // Opciones adicionales para MongoDB
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB conectado exitosamente');

    // Usar la conexión retornada en lugar de mongoose.connection
    connection.connection.on('error', (error) => {
      console.error('Error de conexión a MongoDB:', error);
    });

    connection.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

    connection.connection.on('reconnected', () => {
      console.log('MongoDB reconectado');
    });

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;