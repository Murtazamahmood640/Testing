import React, { useState } from 'react';
import Clock from './Clock';
import Calendar from '../calendar/calendar';
import { Box, Grid } from '@mui/material';

const MainComponent = () => {
  const [newEntry, setNewEntry] = useState(null);

  const handleNewEntry = (entry) => {
    setNewEntry(entry);
  };

  return (
    <Box m="20px">
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Clock onNewEntry={handleNewEntry} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Calendar newEntry={newEntry} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainComponent;
