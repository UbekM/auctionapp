/** @format */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Flag, CalendarDays } from "lucide-react";
import { Auction } from "../types";
import { getAuctionById } from "../data/auctions";
import { Button } from "../components/ui/Button";
import { CountdownTimer } from "../components/auction/CountdownTimer";
import { BidHistory } from "../components/auction/BidHistory";
import { PlaceBidForm } from "../components/auction/PlaceBidForm";

export const AuctionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getAuctionById(id);

        if (!data) {
          setError("Auction not found");
          return;
        }

        setAuction(data);

        // Check if auction has ended
        setIsAuctionEnded(new Date(data.endTime) < new Date());
      } catch (error) {
        console.error("Failed to fetch auction:", error);
        setError("Failed to load auction details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  const handleBidPlaced = (amount: number) => {
    if (!auction) return;

    // Create a new bid
    const newBid = {
      id: `b${Date.now()}`,
      auctionId: auction.id,
      bidder: {
        address: "5R7Rrw3NCDixJG7aTwm378oa7JvCGQFj4nzy1vWBxQ9D",
        username: "CryptoEnthusiast",
      },
      amount,
      timestamp: new Date(),
    };

    // Update auction with new bid
    setAuction({
      ...auction,
      currentBid: amount,
      bids: [newBid, ...auction.bids],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[400px] bg-gray-800 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-800 rounded w-3/4"></div>
                <div className="h-6 bg-gray-800 rounded w-1/2"></div>
                <div className="h-24 bg-gray-800 rounded w-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error || "Auction not found"}</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/auctions"
            className="inline-flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Auctions
          </Link>
        </div>

        {/* Auction Details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column (Image) */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <img
                src={auction.imageUrl}
                alt={auction.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Tabs Navigation */}
            <div className="mt-8 mb-4 border-b border-gray-700">
              <div className="flex space-x-8">
                <button
                  className={`pb-4 px-1 text-sm font-medium ${
                    activeTab === "details"
                      ? "text-white border-b-2 border-purple-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`pb-4 px-1 text-sm font-medium flex items-center ${
                    activeTab === "history"
                      ? "text-white border-b-2 border-purple-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Bid History
                  <span className="ml-2 bg-gray-700 text-white rounded-full text-xs py-0.5 px-2">
                    {auction.bids.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-300">{auction.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Seller Information
                    </h3>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {auction.seller.username
                            ? auction.seller.username.charAt(0).toUpperCase()
                            : "?"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-medium">
                          {auction.seller.username || "Anonymous Seller"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {auction.seller.address.substring(0, 10)}...
                          {auction.seller.address.substring(
                            auction.seller.address.length - 6
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Auction Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center text-gray-400 mb-1">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">Started</span>
                        </div>
                        <p className="text-white">
                          {new Date(
                            auction.endTime.getTime() - 7 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center text-gray-400 mb-1">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">Ends</span>
                        </div>
                        <p className="text-white">
                          {new Date(auction.endTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && <BidHistory bids={auction.bids} />}
            </div>
          </div>

          {/* Right Column (Auction Info) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{auction.name}</h1>
              <div className="flex justify-between items-center">
                <div className="text-gray-400">
                  ID: {auction.id.substring(0, 8)}...
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-white p-1">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white p-1">
                    <Flag className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Current Bid</p>
                  <p className="text-2xl font-bold">{auction.currentBid} LSK</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Auction Ends In</p>
                  <CountdownTimer
                    endTime={auction.endTime}
                    onComplete={() => setIsAuctionEnded(true)}
                  />
                </div>
              </div>

              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-teal-400"
                  style={{
                    width: `${Math.min(
                      100,
                      (auction.currentBid / auction.startingBid) * 100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-sm mb-6">
                <div>
                  <p className="text-gray-400">Starting Bid</p>
                  <p className="text-white">{auction.startingBid} LSK</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Bid Count</p>
                  <p className="text-white">{auction.bids.length}</p>
                </div>
              </div>
            </div>

            {/* NFT Info Section */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                NFT Details
              </h3>
              {auction.nft ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                  <div className="text-gray-300 text-sm mb-2 sm:mb-0">
                    <span className="font-medium text-white">Contract:</span>{" "}
                    {auction.nft.contract}
                  </div>
                  <div className="text-gray-300 text-sm mb-2 sm:mb-0">
                    <span className="font-medium text-white">Token ID:</span>{" "}
                    {auction.nft.tokenId}
                  </div>
                  <a
                    href={`https://explorer.lisk.com/token/${auction.nft.contract}/${auction.nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors duration-200 mt-2 sm:mt-0"
                  >
                    View NFT
                  </a>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  No NFT details available.
                </div>
              )}
            </div>

            <PlaceBidForm
              auctionId={auction.id}
              currentBid={auction.currentBid}
              onBidPlaced={handleBidPlaced}
              isEnded={isAuctionEnded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
