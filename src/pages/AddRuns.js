import React, { useState } from "react";
import API_URL from "../config";

import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import { 
  SportsCricket as CricketIcon, 
  LocationOn as LocationIcon,
  Score as ScoreIcon,
  Event as DateIcon,
  Person as PersonIcon,
  Add as AddIcon
} from "@mui/icons-material";
import axios from "axios";

const AddRuns = () => {
  const [formData, setFormData] = useState({
    name: "",
    venue: "",
    runs: "",
    innings: "",
    outs: "",
    date: "",
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post(`${API_URL}/runs`, formData);
        console.log("✅ Run Added:", response.data);
    } catch (error) {
        console.error("❌ Error adding run:", error.response?.data || error);
    }
    console.log("✅ Wicket Added Successfully:", response.data); // ✅ Debug Log
        setSuccess(true);
};


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 4,
          borderRadius: 2,
          background: "linear-gradient(to right bottom, #ffffff, #f9f9f9)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)"
        }}
      >
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 4,
          borderBottom: "2px solid #1976d2",
          pb: 2
        }}>
          <CricketIcon sx={{ fontSize: 36, mr: 2, color: "#1976d2" }} />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: "#0a2540",
              letterSpacing: "-0.5px"
            }}
          >
            Add Batting Statistics
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                label="Batsman Name" 
                name="name" 
                value={formData.name}
                onChange={handleChange} 
                fullWidth 
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                label="Venue" 
                name="venue" 
                value={formData.venue}
                onChange={handleChange} 
                fullWidth 
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                label="Date" 
                name="date" 
                type="date" 
                value={formData.date}
                onChange={handleChange} 
                fullWidth 
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={4}>
              <TextField 
                label="Runs" 
                name="runs" 
                type="number" 
                value={formData.runs}
                onChange={handleChange} 
                fullWidth 
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScoreIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={4}>
              <TextField 
                label="Innings" 
                name="innings" 
                type="number" 
                value={formData.innings}
                onChange={handleChange} 
                fullWidth 
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScoreIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={4}>
              <TextField 
                label="Outs" 
                name="outs" 
                type="number" 
                value={formData.outs}
                onChange={handleChange} 
                fullWidth 
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScoreIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: "#1976d2",
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#0d47a1",
                      boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  Add Batting Record
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        <div className="flex space-x-4 mt-4">
  
</div>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddRuns;