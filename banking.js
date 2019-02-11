const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDB = new AWS.DynamoDB();

class Bank {
  constructor (name) {
    this.name = name;
    this.currencyTypes = ['silver', 'gold'];
  }

  isCurrencyType(cType) {
    console.log("isCurrencyType: " + cType);
    console.log("cTypes:" + this.currencyTypes[0] + " " + this.currencyTypes[1]);
    console.log("indexOf: " + this.currencyTypes.indexOf(cType));
    console.log("match: " + this.currencyTypes[0] == cType);
    if (this.currencyTypes.indexOf(cType)) {
      console.log("cType: true");
      return true;
    } else {
      console.log("cType: false");
      return false;
    }
  }
  
  //returns Account object
  getAccount(userID, callback) {
    let account = new Account(userID);
    
    callback(account);
     
    //callback(new Account(userID));
  }
}

class AccountMgr {
  constructor(callback) {

  }

  getAccount(accountNumber, callback) {

  }
}


class Account {
    constructor(accountNumber) {
      //this.happy = "Sovereign Bank";
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

      //callback(true);
      //this.doesExist(response => {
        //this.accountExists = response;
        //callback(this);
      //});
    }

    doesExist(callback) {
      //if this.accountExists is already set to true, we want to avoid making another database call.
      if (!this.accountExists) {
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
      } else {
        callback(true);
      }
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
              });
            }
          });
        }
      });

      if (callback) {
        //callback("winning");
      }
    }

    updateBalance(cType, amount, callback) {
      let params = {
        Key: {
          "accountNumber": this.accountNumber
        },
        Items: {
          "Balances": {
            M: {
              [cType]: {
                N: amount
              }
            }
          }
        },
        TableName: "sovereignBank"
      }

      dynamoDB.updateItem(params, function(err, data) {
        if (err) {
          callback(false);
        } else {
          callback(true);
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
  Bank: Bank,
  AccountMgr : AccountMgr,
  Account : Account
}
