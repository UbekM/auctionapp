export type Auction = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  seller: {
    address: string;
    username?: string;
  };
  startingBid: number;
  currentBid: number;
  endTime: Date;
  bids: Bid[];
};

export type Bid = {
  id: string;
  auctionId: string;
  bidder: {
    address: string;
    username?: string;
  };
  amount: number;
  timestamp: Date;
};

export type User = {
  address: string;
  username?: string;
  isConnected: boolean;
};