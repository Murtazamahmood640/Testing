import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const TimeoffReq = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [managers, setManagers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [managerEmail, setManagersEmail] = useState();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
 
  const getManagerEmail = async (userEmail, setManagersEmail) => {
    try {
const userResponse = await axios.get(`https://murtazamahm007-abidipro.mdbgo.io/api/users/findByEmail`, { params: { email: userEmail } });
      const userData = userResponse.data.reportTo;
const managerResponse = await axios.get(`https://murtazamahm007-abidipro.mdbgo.io/api/users/userName`, { params: { userName: userData } });
      const managerData = managerResponse.data;
setManagersEmail(managerData.email);
    } catch (error) {
      console.error('Error fetching manager email:', error);
      toast.error('Failed to detect Manager');
    }
  };
 
  const notifyManagerOfTimeOffRequest = async (requestData) => {
    const { managerEmail, employeeName, startDate, endDate, reason } = requestData;
    try {
const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/timeoff/notify-manager', {
        params: { managerEmail, employeeName, startDate, endDate, reason }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };
 
  useEffect(() => {
    const email = localStorage.getItem('email');
    const fetchData = async () => {
      try {
const { data } = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/timeoff', { params: { email } });
        setProjects(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
    getManagerEmail(email, setManagersEmail);
  }, []);
 
  const handleFormSubmit = async (values) => {
    const formData = {
      Type_of_Time_Off: values.typeOfTimeOff,
      Reason_for_Time_Off: values.reasonForTimeOff,
      To: values.to,
      From: values.from,
      Email: localStorage.getItem("email"),
      Name: localStorage.getItem("name"),
    };

    try {
      await notifyManagerOfTimeOffRequest({
        managerEmail,
        employeeName: formData.Name,
        startDate: formData.From,
        endDate: formData.To,
        reason: formData.Reason_for_Time_Off,
      });

      if (editingIndex !== null) {
        const updatedProject = await axios.put(`https://murtazamahm007-abidipro.mdbgo.io/api/timeoff/${projects[editingIndex]._id}`, formData);
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = updatedProject.data;
        setProjects(updatedProjects);
        toast.success('Time Off Request updated successfully');
      } else {
        const newProject = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/timeoff', formData);
        setProjects([...projects, newProject.data]);
        toast.success('Time Off Request created successfully');
      }
      setPopupOpen(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error submitting form: ', error);
      toast.error('Failed to submit Time Off Request');
    }
  };

  return (
    <Box m="20px">
      <Header title="TIME OFF REQUEST" subtitle="Request Time Off" />
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
                label="Type of Time Off"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.typeOfTimeOff}
                name="typeOfTimeOff"
                error={!!touched.typeOfTimeOff && !!errors.typeOfTimeOff}
                helperText={touched.typeOfTimeOff && errors.typeOfTimeOff}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Reason for Time Off"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.reasonForTimeOff}
                name="reasonForTimeOff"
                error={!!touched.reasonForTimeOff && !!errors.reasonForTimeOff}
                helperText={touched.reasonForTimeOff && errors.reasonForTimeOff}
                sx={{ gridColumn: "span 6" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="From"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.from}
                name="from"
                error={!!touched.from && !!errors.from}
                helperText={touched.from && errors.from}
                sx={{ gridColumn: "span 6" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="To"
                onBlur={handleBlur}
                onChange={handleChange}
value={values.to}
                name="to"
error={!!touched.to && !!errors.to}
helperText={touched.to && errors.to}
                sx={{ gridColumn: "span 6" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                {editingIndex !== null ? 'Save Changes' : 'Submit Request'}
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
  typeOfTimeOff: yup.string().required("required"),
  reasonForTimeOff: yup.string().required("required"),
from: yup.date().required("required"),
to: yup.date().required("required"),
});
 
const initialValues = {
  typeOfTimeOff: "",
  reasonForTimeOff: "",
  from: "",
  to: "",
};
 
export default TimeoffReq;