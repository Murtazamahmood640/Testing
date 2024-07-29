import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import axios from 'axios';

const AllDoc = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null); // Added error state

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/document');
      console.log(response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch documents. Please try again later.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const columns = [
    { field: 'id', headerName: 'S.No', flex: 1 },
    { field: 'filename', headerName: 'File', flex: 2 },
    { field: 'sentBy', headerName: 'Provider', flex: 2 },
    { field: 'dated', headerName: 'Saved Date', flex: 2, valueFormatter: (params) => params.value.slice(0, 10) },
  ];

  const rows = documents.map((data, index) => ({
    id: index + 1,
    filename: data.filename,
    sentBy: data.sentBy,
    dated: data.dated,
    path: data.path,
  }));

  return (
    <Box className="main-content" flexGrow={1} p={2} style={{ fontFamily: 'Poppins' }}>
      <Typography variant="h4" gutterBottom>
        View Documents
      </Typography>
      {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
      <Box
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
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
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          onRowClick={(params) => window.open(`https://murtazamahm007-abidipro.mdbgo.io/${params.row.path}`, '_blank')}
        />
      </Box>
    </Box>
  );
};

export default AllDoc;
