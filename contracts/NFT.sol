// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    address public marketPlaceAddress;
    uint256 public tokenId;

    constructor(address _marketPlaceAddress) ERC721("AwoGebeya", "AwoG") {
        marketPlaceAddress = _marketPlaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint) {
        tokenId++;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        setApprovalForAll(marketPlaceAddress, true);

        return tokenId;
    }
}
