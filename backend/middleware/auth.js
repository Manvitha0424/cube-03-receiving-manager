/**
 * Authentication Middleware
 * 
 * IMPORTANT: The final Round 3 authentication header name is NOT known yet.
 * We are using a temporary convention `Authorization` with `Bearer <secret>`
 * for local development. The secret is read ONLY from the RECEIVING_API_SECRET
 * environment variable.
 */
module.exports = (req, res, next) => {
    // Exclude /health endpoint from auth if needed, but router normally handles this.
    
    const secret = process.env.RECEIVING_API_SECRET;
    
    // If no secret is configured on the server, we might reject or allow depending on env.
    // For safety, let's require it to be set.
    if (!secret) {
        return res.status(500).json({ error: 'Server configuration error: missing API secret.' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication header.' });
    }

    const token = authHeader.split(' ')[1];
    if (token !== secret) {
        return res.status(401).json({ error: 'Unauthorized: Invalid credentials.' });
    }

    next();
};
