const { cryptoWaitReady } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');

async function generateKeysFromPrivateKey(privateKey) {
  await cryptoWaitReady();

  // Create a keyring instance
  const keyring = new Keyring({ type: 'sr25519' });

  // Create a key pair from the provided private key
  const keyPair = keyring.createFromUri(privateKey);

  // Get the public key from the key pair
  const publicKey = keyPair.publicKey.toString();

  // Get the wallet address from the key pair
  const address = keyPair.address;

  return { publicKey, address };
}

// Example usage
const privateKey = '0x0fa7c50c3d4dc6b899a3801ea5bc4a09b46857c87fe048bde451c7b88d49af60';

generateKeysFromPrivateKey(privateKey)
  .then(({ publicKey, address }) => {
    const publicKeyBytes = publicKey.split(',').map(byteStr => parseInt(byteStr).toString(16).padStart(2, '0'));
    console.log('Private Key:', privateKey);
    const hexString = publicKeyBytes.join('');
    console.log('Public Key:', hexString);
    console.log('Wallet Address:', address);
  })
  .catch(error => {
    console.error('Error:', error);
  });