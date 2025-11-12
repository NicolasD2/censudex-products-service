 
 # Censudex Products Service
 
 Servicio para manejo de productos usando NestJS, MongoDB, Cloudinary y gRPC.
 
 ## Descripción
 
 Proyecto que expone una API REST y un microservicio gRPC para operaciones CRUD sobre productos. Incluye integración con Cloudinary para subir imágenes y un seeder para insertar datos de ejemplo.
 
 ## Requisitos
 
 - Node.js 18+ (o LTS que uses)
 - npm o pnpm
 - MongoDB Atlas (o instancia MongoDB accesible)
 - Cuenta de Cloudinary si quieres probar subida de imágenes
 - Postman (para probar gRPC) o grpcurl/evans
 
 ## Estructura principal
 
 - `src/` - Código fuente
   - `controllers/` - Controladores REST y gRPC
   - `services/` - Servicios (productos, cloudinary)
   - `models/` - Mongoose models
   - `routes/` - Agrupación de controllers/providers
   - `utils/` - Utilidades (db, seeder, guards)
 - `proto/` - Archivos .proto para gRPC
 - `test/` - Tests
 
 ## Variables de entorno
 
 Crea un archivo `.env` en la raíz con las siguientes variables (ejemplo):
 
 ```env
 # Database
 MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
 
 # JWT
 JWT_SECRET=your-secret-key-here
 
 # Cloudinary
 CLOUDINARY_CLOUD_NAME=your_cloud_name
 CLOUDINARY_API_KEY=your_api_key
 CLOUDINARY_API_SECRET=your_api_secret
 
 # Server
 PORT=3000
 NODE_ENV=development
 
 # CORS
 CORS_ORIGIN=http://localhost:3000
 
 # gRPC (optional)
 GRPC_PORT=50051
 ```
 
 
 ## Instalación
 
 ```bash
 npm install
 ```
 
 Si usas `ts-node` durante desarrollo, instala las dependencias de desarrollo si no existen:
 
 ```bash
 npm i -D ts-node tsconfig-paths
 ```
 
 ## Scripts útiles
 
 - `npm run start:dev` - Ejecutar en modo desarrollo (con watch)
 - `npm run build` - Compilar a `dist/`
 - `npm run start` - Ejecutar build
 - `npm run seed:dev` - Ejecutar el seeder (no borra)
 - `npm run seed:dev:drop` - Ejecutar el seeder y limpiar la colección antes
 - `npm run test` - Ejecutar tests
 
 ## Seeder (src/utils/seeder.ts)
 
 Ya incluido en `src/utils/seeder.ts`. Puedes ejecutarlo con:
 
 ```powershell
 npx ts-node -r tsconfig-paths/register src/utils/seeder.ts
 # o con limpieza previa
 npx ts-node -r tsconfig-paths/register src/utils/seeder.ts --drop
 ```
 
 El seeder inserta productos de ejemplo en la colección `products`. Asegúrate de que `MONGODB_URI` en `.env` sea correcto.
 
 ## gRPC
 
 El microservicio gRPC corre en el puerto definido en `GRPC_PORT` (por defecto `50051`).
 
 - Archivo proto: `proto/products.proto`
 - Para probar con Postman:
   - Importa el `.proto` en Postman
   - Crea una `gRPC Request` apuntando a `localhost:50051`
   - Invoca los métodos definidos (GetProducts, GetProduct, CreateProduct, UpdateProduct, etc.)
 
 Ejemplo JSON para `CreateProduct` (ajusta según tu `.proto`):
 
 ```json

 ```
 
 Nota: usa `GetProducts` primero para obtener IDs válidos que puedas usar en `GetProduct`/`UpdateProduct`.
 
 ## Cloudinary
 
 Credenciales en `.env`. `src/services/cloudinary.service.ts` maneja la subida y devuelve `secure_url` y `public_id`.

Pasos para configurar Cloudinary:

1. Crea una cuenta en https://cloudinary.com/ y verifica tu email.
2. En el Dashboard copia los valores de `Cloud name`, `API Key` y `API Secret`.
3. Añade estas variables a tu `.env`:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. El proyecto ya incluye un servicio (`src/services/cloudinary.service.ts`) que lee estas variables. Para verificar localmente puedes subir una imagen con `curl` o Postman:

Ejemplo `curl` (multipart/form-data):

```bash
curl -X POST "http://localhost:3000/products/create" \
  -F "name=Producto desde curl" \
  -F "price=9.99" \
  -F "category=Test" \
  -F "image=@/ruta/a/tu/imagen.jpg"
```

