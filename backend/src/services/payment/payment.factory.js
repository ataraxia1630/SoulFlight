const VNPayStrategy = require("./strategies/vnpay.strategy");
// const BlockchainStrategy = require('./strategies/blockchain.strategy');
// const CashStrategy = require('./strategies/cash.strategy');

const strategies = {
  VNPAY: new VNPayStrategy(),
  MOMO: null,
  ZALOPAY: null,
  BLOCKCHAIN: null,
  CASH: null,
  BANK_TRANSFER: null, // xử lý như CASH
};

const PaymentFactory = {
  getStrategy(method) {
    const strategy = strategies[method];
    if (!strategy) throw new Error(`Payment method ${method} not supported`);
    return strategy;
  },
};

module.exports = PaymentFactory;
