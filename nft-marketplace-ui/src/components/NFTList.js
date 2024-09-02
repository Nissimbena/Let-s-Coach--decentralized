import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const NFTList = ({ contractAddress, nftContractAbi }) => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNFTs = async () => {
            setLoading(true);
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(contractAddress, nftContractAbi, provider);
                const totalSupply = await contract.totalSupply();
                const nftData = [];

                for (let i = 1; i <= totalSupply; i++) {
                    const tokenId = i;
                    const owner = await contract.ownerOf(tokenId);
                    const tokenURI = await contract.tokenURI(tokenId);
                    nftData.push({ tokenId, owner, tokenURI });
                }

                setNfts(nftData);
            } catch (error) {
                console.error("Error loading NFTs:", error);
            }
            setLoading(false);
        };

        loadNFTs();
    }, [contractAddress, nftContractAbi]);

    if (loading) return <p>Loading NFTs...</p>;

    return (
        <div>
            <h2>Available NFTs</h2>
            <ul>
                {nfts.map((nft) => (
                    <li key={nft.tokenId}>
                        <p>Token ID: {nft.tokenId}</p>
                        <p>Owner: {nft.owner}</p>
                        <p>Token URI: <a href={nft.tokenURI} target="_blank" rel="noopener noreferrer">{nft.tokenURI}</a></p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NFTList;
