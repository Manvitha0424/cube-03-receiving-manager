/**
 * Tenant Validation Middleware
 * 
 * IMPORTANT: The exact Round 3 tenant field name is still unknown.
 * We are using a temporary convention `x-tenant-id` header or `tenant` body field
 * for local development. The allowed tenant is read ONLY from the ALLOWED_TENANT
 * environment variable.
 */
module.exports = (req, res, next) => {
    const allowedTenant = process.env.ALLOWED_TENANT;
    
    if (!allowedTenant) {
        return res.status(500).json({ error: 'Server configuration error: missing ALLOWED_TENANT.' });
    }

    const providedTenant = req.headers['x-tenant-id'] || req.body.tenant;

    if (!providedTenant) {
        return res.status(400).json({ error: 'Bad Request: Missing tenant identifier.' });
    }

    if (providedTenant !== allowedTenant) {
        return res.status(403).json({ error: 'Forbidden: Tenant not allowed.' });
    }

    // Attach tenant to request for downstream use
    req.tenant = providedTenant;
    next();
};
