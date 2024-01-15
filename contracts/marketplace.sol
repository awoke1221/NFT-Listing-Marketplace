// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketPlace is IERC721Receiver, ReentrancyGuard, Ownable {
    address public holder;
    uint256 public listingFee = 0.0025 ether;

    struct List {
        uint256 tokenId;
        address payable seller;
        address payable holder;
        uint256 price;
        bool sold;
    }

    event NFTListCreated(
        uint256 indexed tokenId,
        address seller,
        address holder,
        uint price,
        bool sold
    );

    mapping(uint256 => List) public vaultItems;

    ERC721Enumerable nft;

    constructor(ERC721Enumerable _nft) Ownable(address(msg.sender)) {
        holder = payable(msg.sender);
        nft = _nft;
    }

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    function listSale(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "the price must be greater than zero");
        require(
            nft.ownerOf(tokenId) == msg.sender,
            " you are not the owner of this NFT"
        );
        require(vaultItems[tokenId].tokenId == 0, " NFT alredy listed");
        require(msg.value >= listingFee, " you need to pay a listing Fee");

        vaultItems[tokenId] = List(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
        nft.transferFrom(msg.sender, address(this), tokenId);

        emit NFTListCreated(tokenId, msg.sender, address(this), price, false);
    }

    function buyNFT(uint256 tokenId) public payable nonReentrant {
        uint256 price = vaultItems[tokenId].price;
        require(msg.value >= price, " you must pay the price of this NFT");
        vaultItems[tokenId].seller.transfer(msg.value);
        nft.transferFrom(address(this), msg.sender, tokenId);

        vaultItems[tokenId].sold = true;
        delete (vaultItems[tokenId]);
    }

    function cancelSale(uint256 tokenId) public nonReentrant {
        require(vaultItems[tokenId].seller == msg.sender, " NFT is not Yours");
        nft.transferFrom(address(this), msg.sender, tokenId);
        delete (vaultItems[tokenId]);
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        uint256 price = vaultItems[tokenId].price;
        return price;
    }

    function nftListings() public view returns (List[] memory) {
        uint256 nftCount = nft.totalSupply();
        uint256 currentIndex = 0;
        List[] memory items = new List[](nftCount);
        for (uint i = 0; i < nftCount; i++) {
            if (vaultItems[i + 1].holder == address(this)) {
                uint256 currentId = i + 1;
                List storage currentItem = vaultItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0), "can not send nft to vault directly");
        return IERC721Receiver.onERC721Received.selector;
    }

    function withdrow() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
}
