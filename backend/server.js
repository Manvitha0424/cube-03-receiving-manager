const express = require('express');
const path = require('path');

// Middleware
const authMiddleware = require('./middleware/auth');
const tenantMiddleware = require('./middleware/tenant');

// Controllers
const runController = require('./controllers/runController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Public Health endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Receiving Manager is healthy.' });
});

// Protected Run endpoint
app.post('/run', authMiddleware, tenantMiddleware, runController.runInspection);

app.listen(PORT, () => {
    console.log(`Server is running locally at http://localhost:${PORT}`);
});
