import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { AuctionsPage } from './pages/AuctionsPage';
import { AuctionDetailsPage } from './pages/AuctionDetailsPage';
import { CreateAuctionPage } from './pages/CreateAuctionPage';
import { UserDashboardPage } from './pages/UserDashboardPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/auction/:id" element={<AuctionDetailsPage />} />
            <Route path="/create" element={<CreateAuctionPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;