En Postman selecciona `Body` → `form-data`, añade los campos `name`, `price`, `category`, etc. y un campo tipo `File` con el nombre `image` o el que use tu endpoint.

## Probar endpoints en Postman

A continuación instrucciones prácticas para probar tanto la API REST como gRPC desde Postman.

1) Probar REST endpoints

- Importante: arranca la app (`npm run start:dev`) y verifica `PORT` en `.env` (por defecto `3000`).
- Abrir Postman y crear una nueva request o colección.

- GET all products

  - Método: GET
  - URL: `http://localhost:3000/products/get_all`

- GET product por id

  - Método: GET
  - URL: `http://localhost:3000/products/find/{{id}}`
  - Reemplaza `{{id}}` por el _id_ devuelto por `get_all`.

- Crear producto (con imagen)

  - Método: POST
  - URL: `http://localhost:3000/products/create`
  - Body → `form-data` (multipart):
    - key: `name` (Text)
    - key: `price` (Text/Number)
    - key: `category` (Text)
    - key: `description` (Text)
    - key: `image` (File) ← selecciona archivo de imagen

  - Envía y revisa la respuesta; el servicio debe devolver el producto creado y la URL de Cloudinary si la subida fue exitosa.

- Actualizar producto

  - Método: PATCH
  - URL: `http://localhost:3000/products/edit/{{id}}`
  - Body: `application/json` con los campos a actualizar, por ejemplo:

```json
{
  "name": "Nombre actualizado",
  "price": 29.99
}
```

-- Eliminar (soft delete según implementación)

  - Método: DELETE
  - URL: `http://localhost:3000/products/delete/{{id}}`

2) Probar gRPC desde Postman

- Abrir Postman → New → gRPC Request.
- Endpoint: `localhost:50051` (sin TLS para desarrollo salvo que lo configures).
- En la sección `Proto definition` importa `proto/products.proto` desde el proyecto.
- Selecciona el servicio y método (por ejemplo `Products/GetProducts`, `Products/GetProduct`, `Products/CreateProduct`).

Ejemplo message para `CreateProduct` (ajusta campos según `proto`):

```json
{
  "name": "Producto gRPC",
  "price": 12.5,
  "category": "Prueba",
  "description": "Creado desde Postman gRPC",
}
```

- Haz `Invoke` y revisa la respuesta; si usas `GetProducts` primero obtendrás IDs para `GetProduct`/`UpdateProduct`.

Consejos:

- Si tu API requiere autenticación (JWT), añade `Authorization: Bearer <token>` en los headers para las requests REST. Para gRPC añade metadata con la clave `authorization` y valor `Bearer <token>` si el servicio lo soporta.
- Puedes guardar las requests en una Collection y exportarla para compartir.

 
 ## Troubleshooting - MongoDB DNS (ETIMEDOUT / queryTxt)
 
 Si ves errores como:
 
 ```
 Error: queryTxt ETIMEOUT <cluster>.mongodb.net
 ```
 
 Significa que la resolución DNS de registros TXT/SRV falla en tu red. Opciones:
 
 1. Cambiar DNS del adaptador (temporal) a Google/Cloudflare:
 
 ```powershell
 # Ver interfaces
 netsh interface show interface
 
 # Establecer DNS primario (Google) y secundario (Cloudflare)
 netsh interface ip set dns name="Wi-Fi" static 8.8.8.8
 netsh interface ip add dns name="Wi-Fi" 1.1.1.1 index=2
 ```
 
 O con PowerShell:
 
 ```powershell
 Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses ("8.8.8.8","1.1.1.1")
 ```
 
 2. Usar la cadena de conexión _standard_ (no SRV) que Atlas proporciona en "Connect" → "Standard connection string" y pegarla en `.env`.
 
 3. Aumentar `serverSelectionTimeoutMS` en `src/utils/db.ts` y forzar `family: 4` (IPv4) para evitar problemas IPv6/DNS.
 
 4. En MongoDB Atlas → Network Access añade tu IP. Para conexiones móviles la IP cambia; para pruebas añade `0.0.0.0/0` temporalmente.
 
 ## Cómo probar la API REST
 
 - GET /products/get_all
 - GET /products/find/:id
 - POST /products/create (multipart/form-data para imágenes)
 - PATCH /products/edit/:id
 - DELETE /products/delete/:id
 
 Ejemplo body para crear producto (JSON):
 
 ```json

 ```
 
 ## Notas finales
 
 - Asegúrate de que las variables en `.env` son correctas.
 - No subas credenciales al repositorio.
 
