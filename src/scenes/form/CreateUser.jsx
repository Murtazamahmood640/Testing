import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const CreateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const getManagers = async () => {
      try {
        const { data } = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/getUser');
        const managers = data.filter(user => user.status === 'Manager');
        setManagers(managers);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    getManagers();
  }, []);

  const handleFormSubmit = async (values) => {
    console.log('Form values:', values); // Log form values for debugging
    try {
      const response = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/users/create-user', {
        ...values,
        birthday: values.birthday ? new Date(values.birthday).toISOString() : null,
      });
      console.log('Response:', response.data); // Log API response for debugging
      alert('User created successfully');

      await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/createUser/mail', {
        params: {
          personalEmail: values.personalEmail,
          email: values.email,
          password: values.password,
        }
      }).then(() => alert("Email sent!"));
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
      alert('Error creating user');
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 12" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Designation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.designation}
                name="designation"
                error={!!touched.designation && !!errors.designation}
                helperText={touched.designation && errors.designation}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Personal Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.personalEmail}
                name="personalEmail"
                error={!!touched.personalEmail && !!errors.personalEmail}
                helperText={touched.personalEmail && errors.personalEmail}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="address2"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Office ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.officeId}
                name="officeId"
                error={!!touched.officeId && !!errors.officeId}
                helperText={touched.officeId && errors.officeId}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="LinkedIn ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.linkedinId}
                name="linkedinId"
                error={!!touched.linkedinId && !!errors.linkedinId}
                helperText={touched.linkedinId && errors.linkedinId}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="City"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                name="city"
                error={!!touched.city && !!errors.city}
                helperText={touched.city && errors.city}
                sx={{ gridColumn: "span 6" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }} error={!!touched.status && !!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.status}
                  name="status"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
                {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }} error={!!touched.reportTo && !!errors.reportTo}>
                <InputLabel>Report To</InputLabel>
                <Select
                  label="Report To"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.reportTo}
                  name="reportTo"
                >
                  {managers.map(manager => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name} 
                    </MenuItem>
                  ))}
                </Select>
                {touched.reportTo && errors.reportTo && <FormHelperText>{errors.reportTo}</FormHelperText>}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Create User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  designation: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  personalEmail: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
  officeId: yup.string().required("required"),
  linkedinId: yup.string().required("required"),
  city: yup.string().required("required"),
  status: yup.string().required("required"),
  reportTo: yup.string().required("required"),
});

const initialValues = {
  name: "",
  designation:"",
  email: "",
  personalEmail: "",
  password: "",
  contact: "",
  address1: "",
  address2: "",
  officeId: "",
  linkedinId: "",
  city: "",
  status: "",
  reportTo: "",
};

export default CreateUser;
