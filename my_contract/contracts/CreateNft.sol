// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CreateNft is ERC721URIStorage, Ownable {

    uint256 private tokenIds;
    uint256 public cost = 0.0075 ether;
    address  contractAddress;
    constructor(address marketContract) ERC721("ZhouMarket","ZHOU") Ownable(msg.sender) {
        contractAddress = marketContract;
    }
    // 免费铸造
    function createNFT(string memory tokenURI) public returns(uint) {
        tokenIds++;
        _mint(msg.sender,tokenIds);
        _setTokenURI(tokenIds,tokenURI);
        setApprovalForAll(contractAddress,true);
        return tokenIds;
    }
    // 收费铸造
    function mintNFT(string memory tokenURI) public payable returns(uint) {
        require(msg.value == cost, "ming nft need 0.0075 ETH");
        tokenIds++;
        _mint(msg.sender,tokenIds);
        _setTokenURI(tokenIds,tokenURI);
        setApprovalForAll(contractAddress,true);
        return tokenIds;
    }
    // 获取数量
    function getTotalSupply() public view returns(uint256){
        return tokenIds;
    }
    function withDraw() public payable onlyOwner{
        (bool isSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(isSuccess,"withDraw failed");
    }
}
