import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header"; // Assuming Header is your header component

const EmployeeInfo = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [managers, setManagers] = useState([]);
  const [netSalary, setNetSalary] = useState(0);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/getUser');
        const managers = response.data.filter(user => user.status === 'Manager');
        setManagers(managers);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    fetchManagers();
  }, []);

  const handleNetSalary = (values) => {
    return Number(values.basicSalary) + Number(values.houseAllowance) + Number(values.transportAllowance) + Number(values.otherAllowances) - Number(values.deductions);
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/addEmploy', {
        ...values,
        netSalary: handleNetSalary(values),
        date: new Date().toISOString()
      });
      console.log('Response:', response.data);
      alert('Employee Added successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Kindly Fill all Fields Correctly');
    }
  };

  const validationSchema = yup.object().shape({
    employeeId: yup.string().required("Required"),
    employeeName: yup.string().required("Required"),
    department: yup.string().required("Required"),
    designation: yup.string().required("Required"),
    joiningDate: yup.date().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    phone: yup.string().required("Required"),
    address: yup.string().required("Required"),
    basicSalary: yup.number().required("Required"),
    houseAllowance: yup.number().required("Required"),
    transportAllowance: yup.number().required("Required"),
    otherAllowances: yup.number().required("Required"),
    deductions: yup.number().required("Required")
  });

  const initialValues = {
    employeeId: "",
    employeeName: "",
    department: "",
    designation: "",
    joiningDate: "",
    email: "",
    phone: "",
    address: "",
    basicSalary: "",
    houseAllowance: "",
    transportAllowance: "",
    otherAllowances: "",
    deductions: ""
  };

  return (<>
   <Box m="20px">
      <Header title="Add Employee to Payroll" subtitle="Enter Employee Payroll Details" />
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
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 12" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Employee ID"
                name="employeeId"
                value={values.employeeId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.employeeId && Boolean(errors.employeeId)}
                helperText={touched.employeeId && errors.employeeId}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Employee Name"
                name="employeeName"
                value={values.employeeName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.employeeName && Boolean(errors.employeeName)}
                helperText={touched.employeeName && errors.employeeName}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Department"
                name="department"
                value={values.department}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.department && Boolean(errors.department)}
                helperText={touched.department && errors.department}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Designation"
                name="designation"
                value={values.designation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.designation && Boolean(errors.designation)}
                helperText={touched.designation && errors.designation}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Joining Date"
                name="joiningDate"
                value={values.joiningDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.joiningDate && Boolean(errors.joiningDate)}
                helperText={touched.joiningDate && errors.joiningDate}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                label="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Basic Salary"
                name="basicSalary"
                value={values.basicSalary}
                onChange={(e) => {
                  handleChange(e);
                  setNetSalary(handleNetSalary({ ...values, basicSalary: e.target.value }));
                }}
                onBlur={handleBlur}
                error={touched.basicSalary && Boolean(errors.basicSalary)}
                helperText={touched.basicSalary && errors.basicSalary}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="House Allowance"
                name="houseAllowance"
                value={values.houseAllowance}
                onChange={(e) => {
                  handleChange(e);
                  setNetSalary(handleNetSalary({ ...values, houseAllowance: e.target.value }));
                }}
                onBlur={handleBlur}
                error={touched.houseAllowance && Boolean(errors.houseAllowance)}
                helperText={touched.houseAllowance && errors.houseAllowance}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Transport Allowance"
                name="transportAllowance"
                value={values.transportAllowance}
                onChange={(e) => {
                  handleChange(e);
                  setNetSalary(handleNetSalary({ ...values, transportAllowance: e.target.value }));
                }}
                onBlur={handleBlur}
                error={touched.transportAllowance && Boolean(errors.transportAllowance)}
                helperText={touched.transportAllowance && errors.transportAllowance}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Other Allowances"
                name="otherAllowances"
                value={values.otherAllowances}
                onChange={(e) => {
                  handleChange(e);
                  setNetSalary(handleNetSalary({ ...values, otherAllowances: e.target.value }));
                }}
                onBlur={handleBlur}
                error={touched.otherAllowances && Boolean(errors.otherAllowances)}
                helperText={touched.otherAllowances && errors.otherAllowances}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Deductions"
                name="deductions"
                value={values.deductions}
                onChange={(e) => {
                  handleChange(e);
                  setNetSalary(handleNetSalary({ ...values, deductions: e.target.value }));
                }}
                onBlur={handleBlur}
                error={touched.deductions && Boolean(errors.deductions)}
                helperText={touched.deductions && errors.deductions}
                sx={{ gridColumn: "span 6" }}

              />
              <TextField
                fullWidth
                variant="filled"
                label="Net Salary"
                value={netSalary}
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 6" }}

              />
            </Box>
            <Button
              type="submit"
              variant="shadowed"
              color="primary"
              sx={{ marginTop: '20px' }}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  
  </>
        
  );
};

export default EmployeeInfo;
