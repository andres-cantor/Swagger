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

export const auth = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (token !== VALID_TOKEN) {
        return res.status(403).json({ message: "No autorizado" });
    }
    next();
};

// Un middleware es un filtro antes de llegar al endpoint



