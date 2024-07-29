import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const GridView = ({ invoices, navigate }) => {
  return (
    <Grid container spacing={3}>
      {invoices.map((data, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card onClick={() => navigate(`/ViewInvoice/${data._id}`)} style={{ cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h5" component="div">Invoice #{data.invoiceNumber}</Typography>
              <Typography variant="body2" color="textSecondary">Company: {data.companyName}</Typography>
              <Typography variant="body2" color="textSecondary">Payment Method: {data.paymentTerms}</Typography>
              <Typography variant="body2" color="textSecondary">For: {data.clientName}</Typography>
              <Typography variant="body2" color="textSecondary">Date: {data.date.slice(0, 10)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GridView;
