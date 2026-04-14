# Asincronos
- Node no se queda esperando respuestas... sigue trabajando

console.log("Inicio")

setTimeout(() =>{
    console.log("Respuesta del servidor");
}, 2000);

console.log("Fin");

- Inicio
- Fin
- Respuesta

# No bloqueante 
- Node puede atender muchas peticiones al mismo tiempo
- Ideal para conectar con APIs + React

# NPM
- express -> Esto descarga codigo base listo para usar

# Estructura importante de un proyecto con NODE
- node_modules
- package.json
- servidor.js

# correr
- node server.js

# Estructura
- una API separa responsabilidades
-src
  -server.js
  - app.js
  -Routes/
    -product.routes.js
  -controllers/
    -product.controller.js
  -middlewares/
    -auth.middleware.js
  - data/
  -products.js
  -package.jsan