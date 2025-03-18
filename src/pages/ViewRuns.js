import React, { useEffect, useState } from "react";
import { fetchRuns } from "../api";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Container, Typography, Paper, Box, CircularProgress, Chip,
  useMediaQuery, useTheme
} from "@mui/material";

const ViewRuns = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setLoading(true);
    fetchRuns()
      .then((data) => {
        console.log("📌 Fetched Runs:", data);  // ✅ Debugging log
        setRuns(data);
      })
      .catch((error) => {
        console.error("❌ Error fetching runs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Function to determine row background color based on runs scored
  const getRunsColor = (runs) => {
    if (runs >= 100) return "#e3f2fd"; // Century - light blue
    if (runs >= 50) return "#e8f5e9";  // Half-century - light green
    return "";
  };

  // Mobile card view for each run entry
  const MobileRunCard = ({ run }) => (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 2, 
        p: 2, 
        borderRadius: 2,
        backgroundColor: getRunsColor(run.runs),
        '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer', transition: 'background-color 0.2s ease' }
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        {run.name || "Unknown"}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Venue:</Typography>
        <Typography variant="body2">{run.venue}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Runs:</Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: run.runs >= 50 ? 'bold' : 'regular',
            color: run.runs >= 100 ? '#1565c0' : (run.runs >= 50 ? '#2e7d32' : 'inherit')
          }}
        >
          {run.runs}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Innings:</Typography>
        <Typography variant="body2">{run.innings}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Outs:</Typography>
        <Typography variant="body2">{run.outs}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Date:</Typography>
        <Typography variant="body2">
          {new Date(run.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, px: isMobile ? 2 : 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 3,
        gap: isMobile ? 1 : 0
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ fontWeight: 'bold', color: '#1a237e', position: 'relative' }}
        >
          Batting Records
        </Typography>
        <Chip label={`${runs.length} entries`} color="primary" sx={{ fontWeight: 'bold' }} />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        isMobile ? (
          // Mobile view: Card layout
          <Box sx={{ mt: 2 }}>
            {runs.length > 0 ? (
              runs.map((run, index) => (
                <MobileRunCard key={index} run={run} />
              ))
            ) : (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No data available
                </Typography>
              </Paper>
            )}
          </Box>
        ) : (
          // Desktop view: Table layout
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1a237e' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Batsman Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Venue</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Runs</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Innings</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Outs</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {runs.length > 0 ? (
                  runs.map((run, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        backgroundColor: getRunsColor(run.runs),
                        '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer', transition: 'background-color 0.2s ease' }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {run.name || "Unknown"}
                      </TableCell>
                      <TableCell>{run.venue}</TableCell>
                      <TableCell>
                        <Typography 
                          sx={{ 
                            fontWeight: run.runs >= 50 ? 'bold' : 'regular',
                            color: run.runs >= 100 ? '#1565c0' : (run.runs >= 50 ? '#2e7d32' : 'inherit')
                          }}
                        >
                          {run.runs}
                        </Typography>
                      </TableCell>
                      <TableCell>{run.innings}</TableCell>
                      <TableCell>{run.outs}</TableCell>
                      <TableCell>
                        {new Date(run.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No data available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )
      )}
    </Container>
  );
};

export default ViewRuns;