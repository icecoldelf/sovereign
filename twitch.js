//file twitch.js
const querystring = require('query-string');

const postData = querystring.stringify({
  'msg': 'Hello World!'
});

class Twitch {
    constructor(clientID) {
        this.options = {
            hostname: 'api.twitch.tv',
            port: 443,
            path: '/helix/streams?game_id=71375',
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData),
              'Client-ID': clientID
            }
        };
    }

    getStreams() {
        const req = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              return chunk;
              console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
              console.log('No more data in response.');
            });
        });
      
      
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
      
        // write data to request body
        //req.write(postData);
        req.end();
    }
}

module.exports = Twitch;