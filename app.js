const express = require('express');
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/buck', (req, res) => res.send('Buck is amazing!'));

const server = app.listen(3000, () => console.log('Example app listening on port 3000!'));

const shutdownManager = new GracefulShutdownManager(server);

process.on('SIGTERM', () => {
    shutdownManager.terminate(() => {
        console.log('Server is gracefully terminated');
    });
});

//luke's comment
