
export default function Home() {
  return (
    <div className="bg-[rgba(249,241,241,0.92)] flex flex-col items-center justify-center h-screen">
      <div className="mt-0">
        <h1 className="text-5xl font-normal text-center text-gray mb-8">
           awo NFT Marketplace ...
        </h1>
      </div>
      <div className="text-3xl font-normal text-center text-gray mt-5 mb-12">
        <span>
          Mint... List... Buy... Sell NFTs
        </span>
      </div>
      <div>
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg">
          Get Started
        </button>
      </div>
    </div>
  );
}
