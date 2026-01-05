import { ethers } from 'hardhat';

async function main() {
  console.log('🔑 Hardhat Local Network Accounts\n');
  console.log(
    '═══════════════════════════════════════════════════════════════\n'
  );

  const accounts = await ethers.getSigners();

  for (let i = 0; i < Math.min(10, accounts.length); i++) {
    const account = accounts[i];
    const balance = await ethers.provider.getBalance(account.address);

    console.log(`Account #${i}`);
    console.log(`├─ Address:     ${account.address}`);
    console.log(`├─ Private Key: ${account.privateKey || 'N/A'}`);
    console.log(`└─ Balance:     ${ethers.formatEther(balance)} ETH\n`);
  }

  console.log(
    '═══════════════════════════════════════════════════════════════'
  );
  console.log('\n💡 To import to MetaMask:');
  console.log('1. Open MetaMask');
  console.log('2. Click account icon → Import Account');
  console.log('3. Paste the Private Key');
  console.log('4. Add Network:');
  console.log('   - Network Name: Localhost');
  console.log('   - RPC URL: http://127.0.0.1:8545');
  console.log('   - Chain ID: 31337');
  console.log('   - Currency Symbol: ETH\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
