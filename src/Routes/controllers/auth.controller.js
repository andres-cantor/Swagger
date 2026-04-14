// Credenciales predefinidas para el login oculto
const VALID_USERS = {
    "admin": "admin123",
    "user": "user123"
};

const VALID_TOKEN = "123ABC";

// Contador de intentos fallidos (seguridad básica)
const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 1000; // 1 minuto en milisegundos

/**
 * Verificar si una IP está bloqueada por intentos fallidos
 */
const isLockedOut = (ip) => {
    if (!loginAttempts[ip]) return false;
    const { count, lockedUntil } = loginAttempts[ip];
    
    if (count >= MAX_ATTEMPTS) {
        const now = Date.now();
        if (now < lockedUntil) {
            return true;
        } else {
            // Desbloquear después del tiempo
            delete loginAttempts[ip];
            return false;
        }
    }
    return false;
};

/**
 * Registrar intento fallido
 */
const recordFailedAttempt = (ip) => {
    if (!loginAttempts[ip]) {
        loginAttempts[ip] = { count: 0, lockedUntil: 0 };
    }
    loginAttempts[ip].count++;
    loginAttempts[ip].lockedUntil = Date.now() + LOCK_TIME;
};

/**
 * Limpiar intentos fallidos en login exitoso
 */
const clearAttempts = (ip) => {
    delete loginAttempts[ip];
};

/**
 * Login oculto - Genera un token si las credenciales son válidas
 */
export const hiddenLogin = (req, res) => {
    const { name, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Verificar si el cliente está bloqueado
    if (isLockedOut(clientIp)) {
        return res.status(429).json({
            message: "Demasiados intentos fallidos. Intenta más tarde.",
            retryAfter: 900 // 15 minutos en segundos
        });
    }

    // Validar que los campos no estén vacíos
    if (!name || !password) {
        recordFailedAttempt(clientIp);
        return res.status(400).json({
            message: "El nombre y la contraseña son requeridos",
            code: "MISSING_FIELDS"
        });
    }

    // Validar tipo de datos
    if (typeof name !== 'string' || typeof password !== 'string') {
        recordFailedAttempt(clientIp);
        return res.status(400).json({
            message: "El nombre y la contraseña deben ser texto",
            code: "INVALID_TYPE"
        });
    }

    // Validar longitud
    if (name.length < 3 || name.length > 20 || password.length < 6 || password.length > 30) {
        recordFailedAttempt(clientIp);
        return res.status(400).json({
            message: "El nombre debe tener 3-20 caracteres y la contraseña 6-30",
            code: "INVALID_LENGTH"
        });
    }

    // Validar credenciales
    if (VALID_USERS[name] === password) {
        clearAttempts(clientIp);
        return res.status(200).json({
            message: "Login exitoso",
            token: VALID_TOKEN,
            user: name,
            expiresIn: 3600 // 1 hora en segundos
        });
    }

    // Registrar intento fallido
    recordFailedAttempt(clientIp);
    const remainingAttempts = MAX_ATTEMPTS - loginAttempts[clientIp].count;

    return res.status(401).json({
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
        remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
    });
};

/**
 * Validar si un token es correcto
 */
export const validateToken = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            message: "El token es requerido",
            code: "MISSING_TOKEN"
        });
    }

    if (typeof token !== 'string') {
        return res.status(400).json({
            message: "El token debe ser texto",
            code: "INVALID_TYPE"
        });
    }

    if (token === VALID_TOKEN) {
        return res.status(200).json({
            message: "Token válido",
            authorized: true,
            expiresIn: 3600
        });
    }

    return res.status(403).json({
        message: "Token inválido",
        code: "INVALID_TOKEN",
        authorized: false
    });
};
