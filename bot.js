const tmi = require('tmi.js');
const AWS = require('aws-sdk');
const https = require('https');
const bank = require('./bank');
AWS.config.update({region: 'us-east-1'});

const options = {
  hostname: 'api.twitch.tv',
  port: 443,
  path: '/helix/streams?game_id=71375',
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Client-ID': 'mjy60l6upiqb62b46kq1hyp6gwodow'
  }
};

const req = https.request(options, (res) => {
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

req.end();

var dynamodb = new AWS.DynamoDB();

// Define configuration options
const opts = {
  identity: {
    username: "theenlightenedbot",
    password: "oauth:lpsjzwbexroxgnw0j81uxfm8wq7feu"
  },
  channels: [
    "theenlightenedbot",
    "thefew"
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();
  const userType = context["user-type"] || "none";

  // Save message in DynamoDB
  var params = {
    Item: {
     "timestamp": {
       N: Date.now().toString()
     },
     "display-name": {
       S: context["display-name"]
     },
     "message": {
       S: commandName
     },
     "channel": {
       S: target
     },
     "subscriber": {
       BOOL: context.subscriber
     },
     "user-type": {
       S: userType
     }
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "chat"
   };
   dynamodb.putItem(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });

  // Use switch instead of if statements for readability

  commandArray = commandName.split(' ');
  if (commandArray[0] != '!sov') commandArray = [];
  console.log("commandArray[1]: " + commandArray[1]);

  switch(commandArray[1]) {
    case 'balance': 
      checkBalance(commandArray, context, response => client.say(target, response));
      break;
    case 'happy': 
      client.say(target, "Yaaay!");
      break;
    default: {}
  } 

  function checkBalance(commandArray, context, callback) {
    new bank.Account(account => {
      account.accountNumber = context["user-id"];
      account.getBalance(balances => {
        let balanceString = `${context.username} balances are: Silver: ${balances.silver.N}, Gold: ${balances.gold.N}`;
        callback(balanceString);
      });
    });

  var happy =  ["asfd", "aasdrew", variable];
  happy.push("afds");
  }

  // Temp functionality to test new bank class
  
}

// Function called when the "dice" command is issued 
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}