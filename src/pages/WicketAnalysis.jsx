import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Box, CircularProgress, useMediaQuery, useTheme, Grid, Card, CardContent
} from "@mui/material";

const WicketAnalysis = () => {
  const [wicketsData, setWicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchWickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/wickets`);
        const data = response.data;

        // Group by bowler and aggregate
        const analysisMap = {};
        data.forEach(w => {
          const key = w.bowler_name;
          if (!analysisMap[key]) {
            analysisMap[key] = { wickets: 0, innings: 0 };
          }
          analysisMap[key].wickets += Number(w.wickets);
          analysisMap[key].innings += Number(w.innings);
        });

        // Convert to array and calculate rate
        const analysisArray = Object.entries(analysisMap).map(([name, stats]) => ({
          bowler_name: name,
          total_wickets: stats.wickets,
          total_innings: stats.innings,
          rate: stats.innings === 0 ? 0 : (stats.wickets / stats.innings).toFixed(2),
        }));

        // Sort by rate
        analysisArray.sort((a, b) => b.rate - a.rate);
        setWicketsData(analysisArray);
      } catch (err) {
        console.error("❌ Error fetching wicket analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWickets();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "#1e3a8a", mb: 3 }}>
        Wicket Rate Analysis
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Grid container spacing={2}>
          {wicketsData.map((bowler, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ borderLeft: "5px solid #4caf50" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e3a8a" }}>
                    {bowler.bowler_name}
                  </Typography>
                  <Typography variant="body2">Total Wickets: {bowler.total_wickets}</Typography>
                  <Typography variant="body2">Total Innings: {bowler.total_innings}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
                    Wicket Rate: {bowler.rate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Bowler Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Wickets</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Innings</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Wicket Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wicketsData.map((bowler, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5faff' } }}>
                  <TableCell>{bowler.bowler_name}</TableCell>
                  <TableCell>{bowler.total_wickets}</TableCell>
                  <TableCell>{bowler.total_innings}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>{bowler.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default WicketAnalysis;
