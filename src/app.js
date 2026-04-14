import express from "express";
import productRoutes from "./Routes/product.routes.js";
import authRoutes from "./Routes/auth.routes.js";

//swagger
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app = express();

//permite recibir JSON
app.use(express.json());

const VALID_TOKEN = "ABC123";

const parseCookieHeader = (cookieHeader) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((cookies, part) => {
        const [name, ...rest] = part.trim().split('=');
        cookies[name] = decodeURIComponent(rest.join('='));
        return cookies;
    }, {});
};

const getTokenFromRequest = (req) => {
    let token = req.headers.authorization || "";
    if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
        token = token.slice(7).trim();
    }
    if (!token && req.headers.cookie) {
        const cookies = parseCookieHeader(req.headers.cookie);
        token = cookies.authToken || "";
    }
    return token;
};

const requireLogin = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (token !== VALID_TOKEN) {
        return res.redirect('/login');
    }
    next();
};

// swagger config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node API - Backend1",
            version: "1.0.0",
            description: "API REST para gestión de productos con autenticación segura",
            contact: {
                name: "API Support",
                url: "http://localhost:3000"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de desarrollo"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "simple"
                }
            }
        }
    },
    apis: ["./src/Routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(options);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Información del proyecto
 *     description: Retorna información del proyecto y documentación de la API
 *     tags:
 *       - Info
 *     responses:
 *       200:
 *         description: Información del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

// Ruta raíz - Información del proyecto (HTML)
app.get("/", requireLogin, (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Backend1 - API REST</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                width: 100%;
            }
            .header {
                text-align: center;
                color: white;
                margin-bottom: 40px;
            }
            .header h1 {
                font-size: 3em;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .header p {
                font-size: 1.2em;
                margin-bottom: 5px;
                opacity: 0.9;
            }
            .version {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
                margin-top: 10px;
            }
            .content {
                background: white;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .description {
                font-size: 1.1em;
                color: #333;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .section {
                margin-bottom: 40px;
            }
            .section h2 {
                color: #667eea;
                margin-bottom: 20px;
                font-size: 1.8em;
                border-bottom: 3px solid #667eea;
                padding-bottom: 10px;
            }
            .endpoints {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }
            .endpoint-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }
            .endpoint-method {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 5px;
                font-weight: bold;
                color: white;
                margin-bottom: 10px;
                font-size: 0.9em;
            }
            .get { background: #61affe; }
            .post { background: #49cc90; }
            .endpoint-path {
                font-family: 'Courier New', monospace;
                font-size: 0.95em;
                color: #333;
                margin-bottom: 5px;
            }
            .endpoint-desc {
                font-size: 0.9em;
                color: #666;
            }
            .credentials {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }
            .credential-box {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border: 2px solid #e9ecef;
            }
            .credential-user {
                font-weight: bold;
                color: #667eea;
                margin-bottom: 8px;
                font-size: 1.1em;
            }
            .credential-item {
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #333;
                margin: 5px 0;
            }
            .token-box {
                background: #fff3cd;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #ffc107;
                margin: 20px 0;
            }
            .token-label {
                font-weight: bold;
                color: #856404;
                margin-bottom: 8px;
            }
            .token-value {
                font-family: 'Courier New', monospace;
                background: white;
                padding: 10px;
                border-radius: 5px;
                color: #333;
                word-break: break-all;
            }
            .buttons {
                display: flex;
                gap: 15px;
                margin-top: 30px;
                flex-wrap: wrap;
            }
            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                font-size: 1em;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                transition: all 0.3s ease;
                text-align: center;
            }
            .btn-docs {
                background: #667eea;
                color: white;
            }
            .btn-docs:hover {
                background: #5568d3;
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            .btn-login {
                background: #28a745;
                color: white;
            }
            .btn-login:hover {
                background: #218838;
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
            }
            .btn-json {
                background: #764ba2;
                color: white;
            }
            .btn-json:hover {
                background: #653a94;
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(118, 75, 162, 0.3);
            }
            .info-note {
                background: #d1ecf1;
                border: 1px solid #bee5eb;
                border-radius: 8px;
                padding: 15px;
                color: #0c5460;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                color: white;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }
            @media (max-width: 768px) {
                .header h1 {
                    font-size: 2em;
                }
                .content {
                    padding: 20px;
                }
                .endpoints {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Backend1</h1>
                <p>API REST para gestión de productos con autenticación segura</p>
                <div class="version">v1.0.0</div>
            </div>

            <div class="content">
                <div class="description">
                    Bienvenido a Backend1, una API moderna y segura para gestionar productos.
                    Esta API proporciona autenticación mejorada, documentación interactiva y endpoints completamente documentados.
                </div>

                <!-- ENDPOINTS -->
                <div class="section">
                    <h2>📚 Endpoints Disponibles</h2>
                    
                    <h3 style="color: #764ba2; margin-bottom: 15px;">Autenticación</h3>
                    <div class="endpoints">
                        <div class="endpoint-card">
                            <div class="endpoint-method post">POST</div>
                            <div class="endpoint-path">/api/auth/hidden-login</div>
                            <div class="endpoint-desc">Login oculto - Obtener token de autenticación</div>
                        </div>
                        <div class="endpoint-card">
                            <div class="endpoint-method post">POST</div>
                            <div class="endpoint-path">/api/auth/validate-token</div>
                            <div class="endpoint-desc">Validar si un token es correcto</div>
                        </div>
                    </div>

                    <h3 style="color: #764ba2; margin-bottom: 15px;">Productos</h3>
                    <div class="endpoints">
                        <div class="endpoint-card">
                            <div class="endpoint-method get">GET</div>
                            <div class="endpoint-path">/api/products</div>
                            <div class="endpoint-desc">Obtener todos los productos</div>
                        </div>
                        <div class="endpoint-card">
                            <div class="endpoint-method get">GET</div>
                            <div class="endpoint-path">/api/products/:id</div>
                            <div class="endpoint-desc">Obtener un producto por ID</div>
                        </div>
                        <div class="endpoint-card">
                            <div class="endpoint-method post">POST</div>
                            <div class="endpoint-path">/api/products</div>
                            <div class="endpoint-desc">Crear un nuevo producto (requiere autenticación)</div>
                        </div>
                    </div>
                </div>

                <!-- BOTONES DE ACCIÓN -->
                <div class="buttons">
                    <a href="http://localhost:3000/login" class="btn btn-login">
                        🔐 Ir al Login
                    </a>
                    <a href="http://localhost:3000/docs" class="btn btn-docs">
                        📖 Ver Documentación Swagger
                    </a>
                    <a href="http://localhost:3000/api/info" class="btn btn-json">
                        📊 Ver JSON
                    </a>
                </div>

                <!-- FOOTER -->
                <div class="footer">
                    <p>Backend1 API • Desarrollado con Node.js y Express</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Documentación: http://localhost:3000/docs</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(html);
});

// Página de Login Visual
app.get("/login", (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Backend1 API</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .login-container {
                background: white;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 100%;
            }
            .login-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .login-header h1 {
                color: #667eea;
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            .login-header p {
                color: #666;
                font-size: 0.95em;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 600;
                font-size: 0.95em;
            }
            .form-group input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1em;
                transition: border-color 0.3s;
                font-family: inherit;
            }
            .form-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            .form-group input::placeholder {
                color: #999;
            }
            .login-btn {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 10px;
            }
            .login-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            .login-btn:active {
                transform: translateY(0);
            }
            .demo-creds {
                background: #f0f4ff;
                padding: 15px;
                border-radius: 8px;
                margin-top: 25px;
                border-left: 4px solid #667eea;
            }
            .demo-creds h3 {
                color: #667eea;
                font-size: 0.95em;
                margin-bottom: 10px;
            }
            .demo-item {
                font-size: 0.9em;
                color: #333;
                margin: 5px 0;
                padding: 5px;
                background: white;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
            }
            .demo-label {
                color: #667eea;
                font-weight: 600;
            }
            .message {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                display: none;
                font-size: 0.95em;
            }
            .message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
                display: block;
            }
            .message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
                display: block;
            }
            .back-link {
                text-align: center;
                margin-top: 20px;
            }
            .back-link a {
                color: #667eea;
                text-decoration: none;
                font-size: 0.95em;
                transition: color 0.3s;
            }
            .back-link a:hover {
                color: #764ba2;
            }
            .loader {
                display: none;
                width: 20px;
                height: 20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="login-header">
                <h1>🚀</h1>
                <h2 style="color: #333; font-size: 1.8em;">Backend1 Login</h2>
                <p>API de Gestión de Productos</p>
            </div>

            <div id="message" class="message"></div>

            <form id="loginForm">
                <div class="form-group">
                    <label for="name">Usuario</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="Ingresa tu usuario"
                        required
                        minlength="3"
                        maxlength="20"
                    >
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Ingresa tu contraseña"
                        required
                        minlength="6"
                        maxlength="30"
                    >
                </div>

                <button type="submit" class="login-btn">
                    Iniciar Sesión
                </button>
            </form>

            <div class="demo-creds">
                <h3>📋 Credenciales de Demo</h3>
                <div class="demo-item">
                    <span class="demo-label">Admin:</span> admin / admin123
                </div>
                <div class="demo-item">
                    <span class="demo-label">User:</span> user / user123
                </div>
            </div>
        </div>

        <script>
            const form = document.getElementById('loginForm');
            const messageDiv = document.getElementById('message');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = document.getElementById('name').value.trim();
                const password = document.getElementById('password').value;

                // Validar
                if (!name || !password) {
                    showMessage('Por favor completa todos los campos', 'error');
                    return;
                }

                const btn = form.querySelector('button');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = '⏳ Procesando...';

                try {
                    const response = await fetch('http://localhost:3000/api/auth/hidden-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showMessage('✅ Login exitoso! Token: ' + data.token, 'success');
                        
                        // Guardar token en localStorage y cookie para proteger el home
                        localStorage.setItem('authToken', data.token);
                        localStorage.setItem('username', data.user);
                        document.cookie = 'authToken=' + data.token + '; path=/; max-age=3600';

                        // Limpiar formulario
                        form.reset();

                        // Redirigir después de 2 segundos
                        setTimeout(() => {
                            window.location.href = 'http://localhost:3000/';
                        }, 2000);
                    } else {
                        showMessage(data.message || 'Error en el login', 'error');
                    }
                } catch (error) {
                    showMessage('Error de conexión: ' + error.message, 'error');
                } finally {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            });

            function showMessage(text, type) {
                messageDiv.textContent = text;
                messageDiv.className = 'message ' + type;
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Cargar token guardado si existe
            window.addEventListener('load', () => {
                const token = localStorage.getItem('authToken');
                if (token) {
                    document.getElementById('name').value = localStorage.getItem('username') || '';
                }
            });
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// Ruta API info - JSON
app.get("/api/info", requireLogin, (req, res) => {
    res.json({
        project: "Backend1 - API REST",
        version: "1.0.0",
        description: "API de gestión de productos con autenticación",
        documentation: "http://localhost:3000/docs",
        endpoints: {
            products: {
                getAllProducts: "GET /api/products",
                getProductById: "GET /api/products/:id",
                createProduct: "POST /api/products (requiere autenticación)"
            },
            auth: {
                login: "POST /api/auth/hidden-login",
                validateToken: "POST /api/auth/validate-token"
            }
        },
        defaultCredentials: {
            message: "Credenciales por defecto para testing",
            admin: {
                username: "admin",
                password: "admin123"
            },
            user: {
                username: "user",
                password: "user123"
            }
        },
        authToken: "ABC123",
        note: "Para acceder al login oculto, usa POST /api/auth/hidden-login con name y password"
    });
});

// Rutas principales
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Swagger UI - Documentación ejecutable
app.use("/docs", requireLogin, swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export default app;

