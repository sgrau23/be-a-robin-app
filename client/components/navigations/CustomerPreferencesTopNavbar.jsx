import React from 'react';
import {
  AppBar, Grid, Typography, Avatar,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

export function CustomerPreferencesTopNavbar({ user }) {
  // Translations
  return (
    <AppBar
      sx={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 'auto',
        position: 'fixed',
        backgroundColor: 'secondary.main',
        display: 'flex',
        boxShadow: 0,
        height: '70px',
        padding: '8px',
      }}
      style={{ maxWidth: '100%' }}
    >
      <Toolbar disableGutters>

        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: 1, sm: 1, md: 1, lg: 1,
          }}
        >
          <Grid
            item
            xs={10}
            sm={10}
            md={11}
            lg={11}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 30,
                color: 'black',
              }}
            >
              { `${user.profile.attributes.name} ${user.profile.name}` }
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            md={1}
            lg={1}
          >
            <Avatar
              sx={{
                boxShadow: 5,
              }}
              src={(user.profile.preferences ? user.profile.preferences.image : undefined)}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
