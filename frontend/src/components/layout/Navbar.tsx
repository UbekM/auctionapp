/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Wallet, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/useAuth";
import ConnectWalletModal from "../modals/ConnectWalletModal";

export const Navbar: React.FC = () => {
  const { user, isConnecting, connectWallet, disconnectWallet } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleConnectClick = () => {
    setIsModalOpen(true);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-teal-400 rounded-lg w-8 h-8 flex items-center justify-center mr-2">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">LiskAuction</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Home
              </Link>
              <Link
                to="/auctions"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Explore
              </Link>
              {user && (
                <>
                  <Link
                    to="/create"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Create Auction
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-md truncate max-w-[140px]">
                  {user.username || user.address.substring(0, 10) + "..."}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disconnectWallet}
                  className="text-gray-300"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectClick}
                isLoading={isConnecting}
                className="bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-700 hover:to-teal-500"
              >
                <Wallet className="h-4 w-4 mr-1" />
                Connect Wallet
              </Button>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          <Link
            to="/"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Home
          </Link>
          <Link
            to="/auctions"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Explore
          </Link>
          {user && (
            <>
              <Link
                to="/create"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Create Auction
              </Link>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Dashboard
              </Link>
            </>
          )}
          {user ? (
            <div className="px-3 py-2">
              <div className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-md mb-2 truncate">
                {user.username || user.address.substring(0, 10) + "..."}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  disconnectWallet();
                  closeMenu();
                }}
                className="text-gray-300 w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="px-3 py-2">
              <Button
                onClick={() => {
                  handleConnectClick();
                  closeMenu();
                }}
                isLoading={isConnecting}
                fullWidth
                className="bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-700 hover:to-teal-500"
              >
                <Wallet className="h-4 w-4 mr-1" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
};
