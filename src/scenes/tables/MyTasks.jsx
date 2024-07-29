import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme, TextField, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { tokens } from "../../theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Header";

const MyTasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [reFetch, setReFetch] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [reFetch]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/my-tasks', {
        params: { name: localStorage.getItem("name") },
      });
      setProjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setPopupOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`https://murtazamahm007-abidipro.mdbgo.io/api/deleteTask`, { params: { _id: id } });
      setReFetch(!reFetch);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingProject(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      taskAssinge: e.target.taskassinge.value,
      completionTime: e.target.completiontime.value,
      date: e.target.date.value,
      taskpriority: e.target.taskpriority.value,
    };

    try {
      if (editingProject) {
        await axios.put(`https://murtazamahm007-abidipro.mdbgo.io/api/assigned-tasks/${editingProject._id}`, formData);
        toast.success("Task updated successfully");
      } else {
        await axios.post('https://murtazamahm007-abidipro.mdbgo.io/api/assigned-tasks', formData);
        toast.success("Task created successfully");
      }
      fetchTasks();
      handlePopupClose();
    } catch (error) {
      toast.error("Failed to save the task");
    }
  };

  const handleDropdownChange = async (event, id) => {
    try {
      await axios.put("https://murtazamahm007-abidipro.mdbgo.io/api/updateStatus", {
        id: id,
        taskStatus: event.target.value,
      });
      setReFetch(!reFetch);
    } catch (e) {
      console.error("Failed to update", e);
    }
  };

  const columns = [
    { field: "projectName", headerName: "Project Name", flex: 1 },
    { field: "taskName", headerName: "Task Name", flex: 1 },
    { field: "textDescription", headerName: "Task Description", flex: 2 },
    { field: "assignedTo", headerName: "Assigned To", flex: 1 },
    { field: "assignedBy", headerName: "Assigned By", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1, renderCell: (params) => params.value.slice(0, 10) },
    { field: "endDate", headerName: "End Date", flex: 1, renderCell: (params) => params.value.slice(0, 10) },
    {
      field: "taskStatus",
      headerName: "Set Status",
      flex: 1,
      renderCell: (params) => (
        params.value === "Completed" ? (
          <Typography variant="body1">Completed</Typography>
        ) : (
          <Select
            value={params.value}
            onChange={(e) => handleDropdownChange(e, params.row._id)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Review">To Review</MenuItem>
          </Select>
        )
      ),
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Box>
    //       <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>Edit</Button>
    //       <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row._id)}>Delete</Button>
    //     </Box>
    //   ),
    // },
  ];

  return (
    <Box m="20px">
      <Header title="MY TASKS" subtitle="Manage Your Tasks" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={projects}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
        />
      </Box>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>{editingProject ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Project Name:</label>
                <TextField
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editingProject ? editingProject.name : ''}
                  fullWidth
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskassinge">Task Name:</label>
                <TextField
                  type="text"
                  id="taskassinge"
                  name="taskassinge"
                  required
                  defaultValue={editingProject ? editingProject.taskAssinge : ''}
                  fullWidth
                />
              </div>
              <div className="form-group">
                <label htmlFor="completiontime">Completion Time:</label>
                <TextField
                  type="text"
                  id="completiontime"
                  name="completiontime"
                  required
                  defaultValue={editingProject ? editingProject.completionTime : ''}
                  fullWidth
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <TextField
                  type="date"
                  id="date"
                  name="date"
                  required
                  defaultValue={editingProject ? editingProject.date : ''}
                  fullWidth
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskpriority">Task Priority:</label>
                <TextField
                  type="text"
                  id="taskpriority"
                  name="taskpriority"
                  required
                  defaultValue={editingProject ? editingProject.taskpriority : ''}
                  fullWidth
                />
              </div>
              <Button type="submit" variant="contained" color="primary">
                {editingProject ? 'Save Changes' : 'Submit'}
              </Button>
              <Button onClick={handlePopupClose} type="button" variant="contained" color="secondary">
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </Box>
  );
};

export default MyTasks;
