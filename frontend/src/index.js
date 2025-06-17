import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import WelcomePage from './pages/WelcomePage'
import AllCampaigns from './pages/AllCampaigns';
import Dashboard from './pages/admin/DashboardPage';
import StatisticsDashboard from "./pages/admin/StatisticsDashboard";
import CampaignProposals from './pages/CampaignProposals';
import CategoryCampaignsPage from './pages/CategoryCampaignsPage';

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
        <Route path="/:category" element={<CategoryCampaignsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
