const BasePaymentStrategy = require("./base.strategy");
const crypto = require("crypto");
const qs = require("qs");
const prisma = require("../../../configs/prisma");

class VNPayStrategy extends BasePaymentStrategy {
  async createPayment({ payment, bookings, returnUrl }) {
    const finalReturnUrl = returnUrl || process.env.VNP_RETURN_URL;

    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_Amount: Math.round(Number(payment.amount) * 100),
      vnp_CreateDate: this.getVNPayDate(),
      vnp_CurrCode: "VND",
      vnp_IpAddr: "127.0.0.1",
      vnp_Locale: "vn",
      vnp_OrderInfo: `Thanh toan ${bookings.length} booking`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: finalReturnUrl,
      vnp_TxnRef: payment.id,
    };

    // Sắp xếp params theo alphabet và tạo chữ ký
    const sortedParams = this.sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    sortedParams.vnp_SecureHash = signed;

    const paymentUrl = `${process.env.VNP_URL}?${qs.stringify(sortedParams, {
      encode: false,
    })}`;
    return { paymentUrl };
  }

  async handleReturn(vnp_Params) {
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sortedParams = this.sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return { success: false, message: "Chữ ký không hợp lệ" };
    }

    const paymentId = vnp_Params.vnp_TxnRef;
    const responseCode = vnp_Params.vnp_ResponseCode;
    const transactionNo = vnp_Params.vnp_TransactionNo;

    const isSuccess = responseCode === "00";
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: isSuccess ? "SUCCESS" : "FAILED",
        transaction_id: transactionNo,
        paid_at: isSuccess ? new Date() : null,
        payload: vnp_Params,
      },
    });

    if (isSuccess) {
      await prisma.booking.updateMany({
        where: { payment_id: paymentId },
        data: { status: "PAID" },
      });
    }

    return {
      success: isSuccess,
      message: isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại",
      paymentId,
      transactionId: transactionNo,
    };
  }

  async handleWebhook(vnp_Params) {
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sortedParams = this.sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return { RspCode: "97", Message: "Invalid Signature" };
    }

    const paymentId = vnp_Params.vnp_TxnRef;
    const responseCode = vnp_Params.vnp_ResponseCode;
    const amount = vnp_Params.vnp_Amount / 100;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return { RspCode: "01", Message: "Order not found" };
    }

    if (Number(payment.amount) !== amount) {
      return { RspCode: "04", Message: "Invalid Amount" };
    }

    if (payment.status === "SUCCESS") {
      return { RspCode: "02", Message: "Order already confirmed" };
    }

    const isSuccess = responseCode === "00";
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: isSuccess ? "SUCCESS" : "FAILED",
        transaction_id: vnp_Params.vnp_TransactionNo,
        paid_at: isSuccess ? new Date() : null,
        payload: vnp_Params,
      },
    });

    if (isSuccess) {
      await prisma.booking.updateMany({
        where: { payment_id: paymentId },
        data: { status: "PAID" },
      });
    }

    return { RspCode: "00", Message: "Success" };
  }

  sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
      if (Object.hasOwn(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  getVNPayDate() {
    return new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
  }
}

module.exports = VNPayStrategy;
