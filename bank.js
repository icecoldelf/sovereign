const AWS = require('aws-sdk');

class AccountMgr {
    constructor(callback) {

    }

    getAccount(accountNumber, callback) {

    }
}

class Account {
    constructor(callback) {
      this.happy = "Sovereign Bank";

      if (callback) {
        callback(this);
      }
    }

    getBalance(currencyType, callback) {

      //This allows currencyType to be an optional argument
      if (typeof currencyType === "undefined") {
        callback = currencyType;
        currencyType = null;
      }

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
