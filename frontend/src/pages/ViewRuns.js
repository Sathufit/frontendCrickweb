import React, { useEffect, useState } from "react";
import { fetchRuns } from "../api"; // Assuming this API call is set up
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Container, Typography, Paper, Box, CircularProgress, Chip,
  useMediaQuery, useTheme
} from "@mui/material";
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';

// --- Centralized Theme Colors for Easy Management ---
const THEME_COLORS = {
  primary: '#D32F2F',      // A strong, modern red
  primaryLight: '#FFCDD2', // A light red for accents/backgrounds
  background: '#f8f9fa',   // A very light grey for the main page background
  paper: '#ffffff',       // Pure white for cards and tables
  headerText: '#ffffff',  // White text for dark/red backgrounds
  textPrimary: '#212121',  // Dark grey for primary text
  textSecondary: '#757575',// Medium grey for secondary text
  hover: '#f5f5f5'         // A subtle grey for hover effects
};

// --- Reusable UI Components ---

/**
 * A visually appealing loading spinner.
 */
const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
    <CircularProgress sx={{ color: THEME_COLORS.primary }} size={50} />
  </Box>
);

/**
 * A clean and user-friendly message for when no data is available.
 */
const EmptyState = () => (
  <Paper
    elevation={0}
    sx={{
      textAlign: 'center',
      p: 4,
      mt: 2,
      backgroundColor: THEME_COLORS.background,
      border: `1px dashed ${THEME_COLORS.textSecondary}`
    }}
  >
    <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 50, color: THEME_COLORS.textSecondary, mb: 1 }} />
    <Typography variant="h6" color={THEME_COLORS.textPrimary} gutterBottom>
      No Records Found
    </Typography>
    <Typography variant="body1" color={THEME_COLORS.textSecondary}>
      There is no batting data to display at the moment.
    </Typography>
  </Paper>
);

/**
 * A modern, responsive card for displaying a single run entry on mobile.
 */
const MobileRunCard = ({ run }) => {
  const isHighScorer = run.runs >= 50;
  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: '8px',
        backgroundColor: THEME_COLORS.paper,
        borderLeft: `4px solid ${THEME_COLORS.primary}`, // Accent border
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Card Header: Name and Score */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: THEME_COLORS.textPrimary }}>
          {run.name || "Unknown Batsman"}
        </Typography>
        <Chip
          label={`${run.runs} Runs`}
          size="small"
          sx={{
            fontWeight: 'bold',
            color: isHighScorer ? THEME_COLORS.headerText : THEME_COLORS.primary,
            backgroundColor: isHighScorer ? THEME_COLORS.primary : THEME_COLORS.primaryLight,
          }}
        />
      </Box>

      {/* Card Body: Details */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color={THEME_COLORS.textSecondary}>Venue:</Typography>
          <Typography variant="body2" color={THEME_COLORS.textPrimary}>{run.venue}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color={THEME_COLORS.textSecondary}>Date:</Typography>
          <Typography variant="body2" color={THEME_COLORS.textPrimary}>
            {new Date(run.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color={THEME_COLORS.textSecondary}>Innings/Outs:</Typography>
          <Typography variant="body2" color={THEME_COLORS.textPrimary}>{run.innings} / {run.outs}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};


// --- Main Component ---

const ViewRuns = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setLoading(true);
    fetchRuns()
      .then((data) => {
        // Sort data by date, most recent first, for better UX
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRuns(sortedData);
      })
      .catch((error) => {
        console.error("❌ Error fetching runs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  const renderContent = () => {
    if (runs.length === 0) {
      return <EmptyState />;
    }

    // Mobile View: Card Layout
    if (isMobile) {
      return (
        <Box sx={{ mt: 2 }}>
          {runs.map((run, index) => <MobileRunCard key={index} run={run} />)}
        </Box>
      );
    }
    
    // Desktop View: Table Layout
    return (
      <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden', mt: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: THEME_COLORS.primary }}>
              {['Batsman', 'Venue', 'Runs', 'Innings', 'Outs', 'Date'].map(headCell => (
                <TableCell key={headCell} sx={{ fontWeight: 'bold', color: THEME_COLORS.headerText, borderBottom: 'none' }}>
                  {headCell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {runs.map((run, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: THEME_COLORS.background },
                  '&:hover': { backgroundColor: THEME_COLORS.hover },
                  '& > td': { borderBottom: '1px solid #e0e0e0' }
                }}
              >
                <TableCell sx={{ fontWeight: 500, color: THEME_COLORS.textPrimary }}>
                  {run.name || "Unknown"}
                </TableCell>
                <TableCell>{run.venue}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontWeight: run.runs >= 50 ? 'bold' : 'regular',
                      color: run.runs >= 50 ? THEME_COLORS.primary : 'inherit'
                    }}
                  >
                    {run.runs}
                  </Typography>
                </TableCell>
                <TableCell>{run.innings}</TableCell>
                <TableCell>{run.outs}</TableCell>
                <TableCell>
                  {new Date(run.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  return (
    <Box sx={{ bgcolor: THEME_COLORS.background, minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4, px: isMobile ? 2 : 3 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ScoreboardOutlinedIcon sx={{ color: THEME_COLORS.primary, fontSize: isMobile ? 32 : 40 }}/>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 'bold', color: THEME_COLORS.textPrimary }}>
              Batting Records
            </Typography>
          </Box>
          <Chip
            label={`${runs.length} Records`}
            sx={{
              fontWeight: 'bold',
              color: THEME_COLORS.headerText,
              backgroundColor: THEME_COLORS.primary,
            }}
          />
        </Box>

        {/* Content Area */}
        {loading ? <LoadingSpinner /> : renderContent()}
        
      </Container>
    </Box>
  );
};

export default ViewRuns;