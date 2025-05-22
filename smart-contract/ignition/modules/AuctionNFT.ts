/** @format */

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AuctionNFTModule = buildModule("AuctionNFTModule", (m) => {
  const auctionNFT = m.contract("AuctionNFT", []);
  return { auctionNFT };
});

export default AuctionNFTModule;
