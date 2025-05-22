/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Info, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import { addAuction } from "../data/auctions";
import { ethers } from "ethers";
import { AUCTION_NFT_ADDRESS, AUCTION_NFT_ABI } from "../data/auctionNFT";
import { NFTStorage, File as NFTFile } from "nft.storage";

export const CreateAuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    startingBid: 100,
    duration: 7, // days
    imagePreview: "",
    imageFile: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === "startingBid" ? parseInt(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setFormState({
        ...formState,
        imagePreview: reader.result as string,
        imageFile: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormState({
      ...formState,
      imagePreview: "",
      imageFile: null,
    });
  };


  const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY as string;

  console.log("NFT_STORAGE_KEY", NFT_STORAGE_KEY);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setFormError("Please connect your wallet to create an auction");
      return;
    }

    if (!formState.name || !formState.description || !formState.imageFile) {
      setFormError("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload image and metadata to IPFS via NFT.Storage
      const client = new NFTStorage({ token: NFT_STORAGE_KEY });
      const metadata = await client.store({
        name: formState.name,
        description: formState.description,
        image: new NFTFile([formState.imageFile], formState.imageFile.name, {
          type: formState.imageFile.type,
        }),
      });
      const metadataURI = metadata.url; // ipfs://... link

      // 2. Mint NFT on-chain with metadata URI
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        AUCTION_NFT_ADDRESS,
        AUCTION_NFT_ABI,
        signer
      );
      const tx = await contract.mintNFT(user.address, metadataURI);
      const receipt = await tx.wait();
      const transferEvent = receipt.logs
        .map((log) => contract.interface.parseLog(log))
        .find((e: unknown) => {
          if (typeof e === "object" && e !== null && "name" in e) {
            return (e as { name: string }).name === "Transfer";
          }
          return false;
        });
      const tokenId = transferEvent
        ? transferEvent.args.tokenId.toString()
        : "0";

      // 2.5. (TODO) Integrate with real on-chain auction contract here
      // Example:
      // const auctionContract = new ethers.Contract(
      //   AUCTION_CONTRACT_ADDRESS,
      //   AUCTION_CONTRACT_ABI,
      //   signer
      // );
      // const auctionTx = await auctionContract.createAuction(
      //   AUCTION_NFT_ADDRESS,
      //   tokenId,
      //   ethers.parseEther(formState.startingBid.toString()),
      //   formState.duration * 24 * 60 * 60 // duration in seconds
      // );
      // await auctionTx.wait();
      //
      // For now, we only add to mock data below.

      // 3. Add auction to mock data (simulate auction creation)
      const newAuction = {
        id: Date.now().toString(),
        name: formState.name,
        description: formState.description,
        imageUrl: metadata.data.image.href, // HTTP gateway link for display
        seller: {
          address: user.address,
          username: user.username,
        },
        startingBid: formState.startingBid,
        currentBid: formState.startingBid,
        endTime: new Date(
          Date.now() + formState.duration * 24 * 60 * 60 * 1000
        ),
        bids: [],
        nft: {
          contract: AUCTION_NFT_ADDRESS,
          tokenId,
        },
      };
      await addAuction(newAuction);
      navigate("/");
    } catch (error) {
      console.error("Error creating auction:", error);
      setFormError("Failed to create auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">
              Connect Wallet to Mint NFT & Create Auction
            </h1>
            <p className="text-gray-300 mb-8">
              You need to connect your wallet first to mint an NFT and create a
              new auction.
            </p>
            <Button>Connect Wallet</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mint NFT & Create Auction</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Item Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Item Image</h2>

            {formState.imagePreview ? (
              <div className="relative">
                <img
                  src={formState.imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-gray-900 p-1 rounded-full text-gray-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center"
                onClick={() => document.getElementById("imageUpload")?.click()}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-300 mb-2">
                  Click or drag to upload an image
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WEBP (max 5MB)
                </p>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </div>
            )}
          </div>

          {/* Auction Details */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Auction Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startingBid"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Starting Bid (LSK)*
                </label>
                <input
                  type="number"
                  id="startingBid"
                  name="startingBid"
                  value={formState.startingBid}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Duration*
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formState.duration}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-start">
            <Info className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-1">Service Fee</p>
              <p>
                A 2.5% fee will be charged on the final sale amount. This fee
                helps maintain and improve the platform.
              </p>
            </div>
          </div>

          {formError && (
            <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-800">
              {formError}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="group"
            >
              Mint NFT & Create Auction
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
