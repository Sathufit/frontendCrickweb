import React, { useEffect, useState } from "react";
import { fetchRuns, deleteRun, updateRun } from "../api";
import "../styles/DataEntryImproved.css";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, 
  Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography,
  Container, Box, IconButton, Tooltip, CircularProgress, useMediaQuery,
  useTheme, Card, CardContent, Chip, Grid, Divider
} from "@mui/material";
import { 
  Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon
} from "@mui/icons-material";

const ManageRuns = () => {
    const [runs, setRuns] = useState([]);
    const [editRun, setEditRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchRuns();
            console.log("📌 Fetched Runs Data:", data);
            setRuns(data);
        } catch (error) {
            console.error("Error fetching runs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        setDeleteConfirm(null);
        try {
            await deleteRun(id);
            setRuns(runs.filter((run) => run._id !== id));
        } catch (error) {
            console.error("Error deleting run:", error);
        }
    };

    const handleEdit = (run) => {
        // Create a copy of the run with date formatted for the date input
        const formattedRun = {
            ...run,
            date: run.date ? new Date(run.date).toISOString().split('T')[0] : ''
        };
        setEditRun(formattedRun);
    };

    const handleChange = (e) => {
        setEditRun({ ...editRun, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await updateRun(editRun._id, editRun);
            setRuns(runs.map((run) => (run._id === editRun._id ? editRun : run)));
            setEditRun(null);
        } catch (error) {
            console.error("Error updating run:", error);
        }
    };

    const handleExpandCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    // Custom styles
    const styles = {
        container: {
            padding: isMobile ? "16px" : "24px",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        headerContainer: {
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "24px",
            gap: isMobile ? "16px" : "0",
        },
        header: {
            fontWeight: 600,
            color: "#1976d2",
            marginBottom: isMobile ? "8px" : "0",
            fontSize: isMobile ? "1.5rem" : "2rem",
        },
        paper: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
        },
        tableContainer: {
            overflowX: "auto",
            display: isMobile ? "none" : "block", // Hide table on mobile
        },
        cardsContainer: {
            display: isMobile ? "flex" : "none", // Show cards only on mobile
            flexDirection: "column",
            gap: "16px",
        },
        card: {
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
        },
        cardHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            backgroundColor: "#f5f5f5",
        },
        cardContent: {
            padding: "16px",
        },
        cardRow: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
        },
        cardLabel: {
            fontWeight: 500,
            color: "#666",
            fontSize: "0.875rem",
        },
        cardValue: {
            fontWeight: 400,
            color: "#333",
        },
        cardActions: {
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px 16px",
            backgroundColor: "#fafafa",
        },
        table: {
            minWidth: "650px",
        },
        tableHeader: {
            backgroundColor: "#f5f5f5",
        },
        tableHeaderCell: {
            fontWeight: 600,
            color: "#555",
            fontSize: "0.875rem",
        },
        tableRow: {
            "&:nth-of-type(odd)": {
                backgroundColor: "#fafafa",
            },
            "&:hover": {
                backgroundColor: "#f1f8ff",
            },
            transition: "background-color 0.2s",
        },
        refreshButton: {
            backgroundColor: "#2196f3",
            color: "white",
            "&:hover": {
                backgroundColor: "#1565c0",
            },
            width: isMobile ? "100%" : "auto",
        },
        noData: {
            padding: "24px",
            textAlign: "center",
            color: "#666",
        },
        emptyRow: {
            height: "112px",
        },
        dialogContent: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingTop: "16px !important",
            minWidth: isMobile ? "auto" : "400px",
        },
        backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
        },
        confirmDialogContent: {
            padding: "24px",
            textAlign: "center",
        },
        chip: {
            margin: "0 4px",
        },
        mobileDialogActions: {
            flexDirection: "column",
            padding: "16px",
        },
        mobileDialogButton: {
            width: "100%",
            marginLeft: "0 !important",
            marginTop: "8px",
        },
        expandButton: {
            padding: "4px",
        },
    };

    // Mobile card view for each run
    const RunCard = ({ run }) => (
        <Card sx={styles.card}>
            <Box sx={styles.cardHeader}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {run.name}
                </Typography>
                <IconButton 
                    size="small" 
                    onClick={() => handleExpandCard(run._id)}
                    sx={styles.expandButton}
                >
                    {expandedCard === run._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>
            
            <CardContent sx={styles.cardContent}>
                <Box sx={styles.cardRow}>
                    <Typography sx={styles.cardLabel}>Venue:</Typography>
                    <Typography sx={styles.cardValue}>{run.venue}</Typography>
                </Box>
                
                <Box sx={styles.cardRow}>
                    <Typography sx={styles.cardLabel}>Date:</Typography>
                    <Typography sx={styles.cardValue}>{new Date(run.date).toLocaleDateString()}</Typography>
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", marginY: "8px" }}>
                    <Chip 
                        label={`Runs: ${run.runs}`} 
                        sx={{ ...styles.chip, backgroundColor: "#e3f2fd" }} 
                    />
                    <Chip 
                        label={`Innings: ${run.innings}`} 
                        sx={{ ...styles.chip, backgroundColor: "#e8f5e9" }} 
                    />
                    <Chip 
                        label={`Outs: ${run.outs}`} 
                        sx={{ ...styles.chip, backgroundColor: "#fff3e0" }} 
                    />
                </Box>
                
                {expandedCard === run._id && (
                    <>
                        <Divider sx={{ marginY: "12px" }} />
                        <Typography sx={{ ...styles.cardLabel, marginBottom: "8px" }}>
                            Stats:
                        </Typography>
                        <Box sx={{ ...styles.cardRow, marginBottom: "4px" }}>
                            <Typography sx={styles.cardLabel}>Average:</Typography>
                            <Typography sx={styles.cardValue}>
                                {run.outs > 0 ? (run.runs / run.outs).toFixed(2) : "N/A"}
                            </Typography>
                        </Box>
                        <Box sx={styles.cardRow}>
                            <Typography sx={styles.cardLabel}>Runs per Innings:</Typography>
                            <Typography sx={styles.cardValue}>
                                {run.innings > 0 ? (run.runs / run.innings).toFixed(2) : "N/A"}
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
            
            <Box sx={styles.cardActions}>
                <Button 
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(run)}
                    sx={{ marginRight: "8px", color: "#4caf50" }}
                >
                    Edit
                </Button>
                <Button 
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteConfirm(run)}
                    sx={{ color: "#f44336" }}
                >
                    Delete
                </Button>
            </Box>
        </Card>
    );

    return (
        <Container sx={styles.container} disableGutters={isMobile}>
            <Box sx={styles.headerContainer}>
                <Typography variant={isMobile ? "h5" : "h4"} component="h2" sx={styles.header}>
                    Manage Cricket Runs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={loadData}
                    sx={styles.refreshButton}
                    fullWidth={isMobile}
                >
                    Refresh Data
                </Button>
            </Box>

            {loading ? (
                <Box sx={styles.loadingContainer}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <Paper sx={styles.paper}>
                        <Box sx={styles.tableContainer}>
                            <Table sx={styles.table}>
                                <TableHead sx={styles.tableHeader}>
                                    <TableRow>
                                        <TableCell sx={styles.tableHeaderCell}>Batsman Name</TableCell>
                                        <TableCell sx={styles.tableHeaderCell}>Venue</TableCell>
                                        <TableCell sx={styles.tableHeaderCell} align="right">Runs</TableCell>
                                        <TableCell sx={styles.tableHeaderCell} align="right">Innings</TableCell>
                                        <TableCell sx={styles.tableHeaderCell} align="right">Outs</TableCell>
                                        <TableCell sx={styles.tableHeaderCell}>Date</TableCell>
                                        <TableCell sx={styles.tableHeaderCell} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {runs.length > 0 ? (
                                        runs.map((run) => (
                                            <TableRow key={run._id} sx={styles.tableRow}>
                                                <TableCell sx={{ fontWeight: 500 }}>{run.name}</TableCell>
                                                <TableCell>{run.venue}</TableCell>
                                                <TableCell align="right">{run.runs}</TableCell>
                                                <TableCell align="right">{run.innings}</TableCell>
                                                <TableCell align="right">{run.outs}</TableCell>
                                                <TableCell>{new Date(run.date).toLocaleDateString()}</TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                        <Tooltip title="Edit">
                                                            <IconButton 
                                                                onClick={() => handleEdit(run)}
                                                                sx={{
                                                                    color: "#4caf50",
                                                                    "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.1)" }
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton 
                                                                onClick={() => setDeleteConfirm(run)}
                                                                sx={{
                                                                    color: "#f44336",
                                                                    "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" }
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow sx={styles.emptyRow}>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body1" sx={styles.noData}>
                                                    No runs data available. Add some runs to get started.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Paper>

                    {/* Mobile Card View */}
                    <Box sx={styles.cardsContainer}>
                        {runs.length > 0 ? (
                            runs.map((run) => (
                                <RunCard key={run._id} run={run} />
                            ))
                        ) : (
                            <Card sx={styles.card}>
                                <CardContent>
                                    <Typography variant="body1" sx={styles.noData}>
                                        No runs data available. Add some runs to get started.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </>
            )}

            {/* Edit Dialog */}
            {editRun && (
                <Dialog 
                    open={true} 
                    onClose={() => setEditRun(null)}
                    fullScreen={isMobile}
                    PaperProps={{
                        sx: { borderRadius: isMobile ? "0" : "12px" }
                    }}
                    BackdropProps={{
                        sx: styles.backdrop
                    }}
                >
                    <DialogTitle sx={{ 
                        backgroundColor: "#1976d2", 
                        color: "white",
                        padding: "16px 24px",
                    }}>
                        Edit Cricket Run Record
                    </DialogTitle>
                    <DialogContent sx={styles.dialogContent}>
                        <TextField 
                            label="Batsman Name" 
                            name="name" 
                            value={editRun.name} 
                            onChange={handleChange} 
                            fullWidth 
                            required 
                            variant="outlined"
                            sx={{ marginTop: "8px" }}
                        />
                        <TextField 
                            label="Venue" 
                            name="venue" 
                            value={editRun.venue} 
                            onChange={handleChange} 
                            fullWidth 
                            required 
                            variant="outlined"
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField 
                                    label="Runs" 
                                    name="runs" 
                                    type="number" 
                                    value={editRun.runs} 
                                    onChange={handleChange} 
                                    fullWidth 
                                    required 
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField 
                                    label="Innings" 
                                    name="innings" 
                                    type="number" 
                                    value={editRun.innings} 
                                    onChange={handleChange} 
                                    fullWidth 
                                    required 
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField 
                                    label="Outs" 
                                    name="outs" 
                                    type="number" 
                                    value={editRun.outs} 
                                    onChange={handleChange} 
                                    fullWidth 
                                    required 
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <TextField 
                            label="Date" 
                            name="date" 
                            type="date" 
                            value={editRun.date} 
                            onChange={handleChange} 
                            fullWidth 
                            required 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions sx={isMobile ? styles.mobileDialogActions : { padding: "16px 24px" }}>
                        <Button 
                            onClick={() => setEditRun(null)} 
                            sx={{ 
                                color: "#666",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)"
                                },
                                ...(isMobile && styles.mobileDialogButton)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            variant="contained" 
                            sx={{
                                backgroundColor: "#1976d2",
                                "&:hover": {
                                    backgroundColor: "#1565c0"
                                },
                                ...(isMobile && styles.mobileDialogButton)
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <Dialog 
                    open={true} 
                    onClose={() => setDeleteConfirm(null)}
                    fullScreen={isMobile}
                    PaperProps={{
                        sx: { borderRadius: isMobile ? "0" : "12px" }
                    }}
                    BackdropProps={{
                        sx: styles.backdrop
                    }}
                >
                    <DialogTitle sx={{ 
                        backgroundColor: "#f44336", 
                        color: "white",
                        padding: "16px 24px",
                    }}>
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent sx={styles.confirmDialogContent}>
                        <Typography variant="body1">
                            Are you sure you want to delete the record for{" "}
                            <strong>{deleteConfirm.name}</strong> at{" "}
                            <strong>{deleteConfirm.venue}</strong>?
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", marginTop: "8px" }}>
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={isMobile ? styles.mobileDialogActions : { padding: "16px 24px" }}>
                        <Button 
                            onClick={() => setDeleteConfirm(null)} 
                            sx={{ 
                                color: "#666",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)"
                                },
                                ...(isMobile && styles.mobileDialogButton)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleDelete(deleteConfirm._id)} 
                            variant="contained" 
                            sx={{
                                backgroundColor: "#f44336",
                                "&:hover": {
                                    backgroundColor: "#d32f2f"
                                },
                                ...(isMobile && styles.mobileDialogButton)
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default ManageRuns;