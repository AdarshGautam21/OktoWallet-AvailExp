const { ApiPromise, HttpProvider, Keyring } = require('@polkadot/api');
const { cryptoWaitReady, mnemonicToMiniSecret } = require('@polkadot/util-crypto');
require('dotenv').config();

async function main() {
  try {
    await cryptoWaitReady(); // Ensure crypto is initialized

    // Initialize the provider (WsProvider is more commonly used)
    const httpProvider = new HttpProvider(process.env.HTTP_PROVIDER);
    const api = await ApiPromise.create({ provider: httpProvider });
    await api.isReady;
    // console.log(api);
    // Decode the mnemonic from the environment variable
    const keyring = new Keyring({ type: 'sr25519' });

    // Assuming mnemonic is your 12 or 24 word mnemonic phrase
    const mnemonic = 'super join ocean safe novel favorite midnight foam gaze mean brush wave'; // Use your mnemonic from the .env file

    // Convert mnemonic to seed
    const seed = mnemonicToMiniSecret(mnemonic);

    // Add keypair to keyring
    const sender = keyring.addFromSeed(seed);
    console.log(`Derived sender address: ${sender.address}`);

    // Verify the derived address matches the expected one (optional)
    // const expectedAddress = process.env.EXPECTED_SENDER_ADDRESS;
    // if (sender.address !== expectedAddress) {
    //   throw new Error(Derived address ${sender.address} does not match expected address ${expectedAddress});
    // }

    // Receiver address
    const receiver = process.env.RECIPIENT_ADDRESS;

    // Fetch nonce and balance for the sender's account
    const { nonce, data: { free: balance } } = await api.query.system.account(sender.address);

    console.log(`Sender balance: ${balance.toString()}, nonce: ${nonce.toString()}`);

    // Ensure balance is sufficient for the transfer
    const transferAmount = 10_000_000_000; // Transfer amount in smallest unit
    if (balance.toBigInt() < BigInt(transferAmount)) {
      throw new Error('Sender account has insufficient balance.');
    }

    // Create a simple transfer transaction
    const transfer = api.tx.balances.transferKeepAlive(receiver, transferAmount);

    // Log the transfer details for debugging
    console.log('Transfer details:', {
      sender: sender.address,
      receiver,
      amount: transferAmount,
    });

    // try {
    //     // Estimate the transaction fee using a simplified approach
    //     const info = await api.tx.balances.transferKeepAlive(receiver, 123).paymentInfo(sender);
    //     console.log(Estimated transaction fees: ${info.partialFee.toString()});
    //   } catch (feeError) {
    //     console.error(Error estimating transaction fees: ${feeError.message});
    //   }

    // Sign the transaction using the sender's keypair
    const signedTx = await transfer.signAsync(sender, { nonce });

    // Log the signed transaction for debugging
    console.log('Signed transaction: ', signedTx.toHex());

    // Send the signed transaction
    // const txHash = await api.rpc.author.submitExtrinsic(signedTx);
    // console.log(Transaction hash: ${txHash.toHex()});

    // Clean up
    await api.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main().catch(console.error);