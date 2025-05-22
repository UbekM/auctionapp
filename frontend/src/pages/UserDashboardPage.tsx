/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auction } from "../types";
import {
  getUserCreatedAuctions,
  getUserActiveBids,
  getUserWonAuctions,
} from "../data/auctions";
import { useAuth } from "../context/useAuth";
import { AuctionCard } from "../components/auction/AuctionCard";
import { Button } from "../components/ui/Button";

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"created" | "bids" | "won">(
    "created"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [createdAuctions, setCreatedAuctions] = useState<Auction[]>([]);
  const [activeBids, setActiveBids] = useState<Auction[]>([]);
  const [wonAuctions, setWonAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const [created, bids, won] = await Promise.all([
          getUserCreatedAuctions(user.address),
          getUserActiveBids(user.address),
          getUserWonAuctions(user.address),
        ]);

        setCreatedAuctions(created);
        setActiveBids(bids);
        setWonAuctions(won);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">
              Connect Wallet to View Dashboard
            </h1>
            <p className="text-gray-300 mb-8">
              You need to connect your wallet first to access your dashboard.
            </p>
            <Button>Connect Wallet</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-600 to-teal-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  {user.username || "Anonymous User"}
                </h1>
                <p className="text-gray-300 text-sm mt-1">
                  {user.address.substring(0, 12)}...
                  {user.address.substring(user.address.length - 8)}
                </p>
              </div>
            </div>
            <Link to="/create">
              <Button>Create New Auction</Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Created</p>
              <p className="text-2xl font-bold">{createdAuctions.length}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Active Bids</p>
              <p className="text-2xl font-bold">{activeBids.length}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Won</p>
              <p className="text-2xl font-bold">{wonAuctions.length}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Wallet Balance</p>
              <p className="text-2xl font-bold">1,425 LSK</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              className={`pb-4 px-1 text-sm font-medium ${
                activeTab === "created"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("created")}
            >
              My Auctions
              <span className="ml-2 bg-gray-700 text-white rounded-full text-xs py-0.5 px-2">
                {createdAuctions.length}
              </span>
            </button>
            <button
              className={`pb-4 px-1 text-sm font-medium ${
                activeTab === "bids"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("bids")}
            >
              Active Bids
              <span className="ml-2 bg-gray-700 text-white rounded-full text-xs py-0.5 px-2">
                {activeBids.length}
              </span>
            </button>
            <button
              className={`pb-4 px-1 text-sm font-medium ${
                activeTab === "won"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("won")}
            >
              Won Items
              <span className="ml-2 bg-gray-700 text-white rounded-full text-xs py-0.5 px-2">
                {wonAuctions.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl h-[320px]"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {activeTab === "created" && (
                <>
                  {createdAuctions.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                      <p className="text-gray-300 mb-4">
                        You haven't created any auctions yet
                      </p>
                      <Link to="/create">
                        <Button>Create Your First Auction</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {createdAuctions.map((auction) => (
                        <AuctionCard
                          key={auction.id}
                          auction={auction}
                          highlightBorder
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "bids" && (
                <>
                  {activeBids.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                      <p className="text-gray-300 mb-4">
                        You don't have any active bids
                      </p>
                      <Link to="/auctions">
                        <Button>Explore Auctions</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeBids.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "won" && (
                <>
                  {wonAuctions.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                      <p className="text-gray-300 mb-4">
                        You haven't won any auctions yet
                      </p>
                      <Link to="/auctions">
                        <Button>Explore Auctions</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wonAuctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
