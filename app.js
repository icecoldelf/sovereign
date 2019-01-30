const express = require('express');
//import React from 'react';
//import ReactDOM from 'react-dom';
const Twitch = require('./twitch');

var twitch = new Twitch('mjy60l6upiqb62b46kq1hyp6gwodow');

//const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

const app = express();

app.get('/', (req, res) => {
    
    twitch.getStreams(response => res.send(response));
    //res.send();
    //res.json();
    
});

app.get('/buck', (req, res) => res.send('Buck is amazing!'));

const server = app.listen(3000, () => console.log('Example app listening on port 3000!'));

//var happy = twitch.getStreams();

//console.log(happy);
//const shutdownManager = new GracefulShutdownManager(server);

/*process.on('SIGTERM', () => {
    shutdownManager.terminate(() => {
        console.log('Server is gracefully terminated');
    });
});*/

//luke's comment
