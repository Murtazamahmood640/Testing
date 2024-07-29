import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const { data } = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/getUser');
        const userNames = data.map(user => user.name); // Extract only names
        setUsers(userNames);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getAllUsers();
  }, []);

  const handleFormSubmit = async (values) => {
    const formData = {
      projectName: values.projectName,
      lead: selectedLead,
      assignedMembers: selectedMembers,
      startDate: values.startDate,
      endDate: values.endDate,
    };

    try {
      if (values._id) {
        await axios.put(`https://murtazamahm007-abidipro.mdbgo.io/api/projects/${values._id}`, formData);
        toast.success('Project updated successfully');
      } else {
        await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/projects', formData);
        toast.success('Project added successfully');
      }
    } catch (error) {
      console.error('Error processing project:', error);
      toast.error('Error processing project');
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE PROJECT" subtitle="Add or Edit Project" />
      <Formik
        initialValues={{
          projectName: "",
          startDate: "",
          endDate: "",
          _id: "", // for editing existing projects
        }}
        validationSchema={yup.object().shape({
          projectName: yup.string().required("Project Name is required"),
          startDate: yup.date().required("Start Date is required"),
          endDate: yup.date().required("End Date is required"),
        })}
        onSubmit={handleFormSubmit}
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
                label="Project Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.projectName}
                name="projectName"
                error={!!touched.projectName && !!errors.projectName}
                helperText={touched.projectName && errors.projectName}
                sx={{ gridColumn: "span 6" }}
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }}>
                <InputLabel>Lead</InputLabel>
                <Select
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                  onBlur={handleBlur}
                  label="Lead"
                >
                  {users.map(user => (
                    <MenuItem key={user} value={user}>{user}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 6" }}>
                <InputLabel>Assigned Members</InputLabel>
                <Select
                  multiple
                  value={selectedMembers}
                  onChange={(e) => setSelectedMembers(e.target.value)}
                  renderValue={(selected) => selected.join(', ')}
                  onBlur={handleBlur}
                  label="Assigned Members"
                >
                  {users.map(user => (
                    <MenuItem key={user} value={user}>{user}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Start Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.startDate}
                name="startDate"
                error={!!touched.startDate && !!errors.startDate}
                helperText={touched.startDate && errors.startDate}
                sx={{ gridColumn: "span 6" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="End Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endDate}
                name="endDate"
                error={!!touched.endDate && !!errors.endDate}
                helperText={touched.endDate && errors.endDate}
                sx={{ gridColumn: "span 6" }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                {values._id ? 'Save Changes' : 'Add Project'}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

const validationSchema = yup.object().shape({
  projectName: yup.string().required("Project Name is required"),
  startDate: yup.date().required("Start Date is required"),
  endDate: yup.date().required("End Date is required"),
});

export default CreateProject;
