import React from 'react';
import { Link } from 'react-router-dom';
import { Auction } from '../../types';
import { CountdownTimer } from './CountdownTimer';

interface AuctionCardProps {
  auction: Auction;
  size?: 'sm' | 'md' | 'lg';
  highlightBorder?: boolean;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ 
  auction, 
  size = 'md',
  highlightBorder = false,
}) => {
  const { id, name, imageUrl, currentBid, endTime, seller } = auction;

  // Truncate name based on size
  const truncateName = (name: string, maxLength: number) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  const displayName = size === 'sm' ? truncateName(name, 15) : truncateName(name, 30);
  const sellerName = seller.username || `${seller.address.substring(0, 5)}...${seller.address.substring(seller.address.length - 4)}`;

  // Calculate if auction is ending soon (less than 24 hours)
  const isEndingSoon = new Date(endTime).getTime() - new Date().getTime() < 86400000;

  const sizeClasses = {
    sm: 'max-w-[240px]',
    md: 'max-w-sm',
    lg: 'max-w-md',
  };

  const imageClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  return (
    <Link
      to={`/auction/${id}`}
      className={`
        block rounded-xl overflow-hidden bg-gray-800 border transition-all duration-300
        hover:transform hover:scale-[1.02] hover:shadow-xl
        ${highlightBorder ? 'border-purple-500/50' : 'border-gray-700'}
        ${sizeClasses[size]}
      `}
    >
      <div className={`w-full ${imageClasses[size]} relative overflow-hidden bg-gray-900`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        {isEndingSoon && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Ending Soon
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-white text-lg mb-1">
            {displayName}
          </h3>
          <div className="bg-gray-900 rounded-md px-2 py-1 text-gray-300 text-xs">
            By {sellerName}
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs">Current Bid</p>
            <p className="text-white font-bold">{currentBid} LSK</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Ends in</p>
            <CountdownTimer endTime={endTime} compact={size === 'sm'} />
          </div>
        </div>
      </div>
    </Link>
  );
};