import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = '0x672D099696c8DD0FF9bc2E178cDC31613E090CB8';
const provider = new ethers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/a6e81e629a18433a91ffd9127bb663ba');
const contract = new ethers.Contract(contractAddress, ABI, provider);

function App() {
  const [tokenURIs, setTokenURIs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokenURIs() {
      try {
        const uris = [];
        const maxTokens = 50;

        for (let i = 1; i <= maxTokens; i++) {
          try {
            const uri = await contract.tokenURI(i);
            if (uri) {
              uris.push({ tokenId: i, uri });
            }
          } catch (error) {
            console.error(`Error fetching token URI for tokenId ${i}:`, error);
          }
        }

        setTokenURIs(uris);
      } catch (error) {
        console.error('Error fetching token URIs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokenURIs();
  }, []);

  return (
    <div className="App">
      <h1>NFT Display</h1>
      {loading ? (
        <p>Loading...</p>
      ) : tokenURIs.length > 0 ? (
        tokenURIs.map(({ tokenId, uri }) => (
          <div key={tokenId}>
            <img
              src={uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              alt={`NFT ${tokenId}`}
              className="nft-image" // שימוש במחלקת ה-CSS החדשה
            />
            <p>Token ID: {tokenId}</p>
          </div>
        ))
      ) : (
        <p>No NFTs found</p>
      )}
    </div>
  );
}

export default App;
