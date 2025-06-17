import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import WelcomePage from './pages/WelcomePage'
import AllCampaigns from './pages/AllCampaigns';
import Dashboard from './pages/admin/DashboardPage';
import StatisticsDashboard from "./pages/admin/StatisticsDashboard";
import AllDonationsAdminPage from "./pages/admin/AllDonationsAdminPage";
import CampaignProposals from './pages/CampaignProposals';
import CategoryCampaignsPage from './pages/CategoryCampaignsPage';
import UserDonationsPage from "./pages/UserDonationsPage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/campaigns" element={<App />} />
        <Route path="/all-campaigns" element={<AllCampaigns />} />
        <Route path="/campaign-proposals" element={<CampaignProposals />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard/statistics" element={<StatisticsDashboard />} />
        <Route path="/admin-dashboard/donations" element={<AllDonationsAdminPage />} />
        <Route path="/:category" element={<CategoryCampaignsPage />} />
        <Route path="/my-donations" element={<UserDonationsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
