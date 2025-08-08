import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Paper, 
  IconButton, 
  useMediaQuery, 
  Menu,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Alert,
  AlertTitle,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import { Menu as MenuIcon, SportsCricket as CricketIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';

// ====================================================================
// 1. THEME DEFINITION (Red & White Palette)
// ====================================================================
// Defining the theme here makes colors and styles consistent and easy to change.
const theme = createTheme({
  palette: {
    primary: {
      main: '#c62828', // A strong, accessible material red
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffebee', // A very light red for backgrounds/hovers
    },
    background: {
      default: '#fafafa', // Soft gray background is easier on the eyes than pure white
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // Dark gray for readability
      secondary: '#757575',
    },
    success: {
      main: '#2e7d32', // Green for highlighting achievements (e.g., 5-wicket hauls)
    },
    error: {
      main: '#d32f2f',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 }, // Softer, more modern corners
      },
    },
    MuiCard: {
        styleOverrides: {
            root: { borderRadius: 12 },
        }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8 },
      },
    },
  },
});

// ====================================================================
// 2. REUSABLE HEADER COMPONENT (Defined in the same file)
// ====================================================================
const navItems = [
    { name: "Home", path: "/" },
    { name: "Add Wicket", path: "/add-wicket" },
    { name: "View Wickets", path: "/view-wickets" },
    { name: "Statistics", path: "/statistics" },
];

const AppHeader = ({ activePage = "View Wickets" }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const activeStyles = {
        // Highlight the active page link
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    };
    
    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <CricketIcon sx={{ mr: 1.5 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Cricket Stats
                </Typography>
                
                {isMobile ? (
                    <>
                        <IconButton size="large" edge="end" color="inherit" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { width: '200px', mt: 1 } }}
                        >
                            {navItems.map((item) => (
                                <MenuItem 
                                    key={item.name} 
                                    onClick={handleMenuClose}
                                    selected={item.name === activePage}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                ) : (
                    <Box>
                        {navItems.map((item) => (
                            <Button 
                                key={item.name} 
                                color="inherit" 
                                sx={{ mx: 0.5, ...(item.name === activePage && activeStyles) }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};


// ====================================================================
// 3. MAIN PAGE COMPONENT
// ====================================================================
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyard.sathush.dev";

const ViewWickets = () => {
  const [wickets, setWickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchWickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/wickets`);
        const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWickets(sortedData);
      } catch (err) {
        console.error("❌ Error fetching wickets:", err);
        setError("Failed to load wickets data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchWickets();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" size={60} />
          <Typography sx={{ ml: 2, alignSelf: 'center' }}>Loading Wickets...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 3 }}>
          <AlertTitle>Request Failed</AlertTitle>
          {error}
        </Alert>
      );
    }

    if (wickets.length === 0) {
      return (
        <Paper variant="outlined" sx={{ textAlign: 'center', p: 4, mt: 3, bgcolor: 'background.paper', borderColor: '#e0e0e0' }}>
            <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6">No Wickets Logged</Typography>
            <Typography color="text.secondary">Get started by using the "Add Wicket" page.</Typography>
        </Paper>
      );
    }
    
    // DESKTOP VIEW
    if (!isMobile) {
      return (
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'secondary.main' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Bowler</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Venue</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Wickets</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Innings</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wickets.map((w) => (
                <TableRow key={w._id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                  <TableCell component="th" scope="row">{w.bowler_name}</TableCell>
                  <TableCell>{w.venue}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {w.wickets >= 5 ? (
                      <Chip label={w.wickets} color="success" variant="filled" size="small" />
                    ) : (
                      w.wickets
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{w.innings}</TableCell>
                  <TableCell>{formatDate(w.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }

    // MOBILE VIEW
    return (
      <Grid container spacing={2}>
        {wickets.map((w) => (
          <Grid item xs={12} key={w._id}>
            <Card variant="outlined" sx={{ borderLeft: 5, borderColor: w.wickets >= 5 ? 'success.main' : 'transparent' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" color="primary.main">{w.bowler_name}</Typography>
                  <Chip label={`${w.wickets} Wickets`} color={w.wickets >= 5 ? "success" : "default"} />
                </Box>
                <Grid container spacing={0.5}>
                  <Grid item xs={4}><Typography variant="body2" color="text.secondary">Venue:</Typography></Grid>
                  <Grid item xs={8}><Typography variant="body2">{w.venue}</Typography></Grid>
                  <Grid item xs={4}><Typography variant="body2" color="text.secondary">Innings:</Typography></Grid>
                  <Grid item xs={8}><Typography variant="body2">{w.innings}</Typography></Grid>
                  <Grid item xs={4}><Typography variant="body2" color="text.secondary">Date:</Typography></Grid>
                  <Grid item xs={8}><Typography variant="body2">{formatDate(w.date)}</Typography></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <AppHeader activePage="View Wickets" />
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ mb: 4 }}>
          Wickets List
        </Typography>
        {renderContent()}
      </Container>
    </Box>
  );
};


// ====================================================================
// 4. WRAPPER COMPONENT TO PROVIDE THE THEME
// ====================================================================
// This is the component you should export. It provides the theme to the ViewWickets component.
const ViewWicketsPage = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Applies baseline styles and background color */}
    <ViewWickets />
  </ThemeProvider>
);

export default ViewWicketsPage;