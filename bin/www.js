const http = require('http');
const app = require('../app');

const host = 'localhost';
const port = 3000;

app.set('port',port);

const server = http.createServer(app);

server.listen(app.get('port'), () => {
    console.log(`Server running at http://${host}:${port}`);
});

process.on('SIGINT', () => {
    console.log('Initiating server shutdown. . .');
    server.close(() => {
        console.log("Server successful shutdown.");
    });
});