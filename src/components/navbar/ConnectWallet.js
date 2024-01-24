"use client"

import connect from '../../utils/connect'
export default function ConnectWallet() {

  

  return (
    <>
      <button className="flex justify-center self-center gap-2 md:gap-3 text-base md:text-lg w-[128px] h-[38px] md:w-[173px] md:h-[51px] btn-wallet "
        onClick={connect}>
        <p className="self-center ">Connect Wallet</p>
      </button>
    </>
  );
}