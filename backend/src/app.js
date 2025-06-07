const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Allow only requests from react app
const corsOptions = {
    origin: 'http://localhost:3000', // TODO: Update with the actual React app URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
};

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use centralized routes
app.use('/api', routes);

module.exports = app;