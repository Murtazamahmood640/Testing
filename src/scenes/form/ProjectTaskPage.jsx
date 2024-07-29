import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, TextField, Button, FormControl, TextareaAutosize } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";


const ProjectTaskPage = () => {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [taskName, setTaskName] = useState("");
  const [sortingOption, setSortingOption] = useState("sortby");
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAssignedBy, setSelectedAssignedBy] = useState([]);
  const [taskDesc, setTaskDesc] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const allUsers = await axios.get("https://murtazamahm007-abidipro.mdbgo.io/api/users/names");
        setUsers(allUsers.data);
      } catch (e) {
        console.log(e);
      }
    };

    getAllUsers();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "lightgrey" : "white",
      "&:hover": {
        backgroundColor: "lightgray",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
  };

  const handleTaskDescChange = (event) => {
    const { value } = event.target;
    setTaskDesc(value);
  };

  const handleTaskNameChange = (event) => {
    const { value } = event.target;
    setTaskName(value);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSortingChange = (e) => setSortingOption(e.target.value);

  const handleAddTaskClick = () => {
    setPopupOpen(true);
    setEditingIndex(null);
    setSelectedAssignedTo(null);
    setSelectedAssignedBy([]);
  };

  const handleStartDateChange = (event) => {
    const { value } = event.target;
    setStartDate(value);
  };

  const handleEndDateChange = (event) => {
    const { value } = event.target;
    setEndDate(value);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setPopupOpen(true);
    const task = projects[index];
    setSelectedAssignedTo({ value: task.assignedTo, label: task.assignedTo });
    setSelectedAssignedBy(task.assignedBy.split(",").map((name) => ({ value: name, label: name })));
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingIndex(null);
  };

  const handleAssignedToChange = (selectedOption) => setSelectedAssignedTo(selectedOption);

  const handleAssignedByChange = (selectedOptions) => setSelectedAssignedBy(selectedOptions);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      projectName,
      taskName,
      assignedTo: selectedAssignedTo ? selectedAssignedTo.value : "",
      assignedBy: selectedAssignedBy ? selectedAssignedBy.map((opt) => opt.value).join(", ") : "",
      startDate,
      endDate,
      textDescription: taskDesc,
    };

    try {
      if (editingIndex !== null) {
        const projectId = projects[editingIndex]._id;
        await axios.put(`https://murtazamahm007-abidipro.mdbgo.io/api/assign-tasks/`, formData);
        const updatedProjects = [...projects];
        updatedProjects[editingIndex] = { ...formData, _id: projectId };
        setProjects(updatedProjects);
        toast.success("Task updated successfully");
      } else {
        const response = await axios.post("https://murtazamahm007-abidipro.mdbgo.io/api/assign-tasks", formData);
        setProjects([...projects, { ...formData, _id: response.data.project._id }]);
        toast.success("Task added successfully");
      }
    } catch (error) {
      console.error("Error processing project:", error.response ? error.response.data : error.message);
      toast.error(`Error processing project: ${error.response ? error.response.data.message : "Unknown error"}`);
    }

    setPopupOpen(false);
    setEditingIndex(null);
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortingOption === "sortby") {
      return 0;
    } else if (sortingOption === "name") {
      return a.projectName.localeCompare(b.projectName);
    } else if (sortingOption === "id") {
      return (a._id || a.id).localeCompare(b._id || b.id);
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveAssignTask = async () => {
    const formData = {
      projectName,
      taskName,
      assignedTo: selectedAssignedTo.label,
      assignedBy: selectedAssignedBy.label,
      startDate,
      endDate,
      textDescription: taskDesc,
    };
    try {
      await axios.post("https://murtazamahm007-abidipro.mdbgo.io/api/create-tasks", formData);
      alert("Task Assigned Successfully");
      await axios.get("https://murtazamahm007-abidipro.mdbgo.io/api/task/mail", {
        params: {
          personalEmail: localStorage.getItem("email"),
          textDescription: formData.textDescription,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedBy: formData.assignedBy,
          projectName: formData.projectName,
        },
      }).then(() => console.log("email sent!"));
    } catch (err) {
      alert("Something went wrong", err);
    }
  };

  return (
    <Box className="home-page">
      <Box className="content-container" display="flex">
        <Container className="main-content">
          <Typography variant="h1" align="center" style={{ textTransform: "capitalize", color: "#978d03", fontSize: "40px" }}>
            {projectName}
          </Typography>
          <Typography variant="h3">Assign Task to Team</Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Task Name"
                    id="taskName"
                    name="taskName"
                    value={taskName}
                    onChange={handleTaskNameChange}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    value={selectedAssignedTo}
                    onChange={handleAssignedToChange}
                    options={users.map((user) => ({ value: user, label: user }))}
                    placeholder="Select User"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    value={selectedAssignedBy}
                    onChange={handleAssignedByChange}
                    options={users.map((user) => ({ value: user, label: user }))}
                    isMulti
                    styles={customStyles}
                    placeholder="Select User(s)"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextareaAutosize
                    minRows={5}
                    placeholder="Task Description"
                    id="taskDesc"
                    name="taskDesc"
                    value={taskDesc}
                    onChange={handleTaskDescChange}
                    required
                    style={{ width: "100%" }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="Start Date"
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    label="End Date"
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" type="submit">
                  {editingIndex !== null ? "Save Changes" : "Assign Task"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ProjectTaskPage;
