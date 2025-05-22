/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Auction } from "../types";
import { getAuctions } from "../data/auctions";
import { AuctionCard } from "../components/auction/AuctionCard";
import { Button } from "../components/ui/Button";

export const HomePage: React.FC = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await getAuctions();
        setFeaturedAuctions(data);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-teal-900/40"></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-teal-300 to-purple-400">
            Mint NFTs & Create Auctions
            <br />
            on Lisk Blockchain
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-300">
            Mint unique NFTs and auction them securely on the blockchain.
            Explore rare collectibles with transparent ownership history.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/create">
              <Button size="lg" className="group">
                Mint NFT & Create Auction
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auctions">
              <Button variant="outline" size="lg">
                Explore Auctions
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="text-center px-4">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
                5.2K+
              </p>
              <p className="text-gray-400">Auctions</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
                2.8K+
              </p>
              <p className="text-gray-400">Users</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
                12.5M
              </p>
              <p className="text-gray-400">LSK Volume</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Auctions</h2>
          <Link
            to="/auctions"
            className="text-purple-400 hover:text-purple-300 flex items-center"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl h-[320px]"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 relative">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-400">
                Link your Lisk wallet to start bidding and creating auctions on
                the platform.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 relative">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse or Create</h3>
              <p className="text-gray-400">
                Explore existing auctions or create your own by uploading assets
                and setting terms.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 relative">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Bid & Win</h3>
              <p className="text-gray-400">
                Place bids on your favorite items and track auctions until they
                close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-teal-900/50"></div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Bidding?</h2>
          <p className="text-gray-300 mb-8">
            Join the decentralized auction revolution today and discover unique
            digital assets.
          </p>
          <Link to="/auctions">
            <Button size="lg" className="group">
              Explore Auctions
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
