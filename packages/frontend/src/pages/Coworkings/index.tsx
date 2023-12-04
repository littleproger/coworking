import React, { useState, useEffect, useCallback } from 'react';
import { Grid, TextField, Drawer, Box, Typography, FormGroup, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { feathersClient } from '../../feathersClient';
import * as redux from '../../redux';
import PlaceCard from '../../components/PlaceCard';
import { useQuery } from '../../customHooks/useQuery';
import { useAppSelector } from '../../redux/hooks';
import { Benefits, Coworking } from '@coworking/common/dist/services/coworking';
import './coworkings.css';

const filtersRaw: Benefits[] = [
  'wi-fi', 'fast-wi-fi', 'ownRooms', 'foods', 'stableElectric', 'starlink', 'generators',
  'projectors', 'freeWater', 'roomsForMeetings', 'comfortablePlaces', 'vipRoms',
];

const getLabelByFilterType = (type:Benefits) => {
  switch (type){
    case 'wi-fi':
      return 'Wi-Fi';
    case 'fast-wi-fi':
      return 'Fast Wi-Fi';
    case 'ownRooms':
      return 'Own Rooms';
    case 'foods':
      return 'Foods';
    case 'stableElectric':
      return 'Stable Electricity';
    case 'starlink':
      return 'Starlink';
    case 'generators':
      return 'Generators';
    case 'projectors':
      return 'Projectors';
    case 'freeWater':
      return 'Free Water';
    case 'roomsForMeetings':
      return 'Meeting rooms';
    case 'comfortablePlaces':
      return 'Comfortable Places';
    case 'vipRoms':
      return 'VIP rooms';
  }
}

export const Coworkings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Partial<Record<Benefits, boolean>>>({});

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFilters({ ...filters, [event.target.name]: checked });
  };

  const user = useAppSelector(redux.storeParts.user.getData);

  const getCoworkings = useCallback(async ()=> {
    const selectedBenefits = Object.entries(filters)
      .filter(([key, val]) => val)
      .map(([key]) => key);

    if (selectedBenefits.length === 0 && !searchTerm.trim()) {

      const res = await feathersClient.service('coworkings').find(); 
      return res.data;
    }
  
    const response = await feathersClient.service('coworkings').find({
      query:{
        $and:[
          { benefits: {
            $in: selectedBenefits,
          } },
          ...(searchTerm ? [
            { $or:[
              { title: { $regex: searchTerm, $options: 'i' } },
              { location: { $regex: searchTerm, $options: 'i' } },
            ] },
          ] : []),
        ],
      },
    });

    if (!response.data) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  }, [user?._id, filters, searchTerm]);

  const { data, error, isLoading, refetch } = useQuery<Coworking>(getCoworkings);

  // Debounce function for handling search input
  const handleSearch = debounce((value:string) => {
    setSearchTerm(value);
    // Implement search functionality here
  }, 500);

  return (
    <Box sx={{ display: 'flex', marginTop: '112px' }}>
      {/* Filter Section */}
      <Drawer
        variant="permanent"
        sx={{ width: 240, flexShrink: 0,
          ['& .MuiDrawer-paper']: { width: 240, height: 'calc(100% - 321px)', marginTop: '112px', paddingLeft:'30px', boxSizing: 'border-box' } }}
      >
        <Typography variant="h6" sx={{ my: 2 }}>
          Filters
        </Typography>
        {/* Add your filters here */}
        <FormGroup sx={{ paddingLeft:'10px' }}>
          {filtersRaw.map(filter=>(
            <FormControlLabel
              className='filter-label'
              control={<Checkbox checked={filters[filter]} onChange={handleFilterChange} name={filter} />}
              label={getLabelByFilterType(filter)}
              style={{ marginRight: 0 }}
            />
          ))}
        </FormGroup>
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
        <Box style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }} id="main-section" className="landing-page-main" justifyContent="center" alignItems='center'>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={1}>
              {(data || []).map(coworking => (
                <Grid item xs={12} md={6} lg={6} xl={3} key={coworking._id} display="flex" justifyContent="center" alignItems="center">
                  <PlaceCard
                    {...coworking}
                    city={coworking.location}
                    image={coworking.mainImage}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};
