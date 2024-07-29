import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const ViewOne = () => {
  const [invoice, setInvoice] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(`https://murtazamahm007-abidipro.mdbgo.io/api/viewOne-invoices/`, { params: { _id: id } });
      setInvoice(response.data[0]);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const handleDownloadInvoice = () => {
    const input = document.getElementById('invoice');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
    }).catch(error => {
      console.error("Error capturing invoice:", error);
    });
  };

  return (
    <Box>
      <Box display="flex">
        <Box flexGrow={1} p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Invoice #{invoice.invoiceNumber}</Typography>
            <Button variant="contained" onClick={handleDownloadInvoice}>Download Invoice</Button>
          </Box>
          <Paper id="invoice" elevation={3} p={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Client Information</Typography>
                <Typography><strong>Client Name:</strong> {invoice.clientName}</Typography>
                <Typography><strong>Client Company Name:</strong> {invoice.clientCompany}</Typography>
                <Typography><strong>Client Address:</strong> {invoice.clientAddress}</Typography>
                <Typography><strong>Client Phone Number:</strong> {invoice.clientPhone}</Typography>
                <Typography><strong>Client Email Address:</strong> {invoice.clientEmail}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Company Information</Typography>
                <Typography><strong>Company Name:</strong> {invoice.companyName}</Typography>
                <Typography><strong>Company Address:</strong> {invoice.companyAddress}</Typography>
                <Typography><strong>Company Phone Number:</strong> {invoice.companyPhone}</Typography>
                <Typography><strong>Company Email Address:</strong> {invoice.companyEmail}</Typography>
                <Typography><strong>Company Website:</strong> {invoice.companyWebsite}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Invoice Information</Typography>
                <Typography><strong>Invoice Number:</strong> {invoice.invoiceNumber}</Typography>
                <Typography><strong>Account ID/Number:</strong> {invoice.bankid}</Typography>
                <Typography><strong>Payment Terms:</strong> {invoice.paymentTerms}</Typography>
                <Typography><strong>Invoice Amount:</strong> {invoice.totalAmount
                }</Typography>
<Typography><strong>Invoice Date:</strong> {invoice.date}</Typography>
</Grid>

</Grid>
</Paper>
</Box>
</Box>
</Box>
);
};

export default ViewOne;