import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import Image from '../../../images/time.png';

import axios from 'axios';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { print } from 'react-html2pdf'; // Ensure correct import
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClockIn_out = () => {
  let interval;
  const tableRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInButtonText, setCheckInButtonText] = useState("Checkin");
  const [timeEntries, setTimeEntries] = useState([]);
  const [ispause, setIspause] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIspause(false);
      interval = setInterval(() => {
        setTime(time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    getEntries();

    return () => clearInterval(interval);
  }, [isActive, time]);

  const handlePause = () => {
    setIspause(!ispause);
    setIsActive(!isActive);
  };

  const handleCheckin = () => {
    const now = new Date();
    if (!isActive) {
      setCheckInTime(now);
      setIsActive(true);
      setCheckInButtonText("CLOCK OUT");
    } else {
      setIsActive(false);
      setCheckInButtonText("CHECK IN");
      let newEntry = {
        date: now.toLocaleDateString(),
        day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: checkInTime.toLocaleTimeString(),
        checkOut: now.toLocaleTimeString(),
        totalTime: formattedTime,
        email: localStorage.getItem('email')
      };
      axios.post("https://a-khuhro-abidi_pro.mdbgo.io/api/timeEntries", newEntry)
        .then((res) => { console.log(res); window.location.reload(); })
        .catch((err) => { console.log(err); toast.info(err.response.data.error); });
    }
  };

  const getTotalTime = (startTime, endTime) => {
    const diffInSeconds = Math.floor((endTime - startTime) / 1000);
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  const getEntries = async () => {
    try {
      let res = await axios.get('https://a-khuhro-abidi_pro.mdbgo.io/api/timeEntries', {
        params: { email: localStorage.getItem('email') }
      });
      setTimeEntries(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const formattedTime = new Date(time * 1000).toISOString().substr(11, 8);
  const formattedTodayTime = new Date().toLocaleTimeString();

  return (
    <Container>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Clock In and Clock Out
          </Typography>
          <Box sx={{ backgroundColor: '', p: 2, borderRadius: 2, boxShadow: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Your Time</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>{formattedTime}</Typography>
              <Typography variant="body1">
                Clocked In: Today At {isActive ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
              </Typography>
              <Button
                variant="contained"
                color={ispause ? 'secondary' : 'primary'}
                onClick={handleCheckin}
                disabled={ispause}
                sx={{ mt: 2 }}
              >
                {checkInButtonText}
              </Button>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {ispause ? 'Un-pause in order to Checkout' : ''}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Today's time: {formattedTodayTime}
              </Typography>
             
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color={ispause ? 'primary' : 'secondary'}
                  onClick={handlePause}
                >
                  {ispause ? 'Start' : 'Pause'}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => print({ html: document.getElementById('tableSheet') })}
                  sx={{ ml: 1 }}
                >
                  Your Timesheet
                </Button>
                <DownloadTableExcel
                  filename={`Attendence: ${localStorage.getItem("email")}`}
                  sheet="users"
                  currentTableRef={tableRef.current}
                >
                  <Button variant="contained" color="success" sx={{ ml: 1 }}>
                    Export Excel
                  </Button>
                </DownloadTableExcel>
              </Box>
            </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5">Time Sheet</Typography>
              <Typography variant="body1">The Time Sheet of your given hours is shown here</Typography>
            </Box>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table ref={tableRef}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Total Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell>{entry.checkIn}</TableCell>
                      <TableCell>{entry.checkOut}</TableCell>
                      <TableCell>{entry.totalTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
           
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ClockIn_out;
