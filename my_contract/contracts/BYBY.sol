// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract BYBY is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    // 添加控制器
    mapping(address => bool) controllers;
    // 余额查询
    mapping(address => uint256) private _balances;
    // owner
    address private _owner;
    //setting max supply value
    uint256 private _totalSupply;
    uint256 private MAXSUP;
    uint256 constant MAXIMUMSUPPLY = 21000000 * 10 ** 18;

    constructor() ERC20("BYBY", "BY") Ownable(msg.sender) ERC20Permit("BYBY") {
        _owner = msg.sender;
        controllers[msg.sender] = true;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function faucet(address to, uint256 amount) public onlyOwner {
        require(controllers[_owner], "Only controllers can mint");
        require(
            (MAXSUP + amount) <= MAXIMUMSUPPLY,
            "Maximum supply has been reached"
        );
        _totalSupply = _totalSupply + amount;
        MAXSUP = MAXSUP + amount;
        _balances[to] = _balances[to] + amount;

        _mint(to, amount);
    }

    function mint(address to, uint256 amount) external {
        require(controllers[to], "Only controllers can mint");
        require(
            (MAXSUP + amount) <= MAXIMUMSUPPLY,
            "Maximum supply has been reached"
        );
        _totalSupply = _totalSupply + amount;
        MAXSUP = MAXSUP + amount;
        _balances[to] = _balances[to] + amount;

        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }

    // add controller function
    function addController(address controller) external onlyOwner {
        require(controller != _owner, "owner already controller");
        controllers[controller] = true;
    }

    function removeController(address controller) external onlyOwner {
        require(controller != _owner, "owner canot remover");
        controllers[controller] = false;
    }

    function burn(uint256 value) public override {
        require(controllers[msg.sender], "Only controllers can burn");
        _totalSupply = _totalSupply - value;
        MAXSUP = MAXSUP - value;
        _balances[msg.sender] = _balances[msg.sender] - value;
        _burn(_msgSender(), value);
    }

    function burnFrom(
        address account,
        uint256 value
    ) public override onlyOwner {
        require(controllers[msg.sender], "Only controllers can burn");
        _spendAllowance(account, _msgSender(), value);
        _totalSupply = _totalSupply - value;
        MAXSUP = MAXSUP - value;
        _balances[account] = _balances[account] - value;
        _burn(account, value);
    }

    // add getter function
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function maxSupply() public pure returns (uint256) {
        return MAXIMUMSUPPLY;
    }
}
