const fs = require('fs');

async function main() {
  const NFTMarket = await ethers.getContractFactory("MarketPlace");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket contract deployed to:", nftMarket.address);

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);

  const config = `
  export const nftmarketaddress = "${nftMarket.address}";
  export const nftaddress = "${nft.address}";`;

  fs.writeFileSync('config.js', config);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });