//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    
    struct Product {
        uint256 productId;
        string name;
        string description;
        string manufacturer;
        uint256 manufacturingDate;
        uint256 price;
        string currentOwner;
        uint256 currentOwnerSince;
    }

    mapping(uint256 => Product) public products;
    uint256 public productId = 0;
    
    event ProductCreated(uint256 productId, string name, string description, string manufacturer, uint256 manufacturingDate, uint256 price);
    event OwnershipTransferred(uint256 productId, string previousOwner, string newOwner, uint256 transferDate);

    function createProduct(string memory _name, string memory _description, string memory _manufacturer, uint256 _manufacturingDate, uint256 _price) public {
        productId++;
        products[productId] = Product(productId, _name, _description, _manufacturer, _manufacturingDate, _price, "", 0);
        emit ProductCreated(productId, _name, _description, _manufacturer, _manufacturingDate, _price);
    }

    function transferOwnership(uint256 _productId, string memory _newOwner) public {
        require(_productId > 0 && _productId <= productId, "Invalid Product Id");
        require(bytes(_newOwner).length > 0, "New owner name is required");
        require(bytes(products[_productId].currentOwner).length > 0, "Product does not exist");

        string memory previousOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;
        products[_productId].currentOwnerSince = block.timestamp;
        emit OwnershipTransferred(_productId, previousOwner, _newOwner, block.timestamp);
    }
}