import React, { useState, useEffect } from 'react';
import { Grid, TextField, Drawer, Box, Typography } from '@mui/material';
import { debounce } from 'lodash';

const MyComponent = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce function for handling search input
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    // Implement search functionality here
  }, 500);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Filter Section */}
      <Drawer
        variant="permanent"
        sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}
      >
        <Typography variant="h6" sx={{ my: 2 }}>
          Filters
        </Typography>
        {/* Add your filters here */}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
        <div id="main-section" className="landing-page-main">
          <h1>
            <span>Most famous coworkings</span>
            <br />
          </h1>
          <span className="landing-page-text20">Recommended</span>
          <Grid container spacing={2} className="landing-page-cards-container">
            {data?.map(coworking => (
              <Grid item xs={12} sm={6} md={4} key={coworking._id}>
                <PlaceCard
                  {...coworking}
                  city={coworking.location}
                  image={coworking.mainImage}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default MyComponent;
