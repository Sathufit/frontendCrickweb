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
  CircularProgress
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#1e3a8a", mb: 4 }}>
        <Toolbar>
          <CricketIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
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
              >
                {navItems.map((item) => (
                  <MenuItem key={item.name} onClick={handleMenuClose}>
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
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
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
                      <TableCell>{new Date(wicket.date).toDateString()}</TableCell>
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
      </Container>
    </Box>
  );
};

export default ViewWickets;