const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const env = require('./config/env');

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

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use centralized routes
app.use(env.apiPrefix, routes);

module.exports = app;