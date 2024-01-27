'use client'

import { ethers } from 'ethers'
import { useState } from 'react'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../../../config'
import NFT from '../../utils/abi/NFT.json'
import MarketPlace from '../../utils/abi/MarketPlace.json'
import { useRouter } from "next/navigation";
require('dotenv').config();
const axios = require('axios')
const FormData = require('form-data')



export default function mintItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formImput, updateFormImput] = useState({ price: " ", name: " ", description: " " })
    const router = useRouter()


    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios({
                method: "post",
                url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
                data: formData,
                headers: {
                    pinata_api_key: `fda201e251b7718f71d4`,
                    pinata_secret_api_key: `6cbd0d96e731660143cbc9fcc8ff3d3457471787debacbb5cb885a7daad24400`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { IpfsHash } = response.data;
            const url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
            setFileUrl(url);
        } catch (error) {
            console.log("error uploading a file: ", error);
        }
    }

    async function createMarket() {
        const { name, description, price } = formImput
        if (!name || !description || !price || !fileUrl) return
        // upload to IPFS
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
                headers: {
                    'Content-Type': 'application/json',
                    pinata_api_key: `fda201e251b7718f71d4`,
                    pinata_secret_api_key: `6cbd0d96e731660143cbc9fcc8ff3d3457471787debacbb5cb885a7daad24400`

                }
            });

            const { IpfsHash } = res.data;
            const url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
            createSale(url);
        } catch (error) {
            console.log("error to uplod a file: ", error)
        }
    }

    async function createSale(url) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()


        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.mintToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formImput.price, 'ether')

        // listing the item to the marketplace 
        contract = new ethers.Contract(nftmarketaddress, MarketPlace.abi, signer)
        let listingFee = await contract.getListingPrice()
        listingFee = listingFee.toString()

        transaction = await contract.makeMarketItem(nftaddress, tokenId, price, { value: listingFee })
        transaction.wait()
        router.push('/');
    }

    return (
        <div className="bg-[#f9f1f1eb] flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Asset name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormImput({ ...formImput, name: e.target.value })}
                />

                <textarea
                    placeholder="Asset description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormImput({ ...formImput, description: e.target.value })}
                />

                <input
                    placeholder="Asset price in ETH"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormImput({ ...formImput, price: e.target.value })}
                />
                <input
                    type="file"
                    name="asset"
                    className="mt-4"
                    onChange={onChange}
                />

                {
                    fileUrl && (<img className="rounded mt-4" width='350px' src={fileUrl} />)
                }

                <button onClick={() => createMarket()}
                    className="font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg hover:bg-purple-600 focus:outline-none focus:ring focus:border-blue-300"

                >
                    Mint NFT
                </button>

            </div>
        </div>
    )
}
