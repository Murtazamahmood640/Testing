import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../../components/Header";

const CreateInvoice = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/create-invoices');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Error fetching invoices');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/invoices', {
        ...values,
        date: new Date().toISOString()
      });
      console.log('Form submitted successfully:', response.data);
      toast.success("Invoice Created successfully");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Kindly Fill all Fields Correctly");
    }
  };

  const validationSchema = yup.object().shape({
    invoiceNumber: yup.string().required("Invoice Number is required"),
    bankid: yup.string().required("Account ID/Number is required"),
    paymentTerms: yup.string().required("Payment Terms are required"),
    totalAmount: yup.number().required("Invoice Amount is required").positive("Amount must be positive"),
    clientName: yup.string().required("Client Name is required"),
    clientCompany: yup.string().required("Client Company Name is required"),
    clientAddress: yup.string().required("Client Address is required"),
    clientPhone: yup.string().required("Client Phone Number is required"),
    clientEmail: yup.string().email("Invalid email").required("Client Email Address is required"),
    companyName: yup.string().required("Company Name is required"),
    companyAddress: yup.string().required("Company Address is required"),
    companyPhone: yup.string().required("Company Phone Number is required"),
    companyEmail: yup.string().email("Invalid email").required("Company Email Address is required"),
    companyWebsite: yup.string().url("Invalid URL").required("Company Website is required"),
    companyTin: yup.string().required("Company TIN is required")
  });

  const initialValues = {
    invoiceNumber: "",
    bankid: "",
    paymentTerms: "",
    totalAmount: "",
    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyWebsite: "",
    companyTin: ""
  };

  return (
    <Box m="20px">
          <Header title="CREATE INVOICE" subtitle="Create a New Invoice" />
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(12, 1fr)"
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Invoice Number"
                    name="invoiceNumber"
                    value={values.invoiceNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.invoiceNumber && !!errors.invoiceNumber}
                    helperText={touched.invoiceNumber && errors.invoiceNumber}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Account ID/Number"
                    name="bankid"
                    value={values.bankid}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.bankid && !!errors.bankid}
                    helperText={touched.bankid && errors.bankid}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <FormControl 
                    fullWidth 
                    variant="filled" 
                    error={touched.paymentTerms && !!errors.paymentTerms}
                    sx={{ gridColumn: "span 6" }}
                  >
                    <InputLabel>Payment Terms</InputLabel>
                    <Select
                      label="Payment Terms"
                      name="paymentTerms"
                      value={values.paymentTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Wallet Transfer">Wallet Transfer</MenuItem>
                      <MenuItem value="Cash">Promise / Hand-Cash</MenuItem>
                    </Select>
                    <FormHelperText>{touched.paymentTerms && errors.paymentTerms}</FormHelperText>
                  </FormControl>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Invoice Amount"
                    name="totalAmount"
                    type="number"
                    value={values.totalAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.totalAmount && !!errors.totalAmount}
                    helperText={touched.totalAmount && errors.totalAmount}
                    sx={{ gridColumn: "span 6" }}
                  />
                  
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Client Name"
                    name="clientName"
                    value={values.clientName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientName && !!errors.clientName}
                    helperText={touched.clientName && errors.clientName}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Client Company Name"
                    name="clientCompany"
                    value={values.clientCompany}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientCompany && !!errors.clientCompany}
                    helperText={touched.clientCompany && errors.clientCompany}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Client Address"
                    name="clientAddress"
                    value={values.clientAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientAddress && !!errors.clientAddress}
                    helperText={touched.clientAddress && errors.clientAddress}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Client Phone Number"
                    name="clientPhone"
                    value={values.clientPhone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientPhone && !!errors.clientPhone}
                    helperText={touched.clientPhone && errors.clientPhone}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Client Email Address"
                    name="clientEmail"
                    value={values.clientEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientEmail && !!errors.clientEmail}
                    helperText={touched.clientEmail && errors.clientEmail}
                    sx={{ gridColumn: "span 6" }}
                  />
                  
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company Name"
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyName && !!errors.companyName}
                    helperText={touched.companyName && errors.companyName}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company Address"
                    name="companyAddress"
                    value={values.companyAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyAddress && !!errors.companyAddress}
                    helperText={touched.companyAddress && errors.companyAddress}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company Phone Number"
                    name="companyPhone"
                    value={values.companyPhone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyPhone && !!errors.companyPhone}
                    helperText={touched.companyPhone && errors.companyPhone}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company Email Address"
                    name="companyEmail"
                    value={values.companyEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyEmail && !!errors.companyEmail}
                    helperText={touched.companyEmail && errors.companyEmail}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company Website"
                    name="companyWebsite"
                    value={values.companyWebsite}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyWebsite && !!errors.companyWebsite}
                    helperText={touched.companyWebsite && errors.companyWebsite}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company TIN"
                    name="companyTin"
                    value={values.companyTin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyTin && !!errors.companyTin}
                    helperText={touched.companyTin && errors.companyTin}
                    sx={{ gridColumn: "span 6" }}
                  />
                </Box>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Create Invoice
                </Button>
              </form>
            )}
          </Formik>
</Box>        
  );
};

export default CreateInvoice;
