import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Paper,
  Modal,
  Grid,
} from '@mui/material';
import { tokens } from '../../theme';

const TimeoffApp = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortingOption, setSortingOption] = useState('sortby');
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/timeoff');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleAddProjectClick = () => {
    setPopupOpen(true);
    setEditingIndex(null);
  };

  const handleApprove = async (index, reason, off_date, end_date, email, name) => {
    setEditingIndex(index);
    try {
      const res = await axios.post("https://murtazamahm007-abidipro.mdbgo.io/api/timeoff/approve", {
        id: index
      });
      toast.success(res.data.message);
      window.location.reload();
      await axios.get("https://murtazamahm007-abidipro.mdbgo.io/api/timeoff/mail", {
        params: {
          id: index,
          reason: reason,
          off_date: off_date,
          end_date: end_date,
          email: email,
          name: name
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingIndex(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      Type_of_Time_Off: e.target.Type_of_Time_Off.value,
      Reason_for_Time_Off: e.target.Reason_for_Time_Off.value,
      To: e.target.To.value,
      From: e.target.From.value,
    };

    try {
      if (editingIndex !== null) {
        const updatedProject = await axios.put(`https://murtazamahm007-abidipro.mdbgo.io/api/timeoff/${projects[editingIndex]._id}`, formData);
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = updatedProject.data;
        setProjects(updatedProjects);
      } else {
        const newProject = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/timeoff', formData);
        setProjects([...projects, newProject.data]);
      }
      setPopupOpen(false);
      setEditingIndex(null);
      e.target.reset();
    } catch (error) {
      console.error('Error submitting form: ', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" mt={5}>
        <Box flex={1} p={3} bgcolor={colors.primary[400]} borderRadius={3} boxShadow={3}>
          <Typography variant="h4" gutterBottom>
            Time off Approval
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAddProjectClick}
            >
              Add
            </Button> */}
          </Box>
          <Box sx={{ height: '70vh', overflowY: 'auto' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type of Time-Off</TableCell>
                    <TableCell>Reason for Time-Off</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell>{project.Type_of_Time_Off}</TableCell>
                      <TableCell>{project.Reason_for_Time_Off}</TableCell>
                      <TableCell>{project.Name}</TableCell>
                      <TableCell>{project.To}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {project.Approved ? 'Approved' : 'X'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={project.Approved}
                          onClick={() => handleApprove(project._id, project.Reason_for_Time_Off, project.To, project.From, project.Email, project.Name)}
                          sx={{ backgroundColor: project.Approved ? '#919191' : '#1dd1a1' }}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
      <Modal open={isPopupOpen} onClose={handlePopupClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6">
              {editingIndex !== null ? 'Edit Time Off Request' : 'Add Time Off Request'}
            </Typography>
          </Box>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Type of Time Off"
                  id="Type_of_Time_Off"
                  name="Type_of_Time_Off"
                  required
                  defaultValue={editingIndex !== null ? projects[editingIndex].Type_of_Time_Off : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Time Off"
                  id="Reason_for_Time_Off"
                  name="Reason_for_Time_Off"
                  required
                  defaultValue={editingIndex !== null ? projects[editingIndex].Reason_for_Time_Off : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="From"
                  type="date"
                  id="From"
                  name="From"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? projects[editingIndex].From : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="To"
                  type="date"
                  id="To"
                  name="To"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? projects[editingIndex].To : ''}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {editingIndex !== null ? 'Save Changes' : 'Add Time Off Request'}
              </Button>
              <Button onClick={handlePopupClose} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default TimeoffApp;
