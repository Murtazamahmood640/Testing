import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Container, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";
import { tokens } from '../../theme';

const ManageException = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const [data, setData] = useState([]);

  async function fetchHolidays() {
    let year = new Date();
    let res = await axios.get(`https://date.nager.at/api/v3/publicholidays/${year.getFullYear()}/US`);
    setData(res.data);
  }

  useEffect(() => {
    fetchHolidays();
  }, []);

  const columns = [
    { field: "name", headerName: "Holiday Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "date", headerName: "Date", width: 150 },
    { field: "countryCode", headerName: "Country", width: 150 },
    { field: "types", headerName: "Type", width: 150, valueGetter: (params) => params.row.types[0] },
  ];

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" mt={5}>
        <Box flex={1} p={3} bgcolor={colors.primary?.[400] || theme.palette.primary.main} borderRadius={3} boxShadow={3}>
          <Header title="Holidays Exceptions" subtitle="Manage Holidays and Exceptions" />
          <Box mt={4} sx={{ height: '70vh', overflowY: 'auto' }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Box sx={{ height: '60vh' }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  getRowId={(row) => row.date + row.name} // Combining date and name to ensure uniqueness
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  sx={{
                    "& .MuiDataGrid-root": {
                      border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                    },
                    "& .name-column--cell": {
                      color: colors.success?.main || theme.palette.success.main,
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: colors.primary?.light || theme.palette.primary.light,
                      borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: colors.background?.default || theme.palette.background.default,
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                      backgroundColor: colors.primary?.light || theme.palette.primary.light,
                    },
                    "& .MuiCheckbox-root": {
                      color: `${colors.success?.main || theme.palette.success.main} !important`,
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default ManageException;
