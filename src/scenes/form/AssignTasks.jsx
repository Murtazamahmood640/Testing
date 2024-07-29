import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AssignTasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingOption, setSortingOption] = useState('sortby');
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState('');
  const [selectedAssignedBy, setSelectedAssignedBy] = useState([]);
  const [createdProject, setcreatedProject] = useState([]);

  const getCreatedProjects = async () => {
    let currentUser = localStorage.getItem("name");

    try {
      const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/project/created', {
        params: {
          name: currentUser,
        }
      });
      console.log(response.data);
      setcreatedProject(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  }

  useEffect(() => {
    getCreatedProjects();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortingChange = (e) => setSortingOption(e.target.value);
  const handleAddTaskClick = () => {
    setPopupOpen(true);
    setEditingIndex(null);
    setSelectedAssignedTo('');
    setSelectedAssignedBy([]);
  };
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setPopupOpen(true);
    const task = projects[index];
    setSelectedAssignedTo(task.assignedTo);
    setSelectedAssignedBy(task.assignedBy.split(','));
  };
  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingIndex(null);
  };
  const handleAssignedToChange = (event) => setSelectedAssignedTo(event.target.value);
  const handleAssignedByChange = (event) => setSelectedAssignedBy(event.target.value);
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      projectName: e.target.projectName.value,
      taskName: e.target.taskName.value,
      assignedTo: selectedAssignedTo,
      assignedBy: selectedAssignedBy.join(', '),
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
    };
    try {
      if (editingIndex !== null) {
        const projectId = projects[editingIndex]._id;
        await axios.put(`https://murtazamahm007-abidipro.mdbgo.io/api/assign-tasks/`, formData);
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = { ...formData, _id: projectId };
        setProjects(updatedProjects);
        toast.success('Task updated successfully');
      } else {
        const response = await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/assign-tasks', formData);
        setProjects([...projects, { ...formData, _id: response.data.project._id }]);
        toast.success('Task added successfully');
      }
    } catch (error) {
      console.error('Error processing project:', error.response ? error.response.data : error.message);
      toast.error(`Error processing project: ${error.response ? error.response.data.message : 'Unknown error'}`);
    }
    setPopupOpen(false);
    setEditingIndex(null);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortingOption === 'sortby') {
      return 0;
    } else if (sortingOption === 'name') {
      return a.projectName.localeCompare(b.projectName);
    } else if (sortingOption === 'id') {
      return (a._id || a.id).localeCompare(b._id || b.id);
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter(project =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4">Assign Tasks</Typography>
              {/* <Button variant="contained" color="primary" onClick={handleAddTaskClick}>
                Assign Task
              </Button> */}
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search projects or tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort by</InputLabel>
                <Select value={sortingOption} onChange={handleSortingChange} label="Sort by">
                  <MenuItem value="sortby" disabled>Sort by</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="id">ID</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={2}>
              {createdProject.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p._id}>
                  <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
                      <Typography variant="h6">{p.projectName}</Typography>
                    {/* <Link to={``} style={{ textDecoration: 'none' }}>
                    </Link> */}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={isPopupOpen} onClose={handlePopupClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingIndex !== null ? 'Edit Task' : 'Assign Task'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Project Name"
              name="projectName"
              required
              defaultValue={editingIndex !== null ? filteredProjects[editingIndex].projectName : ''}
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Task Name"
              name="taskName"
              required
              defaultValue={editingIndex !== null ? filteredProjects[editingIndex].taskName : ''}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Assigned To</InputLabel>
              <Select value={selectedAssignedTo} onChange={handleAssignedToChange} label="Assigned To">
                <MenuItem value="najaf">Najaf Ali Tirmizi</MenuItem>
                <MenuItem value="murtaza">Murtaza Mahmood</MenuItem>
                <MenuItem value="maaz">Syed Maaz Ali</MenuItem>
                <MenuItem value="amna">Amna Ajmal</MenuItem>
                <MenuItem value="zeeshan">Zeeshan Afridi</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Assigned By</InputLabel>
              <Select multiple value={selectedAssignedBy} onChange={handleAssignedByChange} label="Assigned By">
                <MenuItem value="summiyah">Summiyah Abbasi</MenuItem>
                <MenuItem value="najaf">Najaf Ali Tirmizi</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Start Date"
                  type="date"
                  name="startDate"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].startDate : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="End Date"
                  type="date"
                  name="endDate"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].endDate : ''}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handlePopupClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editingIndex !== null ? 'Save Changes' : 'Assign Task'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssignTasks;
