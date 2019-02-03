class AccountMgr {
    constructor(callback) {

    }

    getAccount(accountNumber, callback) {

    }

    createAccount(callback) {

    }
}

class Account {
    constructor(callback) {
        this.happy = "Sovereign Bank";
        callback(this.happy);
    }

    getBalance(currencyType, callback) {

    }

    updateBalance(currencyType, amount, callback) {

    }
}

module.export.Account;