
'use client'

import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../../config'
import NFT from '../../utils/abi/NFT.json'
import MarketPlace from '../../utils/abi/MarketPlace.json'

export default function Account() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const marketPlaceContract = new ethers.Contract(nftmarketaddress, MarketPlace.abi, signer)
   
    const data = await marketPlaceContract.feachItemsCreated()

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
    const soledItems = items.filter(i => i.sold)
    setSold(soledItems)
    setNfts(items)
    setLoadingState('loaded')
  }


  if (loadingState === 'loaded' && !nfts.length) {
    return <h1 className='bg-[#f9f1f1eb] text-center px-20 py-7 text-4xl '> No NFT in your Account! </h1>
  }

  return (
    <div className='bg-[#f9f1f1eb] flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px' }}>
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
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
