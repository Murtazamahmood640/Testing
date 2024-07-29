import React, { useState, useEffect } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [totalMonthlyHours, setTotalMonthlyHours] = useState("0h : 0min : 0sec");

  useEffect(() => {
    getEntries();
  }, []);

  const getEntries = async () => {
    try {
      const res = await axios.get('https://murtazamahm007-abidipro.mdbgo.io/api/timeEntries', {
        params: {
          email: localStorage.getItem('email')
        }
      });
      const events = res.data.map(entry => ({
        ...entry,
        start: new Date(entry.start),
        end: new Date(entry.end)
      }));
      setCurrentEvents(events);
      calculateMonthlyHours(events);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateMonthlyHours = (events) => {
    const now = new Date();
    const currentMonthEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    });
    const totalSeconds = currentMonthEvents.reduce((acc, event) => {
      const duration = (new Date(event.end) - new Date(event.start)) / 1000;
      return acc + duration;
    }, 0);
    setTotalMonthlyHours(formatTime(totalSeconds));
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
      <Typography variant="h5">Total Monthly Hours: {totalMonthlyHours}</Typography>
      <Box display="flex" justifyContent="space-between">
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
           
            selectable={true}
            events={currentEvents}
            />
            </Box>
            </Box>
            </Box>
            );
            };
            
            export default Calendar;