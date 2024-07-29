import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AddTaskIcon from '@mui/icons-material/AddTask';
import PaymentIcon from '@mui/icons-material/Payment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TextsmsIcon from '@mui/icons-material/Textsms';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);
  const [selected, setSelected] = useState("Dashboard");

  useEffect(() => {
    setIsSidebarVisible(!isMobile);
  }, [isMobile]);

  return  (
    <Box display="flex" height="100vh">
      {isMobile && (
        <IconButton
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            color: colors.grey[100],
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
      )}

      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
          display: isSidebarVisible ? "flex" : "none",
          flexDirection: "column",
          overflowY: "auto",
          height: "100vh",
          zIndex: 1200,
          position: isMobile ? "fixed" : "relative",
          width: isCollapsed ? "80px" : "300px", // Adjust width for PC
          transition: "width 0.3s", // Smooth transition when collapsing
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {!isMobile && (
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  color: colors.grey[100],
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography variant="h3" color={colors.grey[100]}>
                      ABIDI PRO
                    </Typography>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
            )}

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`../../assets/profile.jpg`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Murtaza Mahmood
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    Software Developer
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Time And Attendance
              </Typography>
              <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="ClockIn / Clockout"
                to="/clock"
                icon={<AccessAlarmsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Holidays"
                to="/holidays"
                icon={<HolidayVillageIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Timeoff Requests"
                to="/timeoffreq"
                icon={<AccessTimeIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Timeoff Approval"
                to="/timeoffapp"
                icon={<AccessTimeIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Projects
              </Typography>

              <Item
                title="Create Project"
                to="/createproject"
                icon={<AddTaskIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Assign Tasks "
                to="/assigntasks"
                icon={<AssignmentIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Task Status "
                to="/taskstatus"
                icon={<TaskIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="My Tasks "
                to="/mytasks"
                icon={<TaskIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Payroll and Invoices
              </Typography>
              <Item
                title="Create Invoice"
                to="/createinvoice"
                icon={<ReceiptLongIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="View Invoices"
                to="/view"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Payroll Info"
                to="/employeeinfo"
                icon={<PaymentIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Salary Calculation"
                to="/earninganddeductions"
                icon={<PaymentsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Employee Data
              </Typography>

              <Item
                title="Contacts Information"
                to="/contacts"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Create User"
                to="/createuser"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Manage Team"
                to="/team"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Upload Document"
                to="/uploaddocument"
                icon={<NoteAddIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="View Documents"
                to="/alldocuments"
                icon={<DocumentScannerIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Feedbacks"
                to="/feedback"
                icon={<FeedbackIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Messages
              </Typography>
              <Item
                title="Chat "
                to="/chat"
                icon={<TextsmsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
      <Box
        // sx={{
        //   flexGrow: 1,
        //   ml: isSidebarVisible && !isMobile ? (isCollapsed ? "80px" : "100px") : "0",
        //   transition: "margin-left 0.3s",
        //   height: "100vh",
        //   overflow: "auto",
        //   padding: "20px",
        // }}
      >
        {/* Main content goes here */}
      </Box>
    </Box>
  );
};

export default Sidebar;
