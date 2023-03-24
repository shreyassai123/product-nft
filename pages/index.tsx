import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Web3 from "web3";
import SupplyChain from "../build/contracts/SupplyChain.json";
import ProductNFT from "../build/contracts/ProductNFT.json";
import React from "react";
import { AbiItem } from "web3-utils";

declare var window: any

// pages/index.js

export default function Home() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [supplyChainContract, setSupplyChainContract] = useState<any | null>(null);
  const [productNFTContract, setProductNFTContract] = useState<any | null>(null);
  const [accounts, setAccounts] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    manufacturer: "",
    manufacturingDate: "",
    price: "",
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const supplyChainContract = new web3.eth.Contract(
          SupplyChain.abi as any,
          process.env.SUPPLY_CHAIN_ADDRESS
        );
        setSupplyChainContract(supplyChainContract);
        const productNFTContract = new web3.eth.Contract(
          ProductNFT.abi as any,
          process.env.PRODUCT_NFT_ADDRESS
        );
        setProductNFTContract(productNFTContract);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please install Metamask to use this app");
    }
  };

  const createProduct = async () => {
    try {
      await supplyChainContract.methods
        .createProduct(
          product.name,
          product.description,
          product.manufacturer,
          Date.parse(product.manufacturingDate) / 1000,
          web3.utils.toWei(product.price.toString())
        )
        .send({ from: accounts[0] });
      alert("Product created successfully");
      setProduct({
        name: "",
        description: "",
        manufacturer: "",
        manufacturingDate: "",
        price: "",
      });
    } catch (error) {
      console.log(error);
      alert("Error creating product");
    }
  };

  const addRewardPoints = async () => {
    try {
      await productNFTContract.methods
        .addRewardPoints(accounts[0])
        .send({ from: accounts[0] });
      alert("Reward points added successfully");
    } catch (error) {
      console.error(error);
      alert("Error adding reward points");
    }
  };

  console.log(productNFTContract)
  console.log(supplyChainContract)

  return (
    <div>
      <Head>
        <title>ProductNFT App</title>
      </Head>

      <main>
        <h1>ProductNFT App</h1>
        <p>
          {accounts.length > 0 ? (
            `Connected to Metamask as ${accounts[0]}`
          ) : (
            <button onClick={connectWallet}>Connect to Metamask</button>
          )}
        </p>
        <form onSubmit={createProduct}>
          <h2>Create Product</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div>
            <label>Manufacturer:</label>
            <input
              type="text"
              value={product.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Manufacturing Date:</label>
            <input
              type="date"
              value={product.manufacturingDate}
              onChange={(e) =>
                setProduct({ ...product, manufacturingDate: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
        <div>
          <h2>Actions</h2>
          <button onClick={addRewardPoints}>Add Reward Points</button>
        </div>
      </main>
    </div>
  );
}
