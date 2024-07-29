import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GridView from './gridview';
import ListView from './listview';


const View = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/view-invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.date.slice(0, 10).includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex">
        <Box flexGrow={1} p={3}>
          <Typography variant="h4" gutterBottom>View Invoice</Typography>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Search Invoice..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>
          <FormControl component="fieldset">
            <FormLabel component="legend">View Mode</FormLabel>
            <RadioGroup row value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <FormControlLabel value="grid" control={<Radio />} label="Grid View" />
              <FormControlLabel value="list" control={<Radio />} label="List View" />
            </RadioGroup>
          </FormControl>
          <Box mt={3}>
            {viewMode === 'grid' ? (
              <GridView invoices={filteredInvoices} navigate={navigate} />
            ) : (
              <ListView invoices={filteredInvoices} navigate={navigate} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default View;
