import * as mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/censudex-products';
    
    await mongoose.connect(mongoURI)

    console.log('MongoDB conectado exitosamente');

    mongoose.connection.on('error', (error) => {
      console.error('Error de conexión a MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconectado');
    });

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};


export default connectDB;