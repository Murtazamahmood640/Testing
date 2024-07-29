import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SubmitFeedbacks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingOption, setSortingOption] = useState('sortby');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortingChange = (e) => {
    setSortingOption(e.target.value);
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortingOption === 'sortby') {
      return 0;
    } else if (sortingOption === 'name') {
      return a.name?.localeCompare(b.name) || 0;
    } else if (sortingOption === 'id') {
      return a._id.localeCompare(b._id);
    }
    return 0;
  });

  const filteredFeedbacks = sortedFeedbacks.filter((feedback) =>
    feedback.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'feedback', headerName: 'Feedback', flex: 2 },
  ];

  return (
    <Box m="20px">
      <Header title="SUBMITTED FEEDBACK" subtitle =" Submitted Feedbacks" />
            <Box
              m="40px 0 0 0"
              height="75vh"
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: 'none',
                },
                '& .name-column--cell': {
                  color: colors.greenAccent[300],
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: colors.blueAccent[700],
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: colors.primary[400],
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: 'none',
                  backgroundColor: colors.blueAccent[700],
                },
                '& .MuiCheckbox-root': {
                  color: `${colors.greenAccent[200]} !important`,
                },
              }}
            >
              <DataGrid
                rows={filteredFeedbacks.map((feedback, index) => ({ ...feedback, id: index }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                checkboxSelection
                disableSelectionOnClick
              />
            </Box>
            </Box>
       
  );
};

export default SubmitFeedbacks;
