require('dotenv').config(); // Load .env variables
const { ethers } = require("ethers");

// URL for Avail Turing (read from .env file)
const providerUrl = process.env.HTTP_ENDPOINT; 

// Addresses for the transaction (replace with your actual addresses)
const fromAddress = process.env.YOUR_FROM_ADDRESS;
const toAddress = process.env.YOUR_TO_ADDRESS;
const value = ethers.utils.parseEther('0.7'); // Amount in AVL

async function createAndSendTransaction() {
    try {
        // Create provider with correct chain ID and error handling
        const provider = new ethers.providers.JsonRpcProvider(providerUrl, 2197);
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name, network.chainId);

        const nonce = await provider.getTransactionCount(fromAddress);
        const gasPrice = await provider.getGasPrice();

        const txParams = {
            nonce,
            gasPrice,
            gasLimit: 21000,
            to: toAddress,
            value,
            data: '0x', 
        };

        // Get private key from environment variable
        const privateKey = process.env.PVT_KEY;
        const wallet = new ethers.Wallet(privateKey, provider);
        const signedTx = await wallet.signTransaction(txParams);
        const txHash = await provider.sendTransaction(signedTx);

        console.log('Transaction hash:', txHash);
    } catch (error) {
        console.error("Error:", error.code, error.reason, error.event); 
    }
}

createAndSendTransaction();
