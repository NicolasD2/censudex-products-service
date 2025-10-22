const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  try {
    console.log('🔍 Probando conexión a Cloudinary...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Configurado' : '❌ No configurado');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurado' : '❌ No configurado');
    
    // Verificar configuración
    const config = cloudinary.config();
    console.log('📋 Configuración cargada:', {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? 'Configurado' : 'No configurado',
      api_secret: config.api_secret ? 'Configurado' : 'No configurado'
    });
    
    // Test de conexión con más detalles
    console.log('🌐 Intentando conectar...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary conectado exitosamente:', result);
    
    // Test de subida simple
    console.log('📤 Probando subida de imagen...');
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'test',
      public_id: 'test-connection-' + Date.now()
    });
    
    console.log('✅ Imagen subida exitosamente:');
    console.log('   - URL:', uploadResult.secure_url);
    console.log('   - Public ID:', uploadResult.public_id);
    
    // Limpiar - eliminar imagen de prueba
    console.log('🗑️ Eliminando imagen de prueba...');
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Imagen de prueba eliminada');
    
  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Mensaje:', error.message);
    console.error('❌ Código HTTP:', error.http_code);
    console.error('❌ Stack:', error.stack);
    
    if (error.http_code === 401) {
      console.error('🔑 Error de autenticación - Verifica tus credenciales');
    } else if (error.http_code === 400) {
      console.error('📝 Error de solicitud - Verifica el formato de datos');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Error de conectividad - Verifica tu conexión a internet');
    }
  }
}

testCloudinary();