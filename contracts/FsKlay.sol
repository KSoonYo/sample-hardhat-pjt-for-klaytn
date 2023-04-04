// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/KIP/token/KIP7/IKIP7Receiver.sol";
import "@klaytn/contracts/KIP/utils/introspection/KIP13.sol";
import "@klaytn/contracts/utils/Context.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./library/KIP7Upgradeable.sol";



contract FsKlay is Context, IKIP7, KIP13 {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;


    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) _allowances;

    using AddressUpgradeable for address;

    constructor(){
        _name = 'My Flash Token';
        _symbol = 'FsKlay';
        _totalSupply = 0;

        _safeMint(_msgSender(), 99999999999999);
    }       
     
    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }


    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256){
        return _totalSupply;
    }

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256){
        return _balances[account];
    }

    /**
     * @dev See {IKIP13-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(KIP13) returns (bool) {
        return
            interfaceId == type(IKIP7).interfaceId ||
            KIP13.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `account` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve}, {transferFrom}, or {safeTransferFrom} are called.
     */
    function allowance(address account, address spender) public view virtual override returns (uint256){
        return _allowances[account][spender];
    }


    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool){
        _transfer(_msgSender(), to, amount);
        return true;
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool){
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool){  
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }


  /**
     * @dev  Moves `amount` tokens from the caller's account to `recipient`.
     *s
     * Emits a {Transfer} event.
     */
    function safeTransfer(address recipient, uint256 amount) public virtual override {
        _safeTransfer(_msgSender(), recipient, amount, "");
    }

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`
     * and passes `data` for {IKIP7Receiver-onKIP7Received} handler logic.
     *
     * Emits a {Transfer} event.
     */
    function safeTransfer(
        address recipient,
        uint256 amount,
        bytes memory _data
    ) public virtual override{
        _safeTransfer(_msgSender(), recipient, amount, _data);
    }



    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the {allowance} mechanism.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override {
        address spender = _msgSender();
        _spendAllowance(sender, spender, amount);
        _safeTransfer(sender, recipient, amount, "");
    }
  

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the {allowance} mechanism
     * and passes `data` for {IKIP7Receiver-onKIP7Received} handler logic.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address sender,
        address recipient,
        uint256 amount,
        bytes memory _data
    ) public virtual override {
        address spender = _msgSender();
        _spendAllowance(sender, spender, amount);
        _safeTransfer(sender, recipient, amount, _data);
    }


    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "KIP7: transfer from the zero address");
        require(to != address(0), "KIP7: transfer to the zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, 'KIP7: Not enough balances');
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        console.log(    "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );
        emit Transfer(from, to, amount);
    }

    /**
     * @dev Safely transfers `amout` token from `from` to `to`, checking first that contract recipients
     * are aware of the KIP7 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to` to be used
     * for additional KIP7 receiver handler logic
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - if `to` is a contract it must implement {IKIP7Receiver} and
     * - If `to` refers to a smart contract, it must implement {IKIP7Receiver}, which is called upon
     *   a safe transfer.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 amount,
        bytes memory _data
    ) internal virtual {
        _transfer(from, to, amount);
        require(_checkOnKIP7Received(from, to, amount, _data), "KIP7: transfer to non IKIP7Receiver implementer");
    }

    /**
     * @dev Internal function to invoke {IKIP7Receiver-onKIP7Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of transfer token amount
     * @param to target address that will receive the tokens
     * @param amount uint256 value to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnKIP7Received(
        address from,
        address to,
        uint256 amount,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try IKIP7Receiver(to).onKIP7Received(_msgSender(), from, amount, _data) returns (bytes4 retval) {
                return retval == IKIP7Receiver.onKIP7Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("KIP7: transfer to non KIP7Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Updates `account` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address account,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(account, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "KIP7: insufficient allowance");
            unchecked {
                _approve(account, spender, currentAllowance - amount);
            }
        }
    }


    /**
     * @dev Sets `amount` as the allowance of `spender` over the `account` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address account, address spender, uint256 amount) internal virtual{
        require(account != address(0), "KIP7: approve from the zero address");
        require(spender != address(0), "KIP7: approve to the zero address");

        _allowances[account][spender] = amount;
        emit Approval(account, spender, amount);
    }


    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "KIP7: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
    /**
     * @dev Safely mints `amount` and transfers it to `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - If `account` refers to a smart contract, it must implement {IKIP7Receiver-onKIP7Received},
     *   which is called upon a safe mint.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address account, uint256 amount) internal virtual {
        _safeMint(account, amount, "");
    }

    /**
     * @dev Same as {xref-KIP7-_safeMint-address-uint256-}[`_safeMint`], with an additional `_data` parameter which is
     * forwarded in {IKIP7Receiver-onKIP7Received} to contract recipients.
     */
    function _safeMint(
        address account,
        uint256 amount,
        bytes memory _data
    ) internal virtual {
        _mint(account, amount);
        require(
            _checkOnKIP7Received(address(0), account, amount, _data),
            "KIP7: transfer to non IKIP7Receiver implementer"
        );
    }
}

