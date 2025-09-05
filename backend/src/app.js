const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const env = require('./config/env');
const errorHandler = require('./middleware/error-handler');

const app = express();

// Allow only requests from react app
const corsOptions = {
    origin: env.frontend.url,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send(`DreamJob API ${env.apiPrefix}`);
});

// Use centralized routes
app.use(`${env.apiPrefix}/${env.apiVersion}`, routes);

// Error handling middleware
// This should be the last middleware in the stack
app.use(errorHandler);

module.exports = app;