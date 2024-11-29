const Arweave = require('arweave');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

function getReadableTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function generateMultipleWallets(count) {
  try {

    const readableTimestamp = getReadableTimestamp();
    const walletsDir = `arweave-wallets-${readableTimestamp}`;
    fs.mkdirSync(walletsDir);

    for (let i = 0; i < count; i++) {
      
      const key = await arweave.wallets.generate();
      const address = await arweave.wallets.jwkToAddress(key);

      
      const keyFileName = path.join(walletsDir, `wallet-${address}.json`);
      fs.writeFileSync(keyFileName, JSON.stringify(key, null, 2));

      console.log(`Wallet ${i + 1} generated.`);
      console.log(`Address: ${address}`);
      console.log(`Keyfile saved to: ${keyFileName}\n`);
    }

    console.log(`\nAll ${count} wallets generated successfully!`);
    console.log(`Keyfiles are saved in the folder: ${walletsDir}`);
  } catch (error) {
    console.error('Error generating wallets:', error);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('How many wallets would you like to generate? ', (input) => {
  const count = parseInt(input, 10);

  if (isNaN(count) || count <= 0) {
    console.log('Invalid input. Please enter a positive number.');
  } else {
    console.log(`Generating ${count} wallets...`);
    generateMultipleWallets(count);
  }

  rl.close();
});
