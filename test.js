const http = require('http');
const querystring = require('query-string');

const postData = querystring.stringify({
  'msg': 'Hello World!'
});

const options = {
  hostname: 'api.twitch.tv',
  port: 443,
  path: '/helix/streams?game_id=33214',
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'Client-ID': 'mjy60l6upiqb62b46kq1hyp6gwodow'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
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