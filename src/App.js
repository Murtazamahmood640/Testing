import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/tables/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import BarChart from "./components/BarChart";
import CreateUser from "./scenes/form/CreateUser";
import CreateProject from "./scenes/form/CreateProject";
import EmployeeInfo from "./scenes/form/EmployeeInfo";
import SubmitTimeoff from "./scenes/form/submittimeoff";
import CreateInvoice from "./scenes/form/CreateInvoice";
import Feedback from "./scenes/form/AddFeedback";
import Doc from "./scenes/form/UploadDocument";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import PieChart from "./components/PieChart";
import FAQ from "./scenes/faq";
import Login from "./scenes/Login/login";
import Geography from "./scenes/geography";
import SubmitFeedbacks from "./scenes/tables/SubmitFeebacks";
import AllDoc from "./scenes/tables/AllDocuments";
import Salary from "./scenes/tables/EarningAndDeductions";
import ManageException from "./scenes/tables/ManageExceptions";
import MainComponent from "./scenes/tables/Main";
import Clock from "./scenes/tables/Clock";
import View from "./scenes/tables/ViewInvoice";
import ViewOne from "./scenes/tables/viewoneinvoice";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Account from "./scenes/contacts/account";
import AssignTasks from "./scenes/form/AssignTasks";
import ProjectTaskPage from "./scenes/form/ProjectTaskPage";
import TaskStatus from "./scenes/tables/TaskStatus";
import MyTasks from "./scenes/tables/MyTasks";
import TimeoffApp from "./scenes/tables/TimeOffApp";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  
  const isLoginPage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/createuser" element={<CreateUser />} />
              <Route path="/createproject" element={<CreateProject />} />
              <Route path="/employeeinfo" element={<EmployeeInfo />} />
              <Route path="/createinvoice" element={<CreateInvoice />} />
              <Route path="/uploaddocument" element={<Doc />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/timeoffreq" element={<SubmitTimeoff />} />
              <Route path="/submitfeedbacks" element={<SubmitFeedbacks />} />
              <Route path="/alldocuments" element={<AllDoc />} />
              <Route path="/earninganddeductions" element={<Salary />} />
              <Route path="/holidays" element={<ManageException />} />
              <Route path="/clock" element={<Clock />} />
              <Route path="/view" element={<View />} />
              <Route path="/viewInvoice/:id" element={<ViewOne />} />
              <Route path="/assigntasks" element={<AssignTasks />} />
              <Route path="/taskstatus" element={<TaskStatus />} />
              <Route path="/mytasks" element={<MyTasks />} />
              {/* <Route path="project/:projectName" element={<ProjectTaskPage />} /> */}
              <Route path="/account" element={<Account />} />
              <Route path="/main" element={<MainComponent />} />
              <Route path="/timeoffapp" element={<TimeoffApp />} />
              <Route path="/barchart" element={<BarChart />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/piechart" element={<PieChart />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
