// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";
contract Market is Ownable, ReentrancyGuard{
    
    uint256 private _itemIds;
    uint256 private _itemsSold;

    address payable holder;

    uint256 private listFee = 0.0025 ether;
    uint256 private mintFee = 0.0075 ether;

    constructor() Ownable(msg.sender){
        holder = payable(msg.sender);        
    }

    struct ValutItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable holder;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => ValutItem) private idToValutItem;

    event ValutItemCreate(
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address holder,
        uint256 price,
        bool sold
    );

    function getListFee() public view returns(uint256) {
        return listFee;
    }


    function createValutItem(address nftContract,uint256 tokenId, uint256 price) public payable nonReentrant{
        require(price> 0, "prive not is zero");
        require(msg.value == listFee, 'prive cannot be listing fee');

        _itemIds++;
        idToValutItem[_itemIds] = ValutItem(
            _itemIds,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        IERC721(nftContract).transferFrom(msg.sender,address(this),tokenId);
        emit ValutItemCreate(
            _itemIds,
            nftContract,
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function marketSale(address nftContract,uint256 itemId) public payable nonReentrant{
        uint256 price = idToValutItem[itemId].price;
        uint256 tokenId = idToValutItem[itemId].tokenId;
        require(msg.value == price, "amount in enought");

        idToValutItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this),msg.sender,tokenId);

        
        idToValutItem[itemId].sold = true;
        idToValutItem[itemId].holder = payable(msg.sender);

        _itemsSold++;
        payable(holder).transfer(listFee);

    }
    // 合约持有的 nft
    function getAvailableNft() public view returns(ValutItem[] memory){
        uint currentIndex = 0;
        uint unSaleAmount = _itemIds - _itemsSold;
        ValutItem[] memory availableList = new ValutItem[](unSaleAmount);

        for (uint i = 0; i < _itemIds; i++) {
            if(idToValutItem[i+1].holder == address(this)){
                ValutItem storage item = idToValutItem[i+1];
                availableList[currentIndex] = item;
                currentIndex += 1;
            }
        }

        return availableList;

    }

    // 获取某地址持有的 nft
    function getMyNfts(address adr) public view returns(ValutItem[] memory){
        uint count = 0;
        for (uint i = 0; i < _itemIds; i++) {
            if(idToValutItem[i+1].holder == adr){
                count += 1;
            }
        }
        ValutItem[] memory nftList = new ValutItem[](count);
        uint currentIndex = 0;
        for (uint i = 0; i < _itemIds; i++) {
            if(idToValutItem[i+1].holder == adr){
                nftList[currentIndex] = idToValutItem[i+1];
                currentIndex += 1;
            }
        }
        return nftList;
    }

    // 获取某地址售卖的 nft

    function getMyMarketNfts(address adr) public view returns(ValutItem[] memory){
        uint count = 0;
        for (uint i = 0; i < _itemIds; i++) {
            if((idToValutItem[i+1].seller == adr) && (idToValutItem[i+1].holder == address(this))){
                count += 1;
            }
        }
        
        uint currentIndex = 0;
        ValutItem[] memory nftList = new ValutItem[](count);

        for (uint i = 0; i < _itemIds; i++) {
            if((idToValutItem[i+1].seller == adr) && (idToValutItem[i+1].holder == address(this))){
                nftList[currentIndex] = idToValutItem[i+1];
                currentIndex += 1;
            }
        }

        return nftList;
    }
    // 获取某个信息
    function getNftInfoByTokenId(address nftAddr,uint256 tokenId) public view returns(ValutItem memory){
        ValutItem memory item;
        for(uint i =0; i<_itemIds; i++){
            if((idToValutItem[i+1].nftContract == nftAddr) && (idToValutItem[i+1].tokenId == tokenId)){
                item = idToValutItem[i+1];
            }
        }
        return item;
    }
    function withDraw() payable public onlyOwner nonReentrant{
        (bool isSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(isSuccess, "withDraw faild");
    }
}