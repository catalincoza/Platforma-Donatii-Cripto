import React from "react";
import {
  Card, CardContent, Typography, Box, Avatar, LinearProgress, Button
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/VolunteerActivism";

const CampaignCard = ({ campaign, onDonate, onDetails, onFinalize, isCreator }) => {
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);

  return (
    <Card sx={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      width: 350,
      border: "1px solid rgba(255,255,255,0.2)"
    }}>
      <CardContent>
        {/* Header cu titlu și icon */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: "white", color: "#764ba2", mr: 2 }}>
            <CampaignIcon />
          </Avatar>
          <Typography variant="h6">{campaign.title}</Typography>
        </Box>

        {/* Descriere și sumă */}
        <Typography variant="body2" mb={1}>{campaign.description}</Typography>
        <Typography variant="caption">🎯 Țintă: {campaign.goal} ETH</Typography><br />
        <Typography variant="caption">💰 Strâns: {campaign.raised} ETH</Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
          📊 Progres: {progress.toFixed(1)}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 1, height: 6, borderRadius: 2 }}
        />

        {/* Status */}
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          {campaign.finalized ? "✅ Finalizată" : "🟢 Activă"}
        </Typography>

        {/* Acțiuni */}
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Button
            variant="contained"
            fullWidth
            disabled={campaign.finalized}
            onClick={() => onDonate?.(campaign)}
            sx={{
              bgcolor: "#FFD700", color: "#222",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#ffe066", color: "#000" }
            }}
          >
            💝 Donează acum
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => onDetails?.(campaign)}
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": { borderColor: "#FFD700", color: "#FFD700" },
            }}
          >
            📋 Detalii & Donatori
          </Button>

          {isCreator && !campaign.finalized && (
            <Button
              variant="outlined"
              fullWidth
              color="warning"
              onClick={() => onFinalize?.(campaign)}
              sx={{
                borderColor: "#FFD700",
                color: "#FFD700",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#ffe066", color: "#000" }
              }}
            >
              🔐 Finalizează Campania
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
