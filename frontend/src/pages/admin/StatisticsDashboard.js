import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert, Button } from "@mui/material";
import { BrowserProvider, Contract, formatEther } from "ethers";
import FactoryABI from "../../contracts/DonationCampaignFactory.json";
import CampaignABI from "../../contracts/DonationCampaign.json";
import factoryAddressJSON from "../../contracts/factory-address.json";
import { useNavigate } from "react-router-dom";

const factoryAddress = factoryAddressJSON.DonationCampaignFactory;

const StatisticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new Contract(factoryAddress, FactoryABI.abi, signer);

      const campaignCount = await factory.getCampaignCount();
      const allData = [];
      const categoryTotals = {};
      const donorSet = new Set();
      let totalGoalAmount = 0;

      for (let i = 0; i < Number(campaignCount); i++) {
        const address = await factory.getCampaignAddress(i);
        const campaign = new Contract(address, CampaignABI.abi, signer);
        const details = await campaign.getDetails();
        const [title, , category, , goal, raised, finalized] = details;

        // Convert BigInt to number safely using formatEther
        const goalETH = parseFloat(formatEther(goal.toString()));
        const raisedETH = parseFloat(formatEther(raised.toString()));
        
        allData.push({ 
          title, 
          address, 
          category, 
          goal: goalETH,
          raised: raisedETH, 
          finalized 
        });

        // Adună total ETH per categorie
        const cat = category.toLowerCase();
        categoryTotals[cat] = (categoryTotals[cat] || 0) + raisedETH;
        
        // Adună la totalul obiectivelor
        totalGoalAmount += goalETH;

        // Adună donatori
        try {
          const events = await campaign.queryFilter(campaign.filters.DonationReceived());
          for (const ev of events) {
            donorSet.add(ev.args.donor.toLowerCase());
          }
        } catch (eventError) {
          console.warn(`Could not fetch events for campaign ${address}:`, eventError);
        }
      }

      // Top 3 campanii după suma strânsă
      const top3 = [...allData]
        .sort((a, b) => b.raised - a.raised)
        .slice(0, 3)
        .map(c => ({
          title: c.title,
          amount: c.raised.toFixed(3),
          percentage: c.goal > 0 ? ((c.raised / c.goal) * 100).toFixed(1) : 0
        }));

      // Campanii finalizate cu succes
      const successfulCampaigns = allData.filter(c => c.finalized && c.raised >= c.goal).length;
      
      // Rata de succes
      const totalCampaignCount = Number(campaignCount);
      const successRate = totalCampaignCount > 0 ? ((successfulCampaigns / totalCampaignCount) * 100).toFixed(1) : 0;

      setStats({
        totalCampaigns: totalCampaignCount.toString(),
        totalETH: Object.values(categoryTotals).reduce((a, b) => a + b, 0).toFixed(3),
        totalGoalETH: totalGoalAmount.toFixed(3),
        categoryTotals,
        donorCount: donorSet.size,
        topCampaigns: top3,
        successfulCampaigns,
        successRate
      });

    } catch (err) {
      console.error("Eroare la calcularea statisticilor:", err);
      setError("Eroare la încărcarea statisticilor. Verifică conexiunea la blockchain.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    setError("");
    fetchStatistics();
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="white" textAlign="center" mb={4}>
        📊 Statistici Generale
      </Typography>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ color: "white" }} />
          <Typography color="white" mt={2}>Se încarcă statisticile...</Typography>
        </Box>
      ) : error ? (
        <Box textAlign="center" mb={4}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={refreshStats}>
            🔄 Încearcă din nou
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Basic Stats */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Total Campanii" value={stats.totalCampaigns} icon="🎯" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Total ETH Donat" value={`${stats.totalETH} ETH`} icon="💰" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Donatori Unici" value={stats.donorCount} icon="👥" />
          </Grid>
          
          {/* Additional Stats */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Obiectiv Total ETH" value={`${stats.totalGoalETH} ETH`} icon="🎯" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Campanii Reușite" value={stats.successfulCampaigns} icon="✅" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Rata de Succes" value={`${stats.successRate}%`} icon="📈" />
          </Grid>

          {/* Category Totals */}
          {Object.entries(stats.categoryTotals).map(([cat, val]) => (
            <Grid item xs={12} sm={6} md={4} key={cat}>
              <StatCard 
                title={`${cat.charAt(0).toUpperCase() + cat.slice(1)}`} 
                value={`${val.toFixed(3)} ETH`} 
                icon="📊"
              />
            </Grid>
          ))}

          {/* Top Campaigns */}
          <Grid item xs={12}>
            <StatCard
              title="🏆 Top 3 Campanii"
              value={
                stats.topCampaigns.length > 0
                  ? stats.topCampaigns.map((c, i) => 
                      `${i + 1}. ${c.title} – ${c.amount} ETH (${c.percentage}% din obiectiv)`
                    ).join("\n")
                  : "Nicio campanie cu donații"
              }
              multiline
            />
          </Grid>
        </Grid>
      )}

      <Box mt={5} textAlign="center" display="flex" gap={2} justifyContent="center">
        <Button
          variant="outlined"
          sx={{
            color: "white", 
            borderColor: "white",
            "&:hover": { color: "#FFD700", borderColor: "#FFD700" }
          }}
          onClick={() => navigate("/admin-dashboard")}
        >
          ⬅ Înapoi la Dashboard
        </Button>
        
        {!loading && !error && (
          <Button
            variant="outlined"
            sx={{
              color: "white", 
              borderColor: "white",
              "&:hover": { color: "#90EE90", borderColor: "#90EE90" }
            }}
            onClick={refreshStats}
          >
            🔄 Reîmprospătează
          </Button>
        )}
      </Box>
    </Box>
  );
};

const StatCard = ({ title, value, multiline, icon }) => (
  <Card sx={{ 
    background: "rgba(255,255,255,0.1)", 
    color: "white", 
    p: 2,
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.2)",
      transform: "translateY(-4px)"
    }
  }}>
    <CardContent>
      <Typography variant="h6" gutterBottom fontWeight="bold" display="flex" alignItems="center" gap={1}>
        {icon && <span>{icon}</span>}
        {title}
      </Typography>
      <Typography 
        variant={multiline ? "body2" : "h5"} 
        sx={{ 
          whiteSpace: "pre-line",
          fontWeight: multiline ? "normal" : "bold"
        }}
      >
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatisticsDashboard;