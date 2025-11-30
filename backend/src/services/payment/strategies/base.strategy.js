class BasePaymentStrategy {
  async createPayment(_paymentData) {
    throw new Error("createPayment() must be implemented");
  }

  async handleWebhook(_payload) {
    throw new Error("handleWebhook() must be implemented");
  }

  async handleReturn(_query) {
    throw new Error("handleReturn() must be implemented");
  }
}

module.exports = BasePaymentStrategy;
