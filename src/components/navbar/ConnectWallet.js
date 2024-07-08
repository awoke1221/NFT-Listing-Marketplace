"use client"
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import axios from 'axios';
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
//import USDT_ABI from '../../../utils/usdt_abi.json'
//import GRT_ABI from '../../../utils/grt.abi.json'



export default function ConnectWallet() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [balance, setBalance] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [GRTBalance, setGRTBalance] = useState(null);

  async function fetchBalance() {
    if (web3Provider) {
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      const balance = await web3Provider.getBalance(address);
      const ETHbalance = ethers.utils.formatEther(balance)
      setBalance(ETHbalance);


      // Fetch USDT balance
      //const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT contract address
      //const usdtContract = new ethers.Contract(usdtContractAddress, USDT_ABI, signer);
      //const usdtBalance = await usdtContract.balanceOf(address);
      //const ausdtBalance = ethers.utils.formatUnits(usdtBalance, 6);
      //setUsdtBalance(ausdtBalance); // USDT has 6 decimal places

      // Fetch GRT balance
      //const grtContractAddress = '0xc944E90C64B2c07662A292be6244BDf05Cda44a7'; // GRT contract address
      //const grtContract = new ethers.Contract(grtContractAddress, GRT_ABI, signer);
      //const GRTBalance = await grtContract.balanceOf(address);
      //const aGRTBalance = ethers.utils.formatUnits(GRTBalance,18)
      //setGRTBalance(aGRTBalance); // GRT has 18 decimal places


      axios
        .post('http://localhost:5000/api/users/wallets', { address, ETHbalance})
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error registering user:', error);
        });
    }
  }
  useEffect(() => {
    fetchBalance();
  }, [web3Provider]);
  const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "awo-NFTs",
        infuraId: process.env.INFURA_KEY
      }
    },
    // other wallet options are add hear
  };


  async function yourwalletConnect() {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions
      });
      const web3modalInstance = await web3Modal.connect();
      const web3modalprovider = new ethers.providers.Web3Provider(web3modalInstance);
      if (web3modalprovider) {
        setWeb3Provider(web3modalprovider);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {web3Provider === null ? (
        <button className="flex justify-center self-center gap-3 md:gap-4 text-[16px] md:text-[20px] w-[173px] h-[51px] md:w-[232px] md:h-[64px] btn-wallet"
          onClick={yourwalletConnect}>
          <p className="self-center text-white">Connect Wallet</p>

          <svg
            className="self-center"
            width="8"
            height="22"
            viewBox="0 0 8 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.49988 1C4.49988 0.723858 4.27602 0.5 3.99988 0.5C3.72374 0.5 3.49988 0.723858 3.49988 1H4.49988ZM3.64632 21.3536C3.84159 21.5488 4.15817 21.5488 4.35343 21.3536L7.53541 18.1716C7.73067 17.9763 7.73067 17.6597 7.53541 17.4645C7.34015 17.2692 7.02357 17.2692 6.82831 17.4645L3.99988 20.2929L1.17145 17.4645C0.976189 17.2692 0.659606 17.2692 0.464344 17.4645C0.269082 17.6597 0.269082 17.9763 0.464344 18.1716L3.64632 21.3536ZM3.49988 1V21H4.49988V1H3.49988Z"
              fill="#F7ECE1" />
          </svg>
        </button>
      ) : (
        <div>
          
          <p> {(web3Provider.provider.selectedAddress).substring(0, 8)}</p>
        </div>
      )}
    </div>
  );
}