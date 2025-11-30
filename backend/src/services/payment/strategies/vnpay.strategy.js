const BasePaymentStrategy = require("./base.strategy");
const crypto = require("crypto");
const qs = require("qs");

class VNPayStrategy extends BasePaymentStrategy {
  async createPayment({ payment, bookings, returnUrl }) {
    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Amount: payment.amount * 100,
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, 14),
      vnp_CurrCode: "VND",
      vnp_IpAddr: "127.0.0.1",
      vnp_Locale: "vn",
      vnp_OrderInfo: `Thanh toan ${bookings.length} don hang`,
      vnp_OrderType: "tourism",
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: payment.id,
    };

    const sortedParams = this.sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    vnp_Params.vnp_SecureHash = hmac.update(signData).digest("hex");

    const paymentUrl = `${process.env.VNP_URL}?${qs.stringify(vnp_Params, {
      encode: false,
    })}`;

    return { paymentUrl };
  }

  async handleWebhook(_vnp_Params) {
    // Xác minh chữ ký, cập nhật payment + booking
  }

  sortObject(obj) {
    return Object.keys(obj)
      .sort()
      .reduce((res, key) => {
        res[key] = obj[key];
        return res;
      }, {});
  }
}

module.exports = VNPayStrategy;
