import React, { useEffect, useState } from "react";
import { 
  Container, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Typography, 
  Paper, 
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  Grid
} from "@mui/material";
import { fetchPlayerStats } from "../api";

const PlayerStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    setLoading(true);
    try {
      const data = await fetchPlayerStats();
      console.log("📌 Fetched Player Stats (Frontend):", data); // ✅ Debugging
      setStats(data);
    } catch (error) {
      console.error("❌ Error fetching player stats:", error);
    }
    setLoading(false);
  };

  // Mobile view card component for each player
  const MobilePlayerCard = ({ player }) => (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 2, 
        p: 2,
        borderRadius: 2,
        borderLeft: "4px solid #4a90e2",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)"
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: "#0a2540"
        }}
      >
        {player.name}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">Total Runs</Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: player.totalRuns > 1000 ? 700 : 500,
              color: player.totalRuns > 1000 ? "#4a90e2" : "inherit"
            }}
          >
            {player.totalRuns}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">Innings</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {player.totalInnings}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">Outs</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {player.totalOuts}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">Average</Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 700,
              color: player.average !== "N/A" && Number(player.average) > 50 ? "#4caf50" : 
                     player.average !== "N/A" && Number(player.average) < 20 ? "#f44336" : 
                     "inherit"
            }}
          >
            {player.average !== "N/A" ? Number(player.average).toFixed(2) : "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ 
      mt: 6, 
      mb: 6,
      animation: "fadeIn 0.5s ease-in-out",
      "@keyframes fadeIn": {
        "0%": {
          opacity: 0,
          transform: "translateY(20px)"
        },
        "100%": {
          opacity: 1,
          transform: "translateY(0)"
        }
      }
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 800, 
          textAlign: "center",
          color: "#0a2540",
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          letterSpacing: "0.01em",
          position: "relative",
          fontSize: { xs: '1.8rem', sm: '2.125rem' },
          "&::after": {
            content: '""',
            display: "block",
            width: "80px",
            height: "4px",
            backgroundColor: "#4a90e2",
            borderRadius: "2px",
            margin: "0 auto",
            marginTop: "16px"
          }
        }}
      >
        Player Statistics
      </Typography>

      {loading ? (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          my: 8,
          flexDirection: "column" 
        }}>
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ 
              color: "#4a90e2" 
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 3, 
              color: "#666", 
              fontWeight: 500 
            }}
          >
            Loading player statistics...
          </Typography>
        </Box>
      ) : stats.length === 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              sx={{ 
                fontWeight: 500,
                color: "#666",
                mb: 1 
              }}
            >
              No statistics available
            </Typography>
            <Typography variant="body2" sx={{ color: "#888" }}>
              Player statistics will appear here once they are available.
            </Typography>
          </Box>
        </Paper>
      ) : isMobile ? (
        // Mobile view - card layout
        <Box sx={{ px: 1 }}>
          {stats.map((player, index) => (
            <MobilePlayerCard key={index} player={player} />
          ))}
        </Box>
      ) : (
        // Desktop view - table layout
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 1, sm: 2, md: 3 }, 
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)"
            }
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ 
                background: "linear-gradient(90deg, #0a2540 0%, #1a365d 100%)"
              }}>
                <TableCell 
                  sx={{ 
                    color: "#fff", 
                    fontWeight: "bold",
                    fontSize: "1rem",
                    py: 2.5,
                    pl: 3
                  }}
                >
                  Player Name
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: "#fff", 
                    fontWeight: "bold",
                    fontSize: "1rem",
                    py: 2.5
                  }}
                >
                  Total Runs
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: "#fff", 
                    fontWeight: "bold",
                    fontSize: "1rem",
                    py: 2.5
                  }}
                >
                  Total Innings
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: "#fff", 
                    fontWeight: "bold",
                    fontSize: "1rem",
                    py: 2.5
                  }}
                >
                  Total Outs
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: "#fff", 
                    fontWeight: "bold",
                    fontSize: "1rem",
                    py: 2.5,
                    pr: 3
                  }}
                >
                  Average
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map((player, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#eef5ff"
                    }
                  }}
                >
                  <TableCell 
                    sx={{ 
                      fontWeight: 500,
                      pl: 3,
                      borderLeft: "4px solid",
                      borderLeftColor: "#4a90e2"
                    }}
                  >
                    {player.name}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: player.totalRuns > 1000 ? 700 : 400,
                      color: player.totalRuns > 1000 ? "#4a90e2" : "inherit"
                    }}
                  >
                    {player.totalRuns}
                  </TableCell>
                  <TableCell align="center">
                    {player.totalInnings}
                  </TableCell>
                  <TableCell align="center">
                    {player.totalOuts}
                  </TableCell>
                  <TableCell 
                    align="center"
                    sx={{ 
                      fontWeight: 700,
                      pr: 3,
                      color: player.average !== "N/A" && Number(player.average) > 50 ? "#4caf50" : 
                             player.average !== "N/A" && Number(player.average) < 20 ? "#f44336" : 
                             "inherit"
                    }}
                  >
                    {player.average !== "N/A" ? Number(player.average).toFixed(2) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Box sx={{ 
        mt: 2,
        textAlign: "center",
        fontSize: "0.75rem",
        color: "#999",
        fontStyle: "italic"
      }}>
        <Typography variant="caption">
          Statistics updated in real-time
        </Typography>
      </Box>
    </Container>
  );
};

export default PlayerStats;