import { ethers } from 'hardhat';

async function main() {
  // ================= CẤU HÌNH (Sửa thông tin ở đây) =================
  const RECEIVER_ADDRESS = '0x...';
  const CONTRACT_ADDRESS = '0x...';
  const AMOUNT_TO_SEND = '13500'; // Số lượng TPT muốn bắn
  // ==================================================================

  console.log('----------------------------------------------------');
  console.log('🚰 BẮT ĐẦU CHẠY FAUCET (BƠM TIỀN)');
  console.log('----------------------------------------------------');

  // 1. Kết nối Contract
  // Lưu ý: "TravelPayToken" là tên class trong file .sol (không phải tên file)
  const token = await ethers.getContractAt('TravelPayToken', CONTRACT_ADDRESS);

  // 2. Lấy ví Admin (Account #0 của Hardhat - người nắm giữ 100% tổng cung ban đầu)
  const [admin] = await ethers.getSigners();

  console.log(`🤖 Admin gửi tiền: ${admin.address}`);
  console.log(`👤 Người nhận:     ${RECEIVER_ADDRESS}`);

  // 3. Kiểm tra số dư hiện tại của người nhận
  const balanceBefore = await token.balanceOf(RECEIVER_ADDRESS);
  console.log(`💰 Số dư hiện tại: ${ethers.formatEther(balanceBefore)} TPT`);

  // 4. Thực hiện chuyển tiền
  console.log(`🔄 Đang chuyển ${AMOUNT_TO_SEND} TPT...`);

  try {
    const tx = await token
      .connect(admin)
      .transfer(RECEIVER_ADDRESS, ethers.parseEther(AMOUNT_TO_SEND));

    // Chờ giao dịch được xác nhận
    await tx.wait();

    console.log(`✅ Giao dịch thành công! Hash: ${tx.hash}`);

    // 5. Kiểm tra lại số dư mới
    const balanceAfter = await token.balanceOf(RECEIVER_ADDRESS);
    console.log(`🎉 Số dư mới:     ${ethers.formatEther(balanceAfter)} TPT`);
  } catch (error: any) {
    console.error('❌ Lỗi khi chuyển tiền:', error.message);
  }

  console.log('----------------------------------------------------');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//npx hardhat run scripts/faucet.ts --network localhost
