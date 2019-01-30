//file twitch.js

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
        console.log('happy');
    }
}

module.exports = Twitch;