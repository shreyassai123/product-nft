//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProductNFT is ERC721 {
    
    struct ProductMetadata {
        uint256 productId;
        string name;
        string description;
        string manufacturer;
        uint256 manufacturingDate;
        uint256 price;
        string currentOwner;
        uint256 currentOwnerSince;
    }

    mapping(uint256 => ProductMetadata) public productMetadatas;
    uint256 public productId = 0;
    uint256 public rewardPoints = 10;
    
    event ProductNFTCreated(uint256 productId, string name, string description, string manufacturer, uint256 manufacturingDate, uint256 price, address owner);
    event RewardPointsAdded(address owner, uint256 rewardPoints);
    
    constructor() ERC721("ProductNFT", "PNFT") {}

    function createProductNFT(string memory _name, string memory _description, string memory _manufacturer, uint256 _manufacturingDate, uint256 _price, address _owner) public returns (uint256) {
        productId++;
        _mint(_owner, productId);
        ProductMetadata memory metadata = ProductMetadata(productId, _name, _description, _manufacturer, _manufacturingDate, _price, "", 0);
        productMetadatas[productId] = metadata;
        emit ProductNFTCreated(productId, _name, _description, _manufacturer, _manufacturingDate, _price, _owner);
        return productId;
    }

    function addRewardPoints(address _owner) public {
        require(balanceOf(_owner) > 0, "Atleast one ProductNFT must be owned to receive reward points");
        uint256 totalRewardPoints = balanceOf(_owner) * rewardPoints;
        emit RewardPointsAdded(_owner, totalRewardPoints);
    }

    function getProductMetadata(uint256 _productId) public view returns (ProductMetadata memory) {
        require(_exists(_productId), "Product NFT does not exist");
        return productMetadatas[_productId];
    }
}

