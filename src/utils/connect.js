import { ethers } from 'ethers';

async function connectToMetaMask() {
  // Check if MetaMask is installed
  if (window.ethereum) {
    try {
      // Request access to the user's MetaMask accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create an ethers.js provider using the injected Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the user's selected Ethereum address
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Display the connected address
      console.log('Connected address:', address);

      // You can now use the ethers.js provider and signer for interacting with the Ethereum network
      // For example, you can send transactions, read contract data, etc.

    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  } else {
    console.error('MetaMask not detected. Please install MetaMask extension.');
  }
}

export default connectToMetaMask;