import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const ListView = ({ invoices, navigate }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((data, i) => (
            <TableRow key={i} onClick={() => navigate(`/ViewInvoice/${data._id}`)} style={{ cursor: 'pointer' }}>
              <TableCell>{data.invoiceNumber}</TableCell>
              <TableCell>{data.companyName}</TableCell>
              <TableCell>{data.paymentTerms}</TableCell>
              <TableCell>{data.clientName}</TableCell>
              <TableCell>{data.date.slice(0, 10)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListView;
