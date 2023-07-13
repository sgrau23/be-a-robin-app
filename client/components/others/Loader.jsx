import React from 'react';
import {
  Box, LinearProgress,
} from '@mui/material';

export function Loader() {
  return (
    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e6e6e6' }}>
      <LinearProgress />
      <Box
        component="img"
        src="logo_title.png"
        sx={{
          flexGrow: 0,
          marginTop: '30%',
          height: '50%',
          width: '100%',
          // borderRadius: 40,
          // backgroundColor: '#e6e6e6',
          // boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)',
        }}
      />
    </Box>

  );
}
