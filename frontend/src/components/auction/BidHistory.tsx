import React from 'react';
import { Bid } from '../../types';

interface BidHistoryProps {
  bids: Bid[];
}

export const BidHistory: React.FC<BidHistoryProps> = ({ bids }) => {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No bids yet. Be the first to bid!</p>
      </div>
    );
  }

  // Sort bids in descending order (newest first)
  const sortedBids = [...bids].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Bidder
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedBids.map((bid, index) => (
              <tr key={bid.id} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {bid.bidder.username ? bid.bidder.username.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        {bid.bidder.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {bid.bidder.address.substring(0, 8)}...{bid.bidder.address.substring(bid.bidder.address.length - 8)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-white">
                    {bid.amount} LSK
                  </span>
                  {index === 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500 bg-opacity-20 text-green-400">
                      Highest
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(bid.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};