/** @format */

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/useAuth";

interface PlaceBidFormProps {
  auctionId: string;
  currentBid: number;
  onBidPlaced: (amount: number) => void;
  isEnded?: boolean;
}

export const PlaceBidForm: React.FC<PlaceBidFormProps> = ({
  auctionId,
  currentBid,
  onBidPlaced,
  isEnded = false,
}) => {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState<number>(currentBid + 50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value);
    setBidAmount(amount);

    if (amount <= currentBid) {
      setError(`Bid must be higher than the current bid (${currentBid} LSK)`);
    } else {
      setError(null);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Please connect your wallet to place a bid");
      return;
    }

    if (bidAmount <= currentBid) {
      setError(`Bid must be higher than the current bid (${currentBid} LSK)`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onBidPlaced(bidAmount);
      // Reset form after success
      setBidAmount(bidAmount + 50);
      setError(null);
    } catch (error) {
      setError("Failed to place bid. Please try again.");
      console.error("Bid error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEnded) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-300 text-center">This auction has ended</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-white font-semibold text-lg mb-4">Place a Bid</h3>

      {!user ? (
        <div className="text-center py-3">
          <p className="text-gray-300 mb-4">
            Connect your wallet to place a bid
          </p>
          <Button variant="primary">Connect Wallet</Button>
        </div>
      ) : (
        <form onSubmit={handleBidSubmit}>
          <div className="mb-4">
            <label
              htmlFor="bidAmount"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Bid Amount (LSK)
            </label>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={handleBidChange}
              min={currentBid + 1}
              step="10"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>Current Bid: {currentBid} LSK</span>
            <span>Min Increment: 1 LSK</span>
          </div>

          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Your bid</span>
              <span className="text-white font-medium">{bidAmount} LSK</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between">
              <span className="text-gray-400">Service fee (2%)</span>
              <span className="text-white font-medium">
                {(bidAmount * 0.02).toFixed(2)} LSK
              </span>
            </div>
            <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-medium">
                {(bidAmount * 1.02).toFixed(2)} LSK
              </span>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting || !user || bidAmount <= currentBid}
            className="group"
          >
            Place Bid
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      )}
    </div>
  );
};
