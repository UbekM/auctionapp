/** @format */

import { Auction } from "../types";

// Mock data for development purposes
const now = new Date();
export const mockAuctions: Auction[] = [
  {
    id: "1",
    name: "Cosmic Voyager NFT",
    description:
      "A stunning digital artwork representing the journey through the cosmos. This one-of-a-kind NFT features vibrant colors and intricate details that capture the beauty of space exploration.",
    imageUrl:
      "https://images.pexels.com/photos/8828349/pexels-photo-8828349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    seller: {
      address: "8L73nFTkbvVNCZmK9usTXhMpPfneDd1YHvnKTxKxnWAz",
      username: "CosmicCreator",
    },
    startingBid: 250,
    currentBid: 2750,
    endTime: new Date(now.getTime() + 86400000 * 2), // 2 days from now
    bids: [
      {
        id: "b1",
        auctionId: "1",
        bidder: {
          address: "5R7Rrw3NCDixJG7aTwm378oa7JvCGQFj4nzy1vWBxQ9D",
          username: "CryptoWhale",
        },
        amount: 2750,
        timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
      },
      {
        id: "b2",
        auctionId: "1",
        bidder: {
          address: "9K8aRfAk7GXvQ9DTb4JbDN7CB4TaJ5i7Ss6roCCLx1J",
          username: "BlockchainBaron",
        },
        amount: 2500,
        timestamp: new Date(now.getTime() - 7200000), // 2 hours ago
      },
    ],
  },
  {
    id: "2",
    name: "Virtual Reality Headset",
    description:
      "Next-generation VR headset with 8K resolution and haptic feedback. Experience virtual worlds like never before with this cutting-edge technology.",
    imageUrl:
      "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    seller: {
      address: "3NJKmPBD4Cj8ZUxJJKgPsF7s1DL6vfEe8z6",
      username: "TechVisionary",
    },
    startingBid: 800,
    currentBid: 1200,
    endTime: new Date(now.getTime() + 86400000 * 3), // 3 days from now
    bids: [
      {
        id: "b3",
        auctionId: "2",
        bidder: {
          address: "7MyCM8uLq83BcGKn6ZoA1Xt4PQ5vCdeFe3Xh",
          username: "GadgetGuru",
        },
        amount: 1200,
        timestamp: new Date(now.getTime() - 10800000), // 3 hours ago
      },
    ],
  },
  {
    id: "3",
    name: "Rare Blockchain Collectible",
    description:
      "Limited edition collectible commemorating the first decentralized application on the Lisk blockchain. Only 10 ever minted.",
    imageUrl:
      "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    seller: {
      address: "5J8nF7XrPQ4zLN2vK6Sm9mC7KR7Wq3bD",
      username: "LiskPioneer",
    },
    startingBid: 1500,
    currentBid: 4300,
    endTime: new Date(now.getTime() + 86400000 * 1), // 1 day from now
    bids: [
      {
        id: "b4",
        auctionId: "3",
        bidder: {
          address: "2YxNpV8JmKDQtRSbNn5qWu9S1Ze",
          username: "CollectorKing",
        },
        amount: 4300,
        timestamp: new Date(now.getTime() - 43200000), // 12 hours ago
      },
      {
        id: "b5",
        auctionId: "3",
        bidder: {
          address: "8TrP9QzLg3VuHJxF7Di6KmAe",
          username: "TokenTrader",
        },
        amount: 3800,
        timestamp: new Date(now.getTime() - 86400000), // 1 day ago
      },
    ],
  },
  {
    id: "4",
    name: "Digital Real Estate - Metaverse Land",
    description:
      "Prime location in the hottest metaverse district. This virtual land parcel includes building rights and is situated near major attractions.",
    imageUrl:
      "https://images.pexels.com/photos/7005984/pexels-photo-7005984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    seller: {
      address: "9VbC3mKp2R7sZxNqYfWjLT4Qe8D",
      username: "MetaInvestor",
    },
    startingBid: 5000,
    currentBid: 5000,
    endTime: new Date(now.getTime() + 86400000 * 5), // 5 days from now
    bids: [],
  },
];

export const getAuctions = (): Promise<Auction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAuctions);
    }, 500);
  });
};

export const getAuctionById = (id: string): Promise<Auction | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAuctions.find((auction) => auction.id === id));
    }, 500);
  });
};

export const getUserCreatedAuctions = (address: string): Promise<Auction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        mockAuctions.filter((auction) => auction.seller.address === address)
      );
    }, 500);
  });
};

export const getUserActiveBids = (address: string): Promise<Auction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const auctionsWithUserBids = mockAuctions.filter((auction) =>
        auction.bids.some(
          (bid) =>
            bid.bidder.address === address && auction.endTime > new Date()
        )
      );
      resolve(auctionsWithUserBids);
    }, 500);
  });
};

export const getUserWonAuctions = (address: string): Promise<Auction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const wonAuctions = mockAuctions.filter(
        (auction) =>
          auction.endTime < new Date() &&
          auction.bids.length > 0 &&
          auction.bids[0].bidder.address === address
      );
      resolve(wonAuctions);
    }, 500);
  });
};

export const addAuction = (auction: Auction): Promise<void> => {
  return new Promise((resolve) => {
    mockAuctions.push(auction);
    setTimeout(() => resolve(), 200);
  });
};
