// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BYBY.sol";
import "./BYBYNft.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NftStaking is  Ownable, IERC721Receiver{
    BYBYNft nft;
    BYBY token;

    uint256 public totalStaked;
    struct Stake {
        uint24 tokenId;
        uint48 timestamp;
        address owner;
    }

    event NFTStaked(address owner, uint256 tokenId, uint256 timestamp);
    event NFTUnstaked(address owner, uint256 tokenId, uint256 timestamp);
    event Claimed(address owner, uint256 amount);

    mapping(uint256 => Stake) public vault;

    constructor(BYBYNft _nft, BYBY _token) Ownable(msg.sender){
        nft = _nft;
        token = _token;
    }

    function stake(uint256[] calldata tokenIds) external {
        uint256 tokenId;
        totalStaked += tokenIds.length;
        for (uint i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];
            require(nft.ownerOf(tokenId) == msg.sender, "not your nft");
            require(vault[tokenId].tokenId == 0, 'already staked');

            nft.safeTransferFrom(msg.sender,address(this),tokenId);
            emit NFTStaked(msg.sender,tokenId,block.timestamp);

            vault[tokenId] = Stake({
                tokenId: uint24(tokenId),
                timestamp: uint48(block.timestamp),
                owner: msg.sender
            });
        }
    }

    function _unstakeMore(address account,uint256[] calldata tokenIds) internal {
        uint256 tokenId;
        totalStaked -= tokenIds.length;
        for (uint i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];
            Stake memory staked = vault[tokenId];
            require(staked.owner == msg.sender, "not your nft");
            require(staked.tokenId != 0, "not already staked");

            delete vault[tokenId];
            emit NFTUnstaked(account,tokenId,block.timestamp);
            nft.safeTransferFrom(address(this),account,tokenId);
        }
    }

    function _claim(address account, uint256[] calldata tokenIds, bool _state) internal {
        uint256 tokenId;
        uint256 earned = 0;

        for (uint i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];
            Stake memory staked = vault[tokenId];
            require(staked.owner == account, "not your nft");
            uint256 stakedAt = staked.timestamp;
            earned += (block.timestamp - stakedAt) * 100000000000;

            vault[tokenId] = Stake({
                owner: account,
                tokenId: uint24(tokenId),
                timestamp: uint48(block.timestamp)
            });
        }

         if(earned > 10){
            earned = earned / 10;
            token.mint(account, earned);
        }
        if(_state){
            _unstakeMore(account, tokenIds);
        }

        emit Claimed(account,earned);
    }
    function claim(uint256[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds,false);
    }
    function claimForAddress(address account,uint256[] calldata tokenIds) external {
        _claim(account, tokenIds, false);
    }
    function unstake(uint256[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, true);
    }

    function earningInfo(uint256[] calldata tokenIds) external view returns(uint256[2] memory info){
        uint256 tokenId;
        uint256 earned = 0;
        uint256 earnRatePerSecond = 1000 * 100000000000;
        for (uint i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];
            Stake memory staked = vault[tokenId];
            uint256 stakedAt = staked.timestamp;
            earned += (block.timestamp - stakedAt) * 100000000000;
        }

        return [earned, earnRatePerSecond];
    }
    function balanceOf(address account) public view returns(uint256) {
        uint256 balance = nft.balanceOf(account);
        return  balance;
    }

    function nftOfOwner(address account) public view returns(uint256[] memory ownerTokens) {
        uint256 supply = nft.totalSupply();
        uint256[] memory tmp = new uint256[](supply);
        uint256 index = 0;
        for (uint i = 1; i <= supply; i++) {
            if(vault[i].owner == account){
                tmp[index] = vault[i].tokenId;
                index +=1;
            }
        }
        uint256[] memory tokens = new uint256[](index);
        for (uint i = 0; i < tokens.length; i++) {
            tokens[i] = tmp[i];
        }
        return tokens;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns(bytes4){
        // require(from == address(0x0),"cannot send nfts to Vault directly");
        return IERC721Receiver.onERC721Received.selector;
    }
}