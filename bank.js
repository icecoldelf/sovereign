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
    constructor(accountNumber, callback) {
      this.happy = "Sovereign Bank";
      this.accountExists = false;
      this.accountNumber = accountNumber;

      this.params = {
        Key: {
          "accountNumber": {
            S: this.accountNumber
          }
        },
        TableName: "sovereignBank"
      };

      this.doesExist(response => {
        this.accountExists = response;
        callback(this);
      });
    }

    doesExist(callback) {
      dynamoDB.getItem(this.params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          if (Object.keys(data).length === 0 && data.constructor === Object) {
            callback(false);
          } else {
            callback(true);
          }
        }
      });
    }

    getBalance(currencyType, callback) {

      //This allows currencyType to be an optional argument
      if (typeof callback === "undefined") {
        callback = currencyType;
        currencyType = null;
      }

      //If no account exists, this will create an account
      var that = this;
      dynamoDB.getItem(this.params,function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          that.doesExist(response => {
            if (response) {
              console.log("getBalance:" + Object.entries(data.Item.balances.M));
              let balances = data.Item.balances.M;
              callback(balances);
            } else {
              console.log("No account with that number.")
              that.createAccount(function(account) {
                console.log("account:" + account[0]);
                that.getBalance(function(response){
                  callback(response);
                });
                //callback(account.toString());
              });
            }
          });
        }
      });

      if (callback) {
        //callback("winning");
      }
    }

    updateBalance(accountNumber, currencyType, amount, callback) {
      let params = {
        Key: {
          "accountNumber": accountNumber
        },
        Items: {
          "Balances": {
            M: {
              [currencyType]: {
                N: amount
              }
            }
          }
        },
        TableName: "sovereignBank"
      }

      dynamoDB.updateItem(params, function(err, data) {
        if (err) {

        } else {
          callback("success");
        }
      });
    }

    createAccount(callback) {
      let params = {
        Item: {
          "accountNumber": {
            S: this.accountNumber
          },
          "balances": {
            M: {
              "silver": {
                N: "0"
              },
              "gold": {
                N: "0"
              }
            }
          }
        },
        TableName: "sovereignBank"
      }

      dynamoDB.putItem(params, function(err, data){
        if (err) {
          console.log("error:" + err);
        } else {
          console.log("data: " + data);
          callback(data);
        }
      });
    }
}

module.exports = {
  AccountMgr : AccountMgr,
  Account : Account
}
