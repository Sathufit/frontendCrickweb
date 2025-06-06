import React, { useEffect, useState } from "react";


import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  Button, Container, Typography, Dialog, DialogActions, 
  DialogContent, DialogTitle, TextField, Paper, Box,
  IconButton, Tooltip, Snackbar, Alert, CircularProgress,
  useMediaQuery, useTheme, Grid, Card, CardContent
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyardcricket.onrender.com";


const ManageWickets = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [wickets, setWickets] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    fetchWickets();
  }, []);

  const fetchWickets = async () => {
    setLoading(true);
    try {
        console.log("📌 Fetching Wickets...");
        const response = await axios.get(`${API_URL}/wickets`);
        console.log("✅ Wickets Data Fetched:", response.data);
        setWickets(response.data);
    } catch (error) {
        console.error("❌ Error fetching wickets:", error);
        showSnackbar("Failed to load wickets", "error");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this wicket?")) {
        try {
            console.log(`📌 Deleting Wicket with ID: ${id}`);
            const response = await axios.delete(`${API_URL}/wickets/${id}`);
            console.log("✅ Wicket Deleted:", response.data);

            fetchWickets(); // Refresh data
            showSnackbar("Wicket deleted successfully", "success");
        } catch (error) {
            console.error("❌ Error deleting wicket:", error.response?.data || error);
            showSnackbar("Failed to delete wicket", "error");
        }
    }
  };

  const handleEdit = (wicket) => {
    console.log("📌 Editing Wicket Data:", wicket);

    // Ensure the date is formatted correctly
    const formattedDate = wicket.date ? new Date(wicket.date).toISOString().split('T')[0] : '';
    
    setEditData({ ...wicket, date: formattedDate });
    setOpenDialog(true);
    setAddMode(false);
  };

  const handleAdd = () => {
    setEditData({
      bowler_name: "",
      venue: "",
      wickets: "",
      innings: "",
      date: new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
    setAddMode(true);
  };

  const handleUpdate = async () => {
    try {
        if (!editData.bowler_name || !editData.venue || !editData.wickets || !editData.innings || !editData.date) {
            showSnackbar("❌ All fields are required!", "error");
            return;
        }

        console.log("📌 Updating Wicket Data:", editData);

        if (addMode) {
            const response = await axios.post(`${API_URL}/wickets`, editData);
            console.log("✅ Wicket Added:", response.data);
        } else {
            const response = await axios.put(`${API_URL}/wickets/${editData._id}`, editData);
            console.log("✅ Wicket Updated:", response.data);
        }

        showSnackbar(addMode ? "New wicket added successfully" : "Wicket updated successfully", "success");
        setOpenDialog(false);
        fetchWickets(); // Refresh data
    } catch (error) {
        console.error("❌ Error updating wicket:", error.response?.data || error);
        showSnackbar(addMode ? "Failed to add wicket" : "Failed to update wicket", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const tableHeaderStyle = {
    backgroundColor: "#1976d2",
    color: "white",
    fontWeight: "bold",
    padding: isMobile ? "8px 6px" : undefined
  };

  const buttonStyle = {
    textTransform: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    whiteSpace: isMobile ? "nowrap" : undefined,
    fontSize: isMobile ? "0.75rem" : undefined,
    padding: isMobile ? "6px 10px" : undefined
  };

  // Mobile card view for wickets
  const renderMobileCard = (wicket) => (
    <Card 
      key={wicket._id}
      sx={{ 
        mb: 2, 
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0"
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}>
          {wicket.bowler_name}
        </Typography>
        
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Venue:</Typography>
            <Typography variant="body1">{wicket.venue}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Date:</Typography>
            <Typography variant="body1">
              {new Date(wicket.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </Typography>
          </Grid>
        </Grid>
        
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Wickets:</Typography>
            <Box sx={{ 
              display: "inline-flex", 
              alignItems: "center", 
              backgroundColor: "#e3f2fd", 
              color: "#1976d2",
              borderRadius: "16px",
              px: 2,
              py: 0.5,
              mt: 0.5,
              fontWeight: "bold"
            }}>
              {wicket.wickets}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">Innings:</Typography>
            <Typography variant="body1">{wicket.innings}</Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Tooltip title="Edit">
            <IconButton 
              onClick={() => handleEdit(wicket)} 
              size="small"
              sx={{
                color: "#1976d2",
                mr: 1
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              onClick={() => handleDelete(wicket._id)} 
              size="small"
              sx={{
                color: "#f44336"
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 2 : 3 }}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isMobile ? "flex-start" : "center", 
        mb: isMobile ? 2 : 4 
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            fontWeight: "bold", 
            color: "#1976d2", 
            position: "relative",
            mb: isMobile ? 2 : 0,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: 0,
              width: "60px",
              height: "4px",
              backgroundColor: "#f57c00",
              borderRadius: "2px"
            }
          }}
        >
          Manage Wickets
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAdd}
          fullWidth={isMobile}
          sx={{
            ...buttonStyle,
            backgroundColor: "#4caf50",
            "&:hover": {
              backgroundColor: "#388e3c"
            }
          }}
        >
          Add New Wicket
        </Button>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: "12px", 
          overflow: "hidden",
          mb: 4,
          backgroundColor: "#ffffff"
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : wickets.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">No wickets available</Typography>
          </Box>
        ) : isMobile ? (
          <Box sx={{ p: 2 }}>
            {wickets.map(wicket => renderMobileCard(wicket))}
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyle}>Bowler Name</TableCell>
                <TableCell sx={tableHeaderStyle}>Venue</TableCell>
                <TableCell sx={tableHeaderStyle}>Wickets</TableCell>
                <TableCell sx={tableHeaderStyle}>Innings</TableCell>
                <TableCell sx={tableHeaderStyle}>Date</TableCell>
                <TableCell sx={tableHeaderStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wickets.map((wicket) => (
                <TableRow 
                  key={wicket._id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#f1f8ff" },
                    transition: "background-color 0.2s ease"
                  }}
                >
                  <TableCell sx={{ fontWeight: "500" }}>{wicket.bowler_name}</TableCell>
                  <TableCell>{wicket.venue}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      backgroundColor: "#e3f2fd", 
                      color: "#1976d2",
                      borderRadius: "16px",
                      px: 2,
                      py: 0.5,
                      fontWeight: "bold"
                    }}>
                      {wicket.wickets}
                    </Box>
                  </TableCell>
                  <TableCell>{wicket.innings}</TableCell>
                  <TableCell>{new Date(wicket.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        onClick={() => handleEdit(wicket)}
                        sx={{
                          color: "#1976d2",
                          "&:hover": { backgroundColor: "#e3f2fd" }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton 
                        onClick={() => handleDelete(wicket._id)}
                        sx={{
                          color: "#f44336",
                          "&:hover": { backgroundColor: "#ffebee" }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Edit/Add Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "12px",
            minWidth: isMobile ? "100%" : "400px"
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: "#1976d2", 
          color: "white",
          fontWeight: "bold",
          pb: 2,
          pt: 2
        }}>
          {addMode ? "Add New Wicket" : "Edit Wicket"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <TextField
            label="Bowler Name"
            value={editData?.bowler_name || ""}
            onChange={(e) => setEditData({ ...editData, bowler_name: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: "8px" }
            }}
          />
          <TextField
            label="Venue"
            value={editData?.venue || ""}
            onChange={(e) => setEditData({ ...editData, venue: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: "8px" }
            }}
          />
          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row", 
            gap: isMobile ? 0 : 2 
          }}>
            <TextField
              label="Wickets"
              type="number"
              value={editData?.wickets || ""}
              onChange={(e) => setEditData({ ...editData, wickets: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: "8px" },
                inputProps: { min: 0, max: 10 }
              }}
            />
            <TextField
              label="Innings"
              type="number"
              value={editData?.innings || ""}
              onChange={(e) => setEditData({ ...editData, innings: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: "8px" },
                inputProps: { min: 1, max: 4 }
              }}
            />
          </Box>
          <TextField
            label="Date"
            type="date"
            value={editData?.date || ""}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: "8px" }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          px: isMobile ? 2 : 3, 
          pb: isMobile ? 2 : 3,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 1 : 0
        }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            fullWidth={isMobile}
            sx={{
              ...buttonStyle,
              color: "#616161",
              border: "1px solid #e0e0e0",
              "&:hover": {
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained"
            fullWidth={isMobile}
            sx={{
              ...buttonStyle,
              backgroundColor: addMode ? "#4caf50" : "#1976d2",
              "&:hover": {
                backgroundColor: addMode ? "#388e3c" : "#1565c0"
              }
            }}
          >
            {addMode ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ 
          vertical: isMobile ? "top" : "bottom", 
          horizontal: "center" 
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: "100%", 
            borderRadius: "8px",
            maxWidth: isMobile ? "90vw" : undefined
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageWickets;