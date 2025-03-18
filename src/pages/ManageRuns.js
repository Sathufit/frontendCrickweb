import React, { useEffect, useState } from "react";
import { fetchRuns, deleteRun, updateRun } from "../api";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, 
  Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography,
  Container, Box, IconButton, Tooltip, CircularProgress
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from "@mui/icons-material";

const ManageRuns = () => {
    const [runs, setRuns] = useState([]);
    const [editRun, setEditRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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

    // Custom styles
    const styles = {
        container: {
            padding: "24px",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        headerContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
        },
        header: {
            fontWeight: 600,
            color: "#1976d2",
            marginBottom: "8px",
        },
        paper: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
        },
        tableContainer: {
            overflowX: "auto",
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
        editButton: {
            backgroundColor: "#4caf50",
            color: "white",
            "&:hover": {
                backgroundColor: "#388e3c",
            },
            minWidth: "32px",
            width: "36px",
            height: "36px",
        },
        deleteButton: {
            backgroundColor: "#f44336",
            color: "white",
            "&:hover": {
                backgroundColor: "#d32f2f",
            },
            minWidth: "32px",
            width: "36px",
            height: "36px",
            marginLeft: "8px",
        },
        refreshButton: {
            backgroundColor: "#2196f3",
            color: "white",
            "&:hover": {
                backgroundColor: "#1565c0",
            },
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
            minWidth: "400px",
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
    };

    return (
        <Container sx={styles.container}>
            <Box sx={styles.headerContainer}>
                <Typography variant="h4" component="h2" sx={styles.header}>
                    Manage Cricket Runs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={loadData}
                    sx={styles.refreshButton}
                >
                    Refresh Data
                </Button>
            </Box>

            <Paper sx={styles.paper}>
                <Box sx={styles.tableContainer}>
                    {loading ? (
                        <Box sx={styles.loadingContainer}>
                            <CircularProgress />
                        </Box>
                    ) : (
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
                    )}
                </Box>
            </Paper>

            {/* Edit Dialog */}
            {editRun && (
                <Dialog 
                    open={true} 
                    onClose={() => setEditRun(null)}
                    PaperProps={{
                        sx: { borderRadius: "12px" }
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
                            name="batsman_name" 
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
                        <Box sx={{ display: "flex", gap: "16px" }}>
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
                        </Box>
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
                    <DialogActions sx={{ padding: "16px 24px" }}>
                        <Button 
                            onClick={() => setEditRun(null)} 
                            sx={{ 
                                color: "#666",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)"
                                }
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
                                }
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
                    PaperProps={{
                        sx: { borderRadius: "12px" }
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
                            <strong>{deleteConfirm.batsman_name}</strong> at{" "}
                            <strong>{deleteConfirm.venue}</strong>?
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", marginTop: "8px" }}>
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ padding: "16px 24px" }}>
                        <Button 
                            onClick={() => setDeleteConfirm(null)} 
                            sx={{ 
                                color: "#666",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.04)"
                                }
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
                                }
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