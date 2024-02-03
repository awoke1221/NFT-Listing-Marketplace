
'use client'

import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../../config'
import NFT from '../../utils/abi/NFT.json'
import MarketPlace from '../../utils/abi/MarketPlace.json'

export default function Markets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/c19ac455e26f408fb4fe534e446d208e')
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketPlaceContract = new ethers.Contract(nftmarketaddress, MarketPlace.abi, provider)

    const data = await marketPlaceContract.feachMarketTokens()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      const item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, MarketPlace.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSell(nftaddress, nft.tokenId, { value: price })

    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return <h1 className='bg-[#f9f1f1eb] text-center px-20 py-7 text-4xl '> No NFT in the Marketplace</h1>
  }

  return (
    <div className='bg-[#f9f1f1eb] flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px',}}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {nfts.map((nft, i) => (
            <div key={i} className='border shadow rounded-x1 overflow-hidden'>
              <img src={nft.image} alt='NFT' />
              <div className='p-4'>
                <p style={{ height: '64px' }} className='text-3xl font-semibold'>
                  {nft.name}
                </p>
                <div style={{ height: '72px', overflow: 'hidden' }}>
                  <p className='text-gray-400'>{nft.description}</p>
                </div>
              </div>
              <div className='p-4 bg-black'>
                <p className='text-3xl mb-4 font-bold text-white'>{nft.price} ETH</p>
                <button
                  className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded'
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}