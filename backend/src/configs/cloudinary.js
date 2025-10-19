const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

async function connectCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === "ok") {
      console.log("✅ Đã kết nối cloudinary thành công!");
    } else {
      console.log("⚠️ Cloudinary ping không phản hồi như mong đợi:", result);
    }
  } catch (error) {
    console.error("❌ Kết nối cloudinary thất bại:", error.message);
  }
}

connectCloudinary();

module.exports = cloudinary;
