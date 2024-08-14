// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BYBYNft is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId = 1;
    uint256 public constant mintPrice = 5000000000000000;
    uint256 public constant maxPurchase = 2;
    uint8 public constant MAXBYBY = 20;
    bool public paused = false;

    constructor(
        
    ) ERC721("BYBY NFT Collection", "BYBY") Ownable(msg.sender) {}

    function withDraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function safeMint(address to) internal{
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(
            tokenId,
            string.concat(
                "ipfs://QmSA9oZsiHwajUrHZzTVHtee99hpCo9BP7ZrRvNiC7kxN3/",
                Strings.toString(tokenId)
            )
        );
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    // function _baseURI() internal pure override(ERC721) returns(string memory){
    //     return "ipfs://QmSA9oZsiHwajUrHZzTVHtee99hpCo9BP7ZrRvNiC7kxN3/";
    // }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintBYBY(uint8 mintNum) public payable {
        require(paused, "the minting has not yet begun");
        require(mintNum <= maxPurchase, "Can only mint 2 tokens at a time");
        require(
            (mintPrice * mintNum) <= msg.value,
            "Ether value sent is not correct"
        );
        require(
            (totalSupply() + mintNum) <= MAXBYBY,
            "Purchase would exceed max supply"
        );

        for (uint i = 0; i < mintNum; i++) {
            if (totalSupply() < MAXBYBY) {
                safeMint(msg.sender);
            }
        }
    }
    function walletOfOwner(address _owner) public view returns(uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint i = 0; i < tokenIds.length; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner,i);
        }
        return tokenIds;

    }
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
}
