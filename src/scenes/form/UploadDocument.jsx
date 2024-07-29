import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doc = () => {
  const [filename, setFileName] = useState('');

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      let formData = new FormData();
      formData.append('filename', values.documentName);
      formData.append('sentBy', values.sentby);
      formData.append('reason', values.reason);
      formData.append('dated', values.dated);
      formData.append('file', values.file);
  
      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const res = await axios.post("https://murtazamahm007-abidipro.mdbgo.io/api/document", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res);
      toast.success("File Uploaded!");
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error("Failed to upload file");
    } finally {
      setSubmitting(false);
    }
  };
  
  

  return (
    <Box m="20px">
      <Header title="DOCUMENT INFORMATION" subtitle="Upload a new document" />
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(12, 1fr)">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Document Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.documentName}
                name="documentName"
                error={touched.documentName && !!errors.documentName}
                helperText={touched.documentName && errors.documentName}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Sent By"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sentby}
                name="sentby"
                error={touched.sentby && !!errors.sentby}
                helperText={touched.sentby && errors.sentby}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Reason / Label"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reason}
                name="reason"
                error={touched.reason && !!errors.reason}
                helperText={touched.reason && errors.reason}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Dated"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dated}
                name="dated"
                error={touched.dated && !!errors.dated}
                helperText={touched.dated && errors.dated}
                sx={{ gridColumn: "span 6" }}
              />
              <input
                accept=".pdf"
                id="fileupload"
                type="file"
                style={{ display: 'none' }}
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                  setFileName(event.currentTarget.files[0].name);
                }}
              />
              <label htmlFor="fileupload" className='custom-file-upload' style={{ gridColumn: "span 6" }}>
                <Button variant="contained" color="primary" component="span">
                  Upload File
                </Button>
              </label>
              <Box sx={{ gridColumn: "span 6" }}>
                {filename ? filename : "No file selected"}
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
                Upload File
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  documentName: yup.string().required("required"),
  sentby: yup.string().required("required"),
  reason: yup.string().required("required"),
  dated: yup.string().required("required"),
  file: yup.mixed().required("required"),
});

const initialValues = {
  documentName: "",
  sentby: "",
  reason: "",
  dated: "",
  file: null,
};

export default Doc;
