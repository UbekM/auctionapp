import React, { useState, useEffect } from 'react';
import { Auction } from '../types';
import { getAuctions } from '../data/auctions';
import { AuctionCard } from '../components/auction/AuctionCard';
import { Search, Filter } from 'lucide-react';

export const AuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'ending-soon' | 'newest' | 'highest-bid'>('ending-soon');
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        const data = await getAuctions();
        setAuctions(data);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAuctions = auctions.filter(auction => 
    auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    if (sortBy === 'ending-soon') {
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    } else if (sortBy === 'newest') {
      // Using the ID as a proxy for creation time
      return parseInt(b.id) - parseInt(a.id);
    } else if (sortBy === 'highest-bid') {
      return b.currentBid - a.currentBid;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Explore Auctions</h1>
        
        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="ending-soon">Ending Soon</option>
              <option value="newest">Newest</option>
              <option value="highest-bid">Highest Bid</option>
            </select>
          </div>
        </div>
        
        {/* Auctions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-xl h-[320px]"></div>
            ))}
          </div>
        ) : (
          <>
            {sortedAuctions.length === 0 ? (
              <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-gray-300">No auctions found matching your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedAuctions.map(auction => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};