import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const stripePromise = loadStripe('pk_test_51POLSORr2k4AYrtAOOYjO2SMtsENDlIASpZwrlpt5IpH8NLcO4BVpHBhzLlva2AUDQdP3Mp5z7Uc69yvHALJPlOz00HsM3RWZX'); // Replace with your Stripe publishable key

const EarningAndDeductions = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingOption, setSortingOption] = useState('sortby');
  const [projects, setProjects] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employees = await axios.get("https://murtazamahm007-abidipro.mdbgo.io/api/EmployeesPayroll");
      setProjects(employees.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClick = async (netSalary, empName) => {
    const stripe = await stripePromise;

    try {
      const response = await axios.post('https://a-khuhro-abidi_pro.mdbgo.io/create-checkout-session', {
        amount: netSalary,
        name: empName
      });

      const { id: sessionId } = response.data;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe Checkout error:', error);
      }
    } catch (error) {
      console.error('Backend error:', error);
    }
  };

  const handleSortingChange = (e) => {
    setSortingOption(e.target.value);
  };

  const handleAddTaskClick = () => {
    setPopupOpen(true);
    setEditingIndex(null);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setEditingIndex(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      totalearning: e.target.totalearning.value,
      leavedeductions: e.target.leavedeductions.value,
      noofleaves: e.target.noofleaves.value,
      reportingmanager: e.target.reportingmanager.value,
    };

    if (editingIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = formData;
      setProjects(updatedProjects);
    } else {
      setProjects([...projects, formData]);
    }

    setPopupOpen(false);
    setEditingIndex(null);
    e.target.reset();
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortingOption === 'sortby') {
      return 0;
    } else if (sortingOption === 'name') {
      return a.employeeName.localeCompare(b.employeeName);
    } else if (sortingOption === 'id') {
      return a._id - b._id;
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) =>
    project.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: "employeeId", headerName: "Employee ID", width: 150 },
    { field: "employeeName", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "basicSalary", headerName: "Basic Salary", width: 150 },
    { field: "deductions", headerName: "Deductions", width: 150 },
    { field: "designation", headerName: "Designation", width: 150 },
    { field: "netSalary", headerName: "Total Salary", width: 150 },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 200,
    //   renderCell: (params) => (
    //     <div>
    //       <button role="link" style={{ backgroundColor: "#84EC6A", color: "#000000B4", fontWeight: 900 }} onClick={() => handleClick(params.row.netSalary, params.row.employeeName)}>Pay</button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <Box m="20px">
      <Header title="Earning And Deductions" subtitle="Managing Employee Payroll" />
      <Box m="40px 0 0 0" height="75vh" sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: theme.palette.success.main,
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: theme.palette.primary.light,
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: theme.palette.background.default,
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: theme.palette.primary.light,
        },
        "& .MuiCheckbox-root": {
          color: `${theme.palette.success.main} !important`,
        },
      }}>
        <DataGrid
          rows={filteredProjects}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableMultipleRowSelection={true}
        />
      </Box>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>{editingIndex !== null ? 'Edit Earning And Deductions' : 'Earning And Deductions'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="Name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].employeeName : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="totalearning">Total Earning:</label>
                <input
                  type="text"
                  id="totalearning"
                  name="totalearning"
                  required
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].totalearning : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="leavedeductions">Leave Deductions:</label>
                <input
                  type="text"
                  id="leavedeductions"
                  name="leavedeductions"
                  required
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].leavedeductions : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="noofleaves">No Of Leaves:</label>
                <input
                  type="text"
                  id="noofleaves"
                  name="noofleaves"
                  required
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].noofleaves : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reportingmanager">Reporting Manager:</label>
                <input
                  type="text"
                  id="reportingmanager"
                  name="reportingmanager"
                  required
                  defaultValue={editingIndex !== null ? filteredProjects[editingIndex].reportingmanager : ''}
                />
              </div>
              <button type="submit">
                {editingIndex !== null ? 'Save Changes' : 'Submit'}
              </button>
              <button onClick={handlePopupClose} className='close-but'>Cancel</button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </Box>
  );
};

export default EarningAndDeductions;
