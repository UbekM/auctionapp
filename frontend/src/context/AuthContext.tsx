/** @format */

import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../types";

// Type for Ethereum provider
interface EthereumProvider {
  request: (args: { method: string }) => Promise<any>;
}

interface AuthContextType {
  user: User | null;
  isConnecting: boolean;
  connectWallet: (provider: "okx" | "metamask") => Promise<void>;
  disconnectWallet: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async (provider: "okx" | "metamask") => {
    setIsConnecting(true);
    try {
      if (
        provider === "metamask" &&
        typeof window !== "undefined" &&
        (window as any).ethereum
      ) {
        const eth = (window as unknown as { ethereum?: EthereumProvider })
          .ethereum;
        if (!eth) throw new Error("MetaMask not found");
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        setUser({
          address: accounts[0],
          username: "MetaMask User",
          isConnected: true,
        });
      } else if (
        provider === "okx" &&
        typeof window !== "undefined" &&
        (window as any).okxwallet
      ) {
        // OKX Wallet connection using injected provider
        const okxwallet = (window as any).okxwallet;
        const accounts = await okxwallet.request({
          method: "eth_requestAccounts",
        });
        setUser({
          address: accounts[0],
          username: "OKX Wallet User",
          isConnected: true,
        });
      } else {
        throw new Error("Wallet provider not available");
      }
    } catch (error) {
      console.error("Wallet connection failed", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isConnecting, connectWallet, disconnectWallet }}
    >
      {children}
    </AuthContext.Provider>
  );
};
