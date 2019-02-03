const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDB = new AWS.DynamoDB();

class AccountMgr {
    constructor(callback) {

    }

    getAccount(accountNumber, callback) {

    }
}

class Account {
    constructor(callback) {
      this.happy = "Sovereign Bank";
      this.accountNumber;

      if (callback) {
        callback(this);
      }
    }

    getBalance(currencyType, callback) {

      //This allows currencyType to be an optional argument
      if (typeof callback === "undefined") {
        callback = currencyType;
        currencyType = null;
      }

      console.log("accountNumber: " + this.accountNumber);
      var params = {
        Key: {
          "accountNumber": {
            S: this.accountNumber
          }
        },
        TableName: "sovereignBank"
      };

      //If no account exists, this will create an account
      var that = this;
      dynamoDB.getItem(params,function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          if (Object.keys(data).length === 0 && data.constructor === Object) {
            console.log("No account with that number.");
            that.createAccount(function(account) {
              console.log(account);
              callback(account);
            });
            //callback("You don't have an account.");
          } else {
            console.log(data);
          }
        }
      });

      if (callback) {
        //callback("winning");
      }
    }

    updateBalance(currencyType, amount, callback) {

    }

    createAccount(callback) {
      var params = {
        Item: {
          "accountNumber": {
            S: this.accountNumber
          },
          "balances": {
            M: {
              "silver": 0,
              "gold": 0
            }
          }
        },
        TableName: "sovereignBank"
      }

      dynamoDB(params, function(err, data){
        if (err) {

        } else {
          callback(data);
        }
      });
    }
}

module.exports = {
  AccountMgr : AccountMgr,
  Account : Account
}
