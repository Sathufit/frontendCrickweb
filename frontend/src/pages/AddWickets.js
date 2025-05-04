import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";

const AddWickets = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bowler_name: "",
    venue: "",
    wickets: "",
    innings: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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
    setLoading(true);
    setSuccess(false);
    setError("");

    console.log("📌 Sending Wicket Data to Backend:", formData);

    try {
      const response = await axios.post(`${API_URL}/wickets`, {
        bowler_name: formData.bowler_name,
        venue: formData.venue,
        wickets: Number(formData.wickets),
        innings: Number(formData.innings),
        date: formData.date
      });

      console.log("✅ Wicket Added Successfully:", response.data);
      setSuccess(true);
      setSnackbar({
        open: true,
        message: "✅ Wicket added successfully!",
        severity: "success"
      });

      // Reset form after successful submission
      setFormData({ bowler_name: "", venue: "", wickets: "", innings: "", date: "" });

    } catch (error) {
      console.error("❌ Error adding wicket:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : "Failed to add wicket. Please try again.");
      setSnackbar({
        open: true,
        message: "❌ Failed to add wicket. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Shared styles as objects
  const styles = {
    pageContainer: {
      backgroundImage: 'linear-gradient(to bottom right, #EEF2FF, #E0E7FF)',
      minHeight: '100vh',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    formCard: {
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease-in-out',
      transform: 'translateY(0)',
    },
    header: {
      background: 'linear-gradient(to right, #4F46E5, #4338CA)',
      padding: '1.5rem',
      color: 'white',
      position: 'relative',
    },
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      marginBottom: '0.25rem',
      letterSpacing: '0.025em',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '500',
    },
    formContainer: {
      padding: '1.75rem',
    },
    formGroup: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #D1D5DB',
      fontSize: '1rem',
      transition: 'all 0.3s',
      outline: 'none',
    },
    inputFocus: {
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
      borderColor: '#4F46E5',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginBottom: '1.25rem',
    },
    successAlert: {
      backgroundColor: '#ECFDF5',
      color: '#047857',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      border: '1px solid #A7F3D0',
    },
    errorAlert: {
      backgroundColor: '#FEF2F2',
      color: '#B91C1C',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      border: '1px solid #FECACA',
    },
    alertIcon: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.5rem',
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#4F46E5',
      color: 'white',
      borderRadius: '0.375rem',
      fontWeight: '600',
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    submitButtonHover: {
      backgroundColor: '#4338CA',
    },
    footer: {
      backgroundColor: '#F9FAFB',
      padding: '0.75rem 1.5rem',
      borderTop: '1px solid #E5E7EB',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '0.75rem',
      color: '#6B7280',
    },
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      marginRight: '0.5rem',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0 1.75rem 1.75rem',
      gap: '1rem'
    },
    secondaryButton: {
      padding: "0.6rem 1rem",
      backgroundColor: "#8B5CF6",
      color: "white",
      borderRadius: "0.375rem",
      fontWeight: "500",
      fontSize: "0.875rem",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
    }
  };

  return (
    <div style={styles.pageContainer} className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-8">
      <div 
        style={styles.formCard} 
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-5px)'}}
        onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'}}
      >
        <div style={styles.header} className="bg-indigo-600 py-4 px-6">
          <h1 style={styles.headerTitle} className="text-2xl font-bold text-white">Add Wickets</h1>
          <p style={styles.headerSubtitle} className="text-indigo-100 text-sm">Record bowling performance details</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.formContainer} className="p-6 space-y-4">
          {success && (
            <div style={styles.successAlert} className="bg-green-100 text-green-700 p-3 rounded-md flex items-center">
              <svg style={styles.alertIcon} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{fontWeight: '500'}}>Wicket added successfully!</span>
            </div>
          )}
          
          {error && (
            <div style={styles.errorAlert} className="bg-red-100 text-red-700 p-3 rounded-md flex items-center">
              <svg style={styles.alertIcon} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span style={{fontWeight: '500'}}>{error}</span>
            </div>
          )}
          
          <div style={styles.formGroup}>
            <label htmlFor="bowler_name" style={styles.label} className="block text-sm font-medium text-gray-700 mb-1">
              Bowler Name
            </label>
            <input
              type="text"
              id="bowler_name"
              name="bowler_name"
              value={formData.bowler_name}
              onChange={handleChange}
              style={styles.input}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              onFocus={(e) => {
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
                e.target.style.borderColor = styles.inputFocus.borderColor;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.borderColor = "#D1D5DB";
              }}
              placeholder="Enter bowler's full name"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="venue" style={styles.label} className="block text-sm font-medium text-gray-700 mb-1">
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              style={styles.input}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              onFocus={(e) => {
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
                e.target.style.borderColor = styles.inputFocus.borderColor;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.borderColor = "#D1D5DB";
              }}
              placeholder="Enter stadium or ground name"
            />
          </div>
          
          <div style={styles.gridContainer} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="wickets" style={styles.label} className="block text-sm font-medium text-gray-700 mb-1">
                Wickets
              </label>
              <input
                type="number"
                id="wickets"
                name="wickets"
                value={formData.wickets}
                onChange={handleChange}
                min="0"
                max="100"
                style={styles.input}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                onFocus={(e) => {
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.borderColor = "#D1D5DB";
                }}
                placeholder="wickets"
              />
            </div>
            
            <div>
              <label htmlFor="innings" style={styles.label} className="block text-sm font-medium text-gray-700 mb-1">
                Innings
              </label>
              <input
                type="number"
                id="innings"
                name="innings"
                value={formData.innings}
                onChange={handleChange}
                min="1"
                max="10"
                style={styles.input}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                onFocus={(e) => {
                  e.target.style.boxShadow = styles.inputFocus.boxShadow;
                  e.target.style.borderColor = styles.inputFocus.borderColor;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.borderColor = "#D1D5DB";
                }}
                placeholder="innings"
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="date" style={styles.label} className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              onFocus={(e) => {
                e.target.style.boxShadow = styles.inputFocus.boxShadow;
                e.target.style.borderColor = styles.inputFocus.borderColor;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.borderColor = "#D1D5DB";
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = styles.submitButton.backgroundColor)}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading 
                ? "bg-indigo-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg style={styles.loadingSpinner} className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Submit Wicket"
            )}
          </button>
        </form>
        
        <div style={styles.buttonsContainer}>
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/manage-wickets")}
            style={styles.secondaryButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#7C3AED")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#8B5CF6")}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 font-medium text-sm"
          >
            Manage Wickets
          </button>
        </div>
        
        <div style={styles.footer} className="bg-gray-50 py-3 px-6 border-t border-gray-200">
          <p style={styles.footerText} className="text-xs text-gray-500 text-center">
            All cricket statistics are stored securely and validated before submission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddWickets;