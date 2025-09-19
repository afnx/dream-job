const env = require('./config/env');
const app = require('./app');

app.listen(env.port, () => {
    if (env.env === 'dev') {
        // eslint-disable-next-line no-console
        console.log(`Server is running on port ${env.port}`);
    }
});