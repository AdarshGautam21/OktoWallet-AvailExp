// Import Polkadot.js API dependencies.
const { util_crypto, encodeAddress } = require('@polkadot/util-crypto');
const { decodeAddress } = require('@polkadot/keyring')
const { hexToU8a, isHex } = require('@polkadot/util')

// Specify an address to test.

const WalletAddress = encodeAddress(hexToU8a("0426351217444eb1f8b41cd2670bdeb1f38dd33916c3fc464cd6eb9aabeae152"), 42);
// Check address.
const isValidSubstrateAddress = () => {
  try {
    encodeAddress(isHex(WalletAddress) ? hexToU8a(WalletAddress) : decodeAddress(WalletAddress))

    return ("This is a Subwallet Address.")
  } catch (error) {
    return false
  }
}

// Query result.
const isValid = isValidSubstrateAddress()

console.log(WalletAddress)
console.log(isValid)