import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Starting TravelPayToken deployment...\n');

  // Lấy danh sách accounts
  const [deployer, platformWallet, cashbackWallet, ...otherAccounts] =
    await ethers.getSigners();

  console.log('📋 Deployment Information:');
  console.log('├─ Deployer address:', deployer.address);
  console.log('├─ Platform wallet:', platformWallet.address);
  console.log('├─ Cashback wallet:', cashbackWallet.address);
  console.log(
    '└─ Deployer balance:',
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    'ETH\n'
  );

  // Deploy contract
  console.log('📦 Deploying TravelPayToken contract...');
  const TravelPayToken = await ethers.getContractFactory('TravelPayToken');
  const token = await TravelPayToken.deploy(
    platformWallet.address,
    cashbackWallet.address
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log('✅ TravelPayToken deployed to:', tokenAddress, '\n');

  // Verify deployment
  console.log('🔍 Verifying deployment...');
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const deployerBalance = await token.balanceOf(deployer.address);

  console.log('├─ Token Name:', name);
  console.log('├─ Token Symbol:', symbol);
  console.log('├─ Total Supply:', ethers.formatEther(totalSupply), 'TPT');
  console.log(
    '└─ Deployer Balance:',
    ethers.formatEther(deployerBalance),
    'TPT\n'
  );

  // Airdrop test tokens cho các accounts
  console.log('🎁 Airdropping test tokens...');
  const airdropAmount = ethers.parseEther('10000'); // 10,000 TPT

  for (let i = 0; i < Math.min(5, otherAccounts.length); i++) {
    const account = otherAccounts[i];
    await token.transfer(account.address, airdropAmount);
    console.log(
      `├─ Sent ${ethers.formatEther(airdropAmount)} TPT to ${account.address}`
    );
  }
  console.log('✅ Airdrop completed\n');

  // Save deployment info
  const deploymentInfo = {
    network: 'localhost',
    chainId: 31337,
    contractAddress: tokenAddress,
    deployer: deployer.address,
    platformWallet: platformWallet.address,
    cashbackWallet: cashbackWallet.address,
    deployedAt: new Date().toISOString(),
    contractABI: [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function transferFrom(address from, address to, uint256 amount) returns (bool)',
      'function payBooking(bytes32 bookingId, address provider, uint256 amount) returns (bool)',
      'function refundBooking(bytes32 bookingId, address provider) returns (bool)',
      'function getBookingPayment(bytes32 bookingId) view returns (address customer, uint256 amount, uint256 timestamp, bool completed, bool refunded)',
      'function vndToTPT(uint256 vndAmount) pure returns (uint256)',
      'function tptToVND(uint256 tptAmount) pure returns (uint256)',
      'event BookingPaid(bytes32 indexed bookingId, address indexed customer, uint256 amount)',
      'event BookingRefunded(bytes32 indexed bookingId, address indexed customer, uint256 amount)',
      'event CashbackPaid(address indexed customer, uint256 amount)',
    ],
    testAccounts: otherAccounts.slice(0, 5).map((acc) => ({
      address: acc.address,
      balance: '10000 TPT',
    })),
  };

  const outputDir = path.join(__dirname, '../deployment');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'localhost.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('📄 Deployment info saved to deployment/localhost.json\n');

  // Print usage instructions
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 DEPLOYMENT SUCCESSFUL!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📝 Add these to your .env files:\n');
  console.log('Backend (.env):');
  console.log(`BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545`);
  console.log(`TRAVELPAY_CONTRACT_ADDRESS=${tokenAddress}`);
  console.log(`BLOCKCHAIN_CHAIN_ID=31337`);
  console.log(`ADMIN_PRIVATE_KEY=${deployer.privateKey}`);
  console.log('\nFrontend (.env):');
  console.log(`VITE_BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545`);
  console.log(`VITE_TRAVELPAY_CONTRACT_ADDRESS=${tokenAddress}`);
  console.log(`VITE_BLOCKCHAIN_CHAIN_ID=31337`);
  console.log(`VITE_BLOCKCHAIN_NETWORK_NAME=Localhost`);
  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
  );

  // Test accounts info
  console.log('🧪 Test Accounts:');
  console.log(
    'You can import these accounts to MetaMask using their private keys:\n'
  );
  for (let i = 0; i < Math.min(5, otherAccounts.length); i++) {
    console.log(`Account ${i + 1}:`);
    console.log(`├─ Address: ${otherAccounts[i].address}`);
    console.log(`├─ TPT Balance: 10,000 TPT`);
    console.log(`└─ Private Key: (check hardhat accounts)\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
