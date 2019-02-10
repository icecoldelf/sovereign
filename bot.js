const tmi = require('tmi.js');
const AWS = require('aws-sdk');
const https = require('https');
const Banking = require('./banking');
const Twitch = require('./twitch');
AWS.config.update({region: 'us-east-1'});

let bank = new Banking.Bank("sovereign");
let twitch = new Twitch('mjy60l6upiqb62b46kq1hyp6gwodow');


/*const options = {
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
*/

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
  if (commandArray[0] != '!sov') {
    commandArray = [];
  } else {
    var args = commandArray.splice(0, 2);
    var command = commandArray[1];
  }

  switch(command) {
    case 'balance': 
      checkBalance(commandArray, context, response => client.say(target, response));
      break;
    case 'happy': 
      executeHappy(context, response => client.say(target, response));
      break;
    case 'me':
      if (isMod(context)) {
        client.say(target, "Mod");
      } else {
        client.say(target, "Not a Mod");
      }
      break;
    case 'pizza':
      test(res => client.say(target, res));
      break;
    case 'grant':
      if (args.length() < 2) {
        client.say(target, 'Not enough argments to execute specified command.');
      }
      grantCurrency(commandArray, context, response => client.say(target, response));
      break;
  } 

  function test(callback) {
    let bank = new Banking.Bank("sovereign");
    twitch.getUserID('thefew', res => {
      bank.getAccount(res, account => {
        callback(account.accountNumber);
      });
    });
  }

  //Grant currency to a specific user
  //I need to send this function a specific user to add and the requester. Not the command object/context.
  function grantCurrency(command, context, callback) {
    if (isMod(context)) {
      if (["gold", "silver"].indexOf(command[2])) {
        new Banking.Account(context["user-id"], account => {
          console.log("accountExists: " + account.accountExists);
          let twitch = new Twitch('mjy60l6upiqb62b46kq1hyp6gwodow');
          twitch.getUserID(command[3], response => client.say(target, response));
          account.updateBalance(command[2], command[3]);
          //client.say(target, account.accountExists.toString());
        });
      }
    } else {
      callback("You do not have permission");
    }
  }

  function grantCurrency2 (userID, cType, quantity, callback) {
    if (isAvailableCurrencyType(cType)) {
      let  account = new Banking.Account(userID);

      account.updateBalance(cType, quantity, response => {
        callback(response);
      });
    }
  }

  function checkBalance(commandArray, context, callback) {
    new Banking.Account(context["user-id"], account => {
      account.accountNumber = context["user-id"];
      account.getBalance(balances => {
        let balanceString = `${context.username} balances are: Silver: ${balances.silver.N}, Gold: ${balances.gold.N}`;
        callback(balanceString);
      });
    });
  }

  function executeHappy(context, callback) {
    if (isMod(context)) {
      callback("Yaaay!");
    } else {
      callback("Nope!");
    }
  } 

  function isMod(context) {
    if (context.mod || context.username == "thefew") {
      return true;
    }
  }

  // Temp functionality to test new banking class
  
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
