// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract Market is IERC721Receiver,Ownable,ReentrancyGuard{

    address payable holder;
    uint256 listingFee = 0.00025 ether;

    struct List {
        uint256 tokenId;
        address payable seller;
        address payable holder;
        uint256 price;
        bool sold;
    }

    mapping (uint256 => List) public vaultItems;

    event NFTListCreated(
        uint256 indexed tokenId,
        address seller,
        address holder,
        uint256 price,
        bool sold
    );

    ERC721Enumerable nft;


    constructor(ERC721Enumerable _nft) Ownable(msg.sender) {
        nft = _nft;
        holder = payable(msg.sender);
    }

    function getListingFee() public view returns(uint256) {
        return listingFee;
    }

    function listSale(uint256 tokenId, uint256 price) public payable nonReentrant{
        require(nft.ownerOf(tokenId) == msg.sender, "not your nfts");
        require(vaultItems[tokenId].tokenId == 0, "nft already listed");
        require(price >0, "amount msut be highter than 0");
        require(msg.value == listingFee, "please transfer 0.00025 ether crypto to pay listing fee");

        vaultItems[tokenId] = List(tokenId,payable(msg.sender),payable(address(this)),price,false);

        nft.transferFrom(msg.sender,address(this),tokenId);
        emit NFTListCreated(tokenId,msg.sender,address(this),price,false);
    }

    function cancelSale(uint256 tokenId) public nonReentrant {
        require(vaultItems[tokenId].seller == msg.sender, "not your nft");
        nft.transferFrom(address(this),msg.sender,tokenId);
        delete vaultItems[tokenId];
    }

    function buyNft(uint256 tokenId) public payable nonReentrant{
        uint256 price = vaultItems[tokenId].price;
        require(msg.value == price, "amount is enought");
        vaultItems[tokenId].seller.transfer(msg.value);
        nft.transferFrom(address(this),msg.sender,tokenId);
        vaultItems[tokenId].sold = true;
        delete vaultItems[tokenId];
    }
    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns(bytes4){
        return IERC721Receiver.onERC721Received.selector; 
    }
}