import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const TravelPayTokenModule = buildModule('TravelPayTokenModule', (m) => {
  // Lấy địa chỉ người deploy (Account 0)
  const deployer = m.getAccount(0);

  // Ví dụ: Set ví Platform và ví Cashback chính là ví deployer luôn (cho môi trường test)
  // Trong thực tế bạn có thể thay bằng địa chỉ ví cứng khác
  const platformWallet = deployer;
  const cashbackWallet = deployer;

  const travelPayToken = m.contract('TravelPayToken', [
    platformWallet,
    cashbackWallet,
  ]);

  return { travelPayToken };
});

export default TravelPayTokenModule;
