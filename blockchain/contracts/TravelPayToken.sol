// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol"; 

contract TravelPayToken is ERC20, Ownable, Pausable {
    // Token configuration
    uint256 private constant INITIAL_SUPPLY = 1000000000 * 10**18; 
    uint256 public transactionFeePercent = 1; 
    uint256 public cashbackPercent = 2; 
    
    // Platform addresses
    address public platformWallet;
    address public cashbackWallet;
    
    // Mapping for whitelisted addresses (no fees)
    mapping(address => bool) public isWhitelisted;
    
    // Booking tracking
    mapping(bytes32 => BookingPayment) public bookingPayments;
    
    struct BookingPayment {
        address customer;
        uint256 amount;
        uint256 timestamp;
        bool completed;
        bool refunded;
    }
    
    // Events
    event BookingPaid(bytes32 indexed bookingId, address indexed customer, uint256 amount);
    event BookingRefunded(bytes32 indexed bookingId, address indexed customer, uint256 amount);
    event CashbackPaid(address indexed customer, uint256 amount);
    event FeeCollected(address indexed from, uint256 amount);
    
    constructor(
        address _platformWallet,
        address _cashbackWallet
    ) ERC20("TravelPay Token", "TPT") Ownable(msg.sender) { // SỬA: Thêm Ownable(msg.sender)
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(_cashbackWallet != address(0), "Invalid cashback wallet");
        
        platformWallet = _platformWallet;
        cashbackWallet = _cashbackWallet;
        
        _mint(msg.sender, INITIAL_SUPPLY);
        
        isWhitelisted[_platformWallet] = true;
        isWhitelisted[_cashbackWallet] = true;
        isWhitelisted[msg.sender] = true;
    }
    
    // Override transfer để tính phí
    function transfer(address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        address from = _msgSender();
        
        if (isWhitelisted[from] || isWhitelisted[to]) {
            _transfer(from, to, amount);
        } else {
            uint256 fee = (amount * transactionFeePercent) / 100;
            uint256 amountAfterFee = amount - fee;
            
            _transfer(from, platformWallet, fee);
            emit FeeCollected(from, fee);
            
            _transfer(from, to, amountAfterFee);
        }
        
        return true;
    }
    
    // Override transferFrom để tính phí
    function transferFrom(address from, address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        
        if (isWhitelisted[from] || isWhitelisted[to]) {
            _transfer(from, to, amount);
        } else {
            uint256 fee = (amount * transactionFeePercent) / 100;
            uint256 amountAfterFee = amount - fee;
            
            _transfer(from, platformWallet, fee);
            emit FeeCollected(from, fee);
            
            _transfer(from, to, amountAfterFee);
        }
        
        return true;
    }
    
    function payBooking(
        bytes32 bookingId,
        address provider,
        uint256 amount
    ) external whenNotPaused returns (bool) {
        require(bookingPayments[bookingId].customer == address(0), "Booking already paid");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(_msgSender()) >= amount, "Insufficient balance");
        
        // Chuyển tiền từ khách sang provider (đã trừ phí nếu transfer override logic áp dụng, 
        // nhưng ở đây hàm gọi _transfer trực tiếp nên KHÔNG mất phí giao dịch booking)
        _transfer(_msgSender(), provider, amount);
        
        bookingPayments[bookingId] = BookingPayment({
            customer: _msgSender(),
            amount: amount,
            timestamp: block.timestamp,
            completed: true,
            refunded: false
        });
        
        emit BookingPaid(bookingId, _msgSender(), amount);
        
        // Trả Cashback
        uint256 cashbackAmount = (amount * cashbackPercent) / 100;
        if (balanceOf(cashbackWallet) >= cashbackAmount) {
            _transfer(cashbackWallet, _msgSender(), cashbackAmount);
            emit CashbackPaid(_msgSender(), cashbackAmount);
        }
        
        return true;
    }
    
    // Hàm này cho phép Owner cưỡng chế hoàn tiền từ Provider trả lại Customer
    function refundBooking(
        bytes32 bookingId,
        address provider
    ) external onlyOwner returns (bool) {
        BookingPayment storage payment = bookingPayments[bookingId];
        require(payment.customer != address(0), "Booking not found");
        require(!payment.refunded, "Booking already refunded");
        
        // Admin force transfer
        _transfer(provider, payment.customer, payment.amount);
        
        payment.refunded = true;
        
        emit BookingRefunded(bookingId, payment.customer, payment.amount);
        
        return true;
    }
    
    function setTransactionFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 5, "Fee too high");
        transactionFeePercent = _feePercent;
    }
    
    function setCashbackPercent(uint256 _cashbackPercent) external onlyOwner {
        require(_cashbackPercent <= 10, "Cashback too high");
        cashbackPercent = _cashbackPercent;
    }
    
    function addToWhitelist(address account) external onlyOwner {
        isWhitelisted[account] = true;
    }
    
    function removeFromWhitelist(address account) external onlyOwner {
        isWhitelisted[account] = false;
    }
    
    function setPlatformWallet(address _platformWallet) external onlyOwner {
        require(_platformWallet != address(0), "Invalid address");
        platformWallet = _platformWallet;
    }
    
    function setCashbackWallet(address _cashbackWallet) external onlyOwner {
        require(_cashbackWallet != address(0), "Invalid address");
        cashbackWallet = _cashbackWallet;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function getBookingPayment(bytes32 bookingId) external view returns (
        address customer,
        uint256 amount,
        uint256 timestamp,
        bool completed,
        bool refunded
    ) {
        BookingPayment memory payment = bookingPayments[bookingId];
        return (
            payment.customer,
            payment.amount,
            payment.timestamp,
            payment.completed,
            payment.refunded
        );
    }
    
    function vndToTPT(uint256 vndAmount) public pure returns (uint256) {
        // Giả sử 1000 VND = 1 TPT
        return vndAmount / 1000;
    }
    
    function tptToVND(uint256 tptAmount) public pure returns (uint256) {
        return tptAmount * 1000;
    }
}