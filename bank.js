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

      dynamoDB.getItem(params,function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);
      });

      if (callback) {
        callback("winning");
      }
    }

    updateBalance(currencyType, amount, callback) {

    }

    createAccount(callback) {

    }
}

module.exports = {
  AccountMgr : AccountMgr,
  Account : Account
}
