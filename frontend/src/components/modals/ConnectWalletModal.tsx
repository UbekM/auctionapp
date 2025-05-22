/** @format */

import React from "react";
import { X, Wallet } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/useAuth";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { connectWallet, isConnecting } = useAuth();
  const hasEthereum =
    typeof window !== "undefined" && !!(window as any).ethereum;
  const hasOKX = typeof window !== "undefined" && !!(window as any).okxwallet;

  const handleConnect = async (provider: "okx" | "metamask") => {
    await connectWallet(provider);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div
        className="relative bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-center flex-col mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-teal-400 p-3 rounded-full mb-4">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400 text-center mt-2">
            Connect your wallet to start bidding and creating auctions on
            LiskAuction
          </p>
        </div>

        <div className="space-y-4 mt-4">
          <button
            className={`w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-between transition-colors duration-200 ${
              !hasOKX ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => hasOKX && handleConnect("okx")}
            disabled={isConnecting || !hasOKX}
            type="button"
          >
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1.5 mr-3">
                <img
                  src="https://static.okx.com/cdn/wallet/logo/okxwallet.png"
                  alt="OKX"
                  className="h-5 w-5"
                />
              </div>
              <span className="text-white font-medium flex items-center gap-2">
                OKX Wallet (Lisk)
                <img
                  src="https://cryptologos.cc/logos/lisk-lsk-logo.png"
                  alt="Lisk"
                  className="h-4 w-4 ml-1"
                />
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              {hasOKX ? "Connect" : "Not Detected"}
            </span>
          </button>
          <button
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-between transition-colors duration-200"
            onClick={() => handleConnect("metamask")}
            disabled={isConnecting || !hasEthereum}
          >
            <div className="flex items-center">
              <div className="bg-[#3b99fc] rounded-full p-1.5 mr-3">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 784.37 784.37"
                  fill="white"
                >
                  <path d="M392.07 0c-215.53 0-390.17 174.64-390.17 390.17s174.64 390.17 390.17 390.17 390.17-174.64 390.17-390.17S607.6 0 392.07 0zm-1.85 156.07h-.06c2.23 0 4.16 1.72 4.26 3.94l14.58 215.83-34.22.73-14.65-215.7c-.06-2.23 1.68-4.16 3.9-4.32 8.82-.4 16.95-.84 26.19-.49zm56.22 346.36c-39.85 19.5-69.95-11.14-79.89-39.83l64.33-28.74 86.31-38.6c2.9 14.15-1.02 66.12-70.75 107.17zm-142.39-67.04l42.77-20.55-42.77 20.55zm82.11-129.74l58.82-26.69c1.1 3.04 2.19 6.09 3.23 9.13 16.34 47.85 19.05 92.13-27.81 118.29l-91.49 41.95c21.85-50.84 41.28-97.98 57.25-142.68zm-59.1 219.46l-86.97-164.2 37.67-102.06 5.91 76.78c.35 4.62 3.98 8.37 8.53 8.81l84.78 8.34c1.93.19 3.52-1.53 3.11-3.43-9.13-43.05-25.23-108.97-40.55-175.33l2.09-3.32c2.72-4.35 2.72-9.89-.02-14.25l-19.88-31.49c-1.96-3.12-1.41-7.23 1.28-9.64l5.37-4.81c2.16-1.94 5.33-2.2 7.77-.65l33.38 21.22c3.54 2.25 8.09 2.11 11.5-.37l31.19-22.77c2.45-1.78 5.79-1.66 8.1.31l29.24 24.91c2.55 2.17 6.22 2.53 9.16.89l18.79-10.43c2.57-1.42 5.72-1.23 8.08.54l49.85 37.16c2.33 1.75 5.43 1.98 8 .59l65.73-35.36c3.05-1.63 6.8-.71 8.86 2.14l12.88 17.92c1.53 2.15 1.86 4.96.87 7.42l-21.22 52.2c-1.06 2.52-3.54 4.11-6.25 3.99l-49.89-2.21c-2.91-.13-5.24-2.32-5.56-5.21l-3.47-31.52c-.33-2.98-2.73-5.29-5.72-5.48l-35.1-2.31c-2.72-.18-5.02-2.08-5.77-4.71l-7.76-27.11c-.95-3.29-4.3-5.31-7.67-4.62l-50.28 10.2c-2.5.5-4.38 2.55-4.68 5.08l-10.32 87.68a3.113 3.113 0 01-5.32 1.97l-8.49-6.71c-4.66-3.93-11.28-4.12-16.18-.44l-30.51 22.93c-3.48 2.62-4.17 7.56-1.53 11.01l24.2 31.99c1.01 1.31 2.48 2.16 4.08 2.34l49.15 5.57c3.5.4 6.09 3.47 5.87 6.97l-7.85 115.96c-.13 1.97-1.29 3.71-3.06 4.57l-37.58 18.05c-4.46 2.15-9.77.47-12.09-3.82zm-43.51-289.15c-.89-13.11-8.28-148.9-9.42-166.14-.11-1.71 1.26-3.09 2.97-3.09h23.58a3.085 3.085 0 013.05 2.68l5.5 31.55c.25 1.44 1.35 2.59 2.79 2.91l.07.01 26.17 5.69c.54.12 1.15.53 1.45.99.39.56.54 1.26.38 1.9l-18.57 73.55c-.18.73-.66 1.36-1.33 1.74-.67.38-1.49.47-2.23.26l-34.29-9.77c-1.93-.55-3.26-2.36-3.04-4.4.92-8.59 6.13-56.7 8.01-77.37.1-1.2-.75-2.28-1.94-2.45-1.2-.16-2.33.58-2.57 1.75-3.1 14.93-12.51 60.23-15.24 73.4-.28 1.36-1.46 2.39-2.85 2.49l-10.52.77c-1.06.08-1.96-.39-2.51-1.19-.59-.86-.7-1.97-.23-2.95.02-.04 12.33-29.48 17.27-86.4.18-2.2-1.48-4.11-3.66-4.26-2.31-.16-4.28 1.72-4.27 4.04.02 12.31.13 32.54-1.38 42.34-.43 2.79-2.8 4.95-5.63 5.15-5.14.36-13.81.98-20.66 1.99-1.94.29-3.2-1.88-2.23-3.55 2.45-4.24 5.45-10.12 8.89-18.34 3.6-8.66 4.23-16.2 4.63-21.1.33-4.03 0-7.48-.29-9.8-.63-5.08-5.47-8.04-10.13-5.98-.64.28-1.23.65-1.76 1.14-9.88 8.82-10.75 18.4-10.88 30.54-.07 6.11.21 12.31.81 18.44.62 6.4 1.53 12.58 2.75 18.76.69 3.37 1.67 6.8 2.92 10.12 6.43 17.12 16.89 31.16 25.91 45.3 1.93 3.02 3.99 5.99 5.93 9.02 3.6 5.61 6.91 11.38 9.27 17.64 4.5 11.95 7.65 24.43 9.62 37.11.95 6.11 1.68 12.27 2.15 18.46.13 1.64.24 3.3.32 4.93.08 1.63.4 3.56.07 5.95-.32 2.3-1.38 4.5-3.21 6.12-5.34 4.7-13.63 5.57-20.13 2.21-7.61-3.92-13.18-10.83-16.99-18.39-3.99-7.61-7.98-15.82-7.97-24.54.01-8.71 2.76-17.23 6.59-25.06 3.97-8.11 8.9-15.8 11.79-24.44.22-.6.36-1.25.41-1.91l.97-15.32c.05-.88-.19-1.63-.64-2.17-.45-.53-1.08-.83-1.76-.78-.91.08-1.72.7-1.96 1.59-1.82 6.71-18.88 37.06-6.2 60.77 1.6 2.94.98 6.62-1.48 8.91-1.62 1.53-3.89 2.27-6.16 1.85-2.25-.41-4.17-1.96-5.1-4.12-12.1-28.11 12.43-65.03 12.56-65.22.56-.78.77-1.76.56-2.7l-.52-2.57c-.19-.94-.77-1.67-1.56-2.04-.8-.39-1.77-.4-2.56 0-6.94 3.42-11.43 10.35-14.29 17.6-3.55 8.97-5.17 18.63-3.51 28.08 1.68 9.46 6.82 18.08 13.15 25.47 3.21 3.74 6.83 7.13 10.85 9.94 5.38 3.99 11.33 6.94 17.72 8.67 6.39 1.73 13.13 2.4 19.7 1.35 7.32-1.14 14.21-4.65 19.19-10.17 4.99-5.51 7.63-12.84 8.21-20.16.6-7.31-.55-14.68-2.08-21.87-3.07-14.36-8.01-28.33-14.68-41.5-3.31-6.58-7.07-12.9-11.16-19-1.86-2.77-3.82-5.47-5.8-8.16-7.96-10.81-17.51-22.58-23.08-35.43"></path>
                </svg>
              </div>
              <span className="text-white font-medium flex items-center gap-2">
                MetaMask
                <img
                  src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                  alt="Ethereum"
                  className="h-4 w-4 ml-1"
                />
              </span>
            </div>
            <span className="text-gray-400 text-sm">Connect</span>
          </button>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => handleConnect("okx")}
            fullWidth
            size="lg"
            isLoading={isConnecting}
            className="bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-700 hover:to-teal-500"
          >
            Connect Wallet
          </Button>

          <p className="text-gray-400 text-xs text-center mt-4">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
