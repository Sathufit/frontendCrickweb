import React, { useEffect, useState } from "react";
import API_URL from "../config";
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
  useTheme,
  Menu,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { Menu as MenuIcon, SportsCricket as CricketIcon } from '@mui/icons-material';
import axios from "axios";

const ViewWickets = () => {
  const [wickets, setWickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchWickets();
  }, []);

  const fetchWickets = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${API_URL}/wickets`);
        console.log("📌 Fetched Wickets Data:", response.data);
        setWickets(response.data);
        setError(null);
    } catch (err) {
        console.error("❌ Error fetching wickets:", err);
        setError("Failed to load wickets data. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Add Wicket", path: "/add-wicket" },
    { name: "View Wickets", path: "/view-wickets" },
    { name: "Statistics", path: "/statistics" },
  ];

  // Format date to be more compact on mobile
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isMobile 
      ? `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
      : date.toDateString();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#1e3a8a", mb: isMobile ? 2 : 4 }}>
        <Toolbar sx={{ minHeight: isMobile ? '56px' : '64px' }}>
          <CricketIcon sx={{ mr: 1 }} />
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}
          >
            Cricket Stats
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    width: '200px',
                    maxWidth: '100%'
                  }
                }}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.name} 
                    onClick={handleMenuClose}
                    sx={{
                      py: 1.5,
                      ...(item.name === "View Wickets" && {
                        bgcolor: 'rgba(30, 58, 138, 0.1)',
                        borderLeft: '4px solid #1e3a8a'
                      })
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button 
                  key={item.name} 
                  color="inherit" 
                  sx={{ 
                    mx: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(item.name === "View Wickets" && {
                      borderBottom: '2px solid white',
                      borderRadius: 0
                    })
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              mb: isMobile ? 2 : 3, 
              fontWeight: 'bold', 
              color: '#1e3a8a',
              borderBottom: '3px solid #1e3a8a',
              pb: 1,
              display: 'inline-block'
            }}
          >
            Wickets List
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, bgcolor: '#ffebee', color: '#c62828' }}>
            <Typography>{error}</Typography>
          </Paper>
        ) : (
          <>
            {/* Desktop view with table */}
            {!isMobile && (
              <Paper elevation={3} sx={{ overflow: 'auto', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e8eaf6' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Bowler Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Venue</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Wickets</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Innings</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wickets.length > 0 ? (
                      wickets.map((wicket, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' },
                            '&:hover': { bgcolor: '#e3f2fd', transition: 'background-color 0.2s' }
                          }}
                        >
                          <TableCell>{wicket.bowler_name}</TableCell>
                          <TableCell>{wicket.venue}</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: wicket.wickets >= 5 ? '#2e7d32' : 'inherit'
                          }}>
                            {wicket.wickets}
                          </TableCell>
                          <TableCell>{wicket.innings}</TableCell>
                          <TableCell>{formatDate(wicket.date)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" color="textSecondary">
                            No wickets data available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            )}
            
            {/* Mobile view with cards */}
            {isMobile && (
              <Box>
                {wickets.length > 0 ? (
                  wickets.map((wicket, index) => (
                    <Card 
                      key={index} 
                      elevation={2} 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        border: wicket.wickets >= 5 ? '1px solid #2e7d32' : 'none'
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#1e3a8a', fontWeight: 'bold' }}>
                          {wicket.bowler_name}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Venue:</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{wicket.venue}</Typography>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Wickets:</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: wicket.wickets >= 5 ? '#2e7d32' : 'inherit'
                              }}
                            >
                              {wicket.wickets}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Innings:</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{wicket.innings}</Typography>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="body2" color="textSecondary">Date:</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{formatDate(wicket.date)}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="textSecondary">
                      No wickets data available
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ViewWickets;