import React from 'react';
import {
  AppBar, Grid, Typography, Avatar,
} from '@mui/material';
import {
  useHistory,
} from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export function MarketPreferencesTopNavbar({ user }) {
  const history = useHistory();

  const onHandleLogout = () => {
    Meteor.logout();
    history.push('/');
  };

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
            xs={8}
            sm={8}
            md={10}
            lg={10}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 20,
                color: 'black',
              }}
            >
              { `${user.profile.preferences.name}` }
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
              src={user.profile.preferences.image}
            />
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            md={1}
            lg={1}
            justifyContent="center"
            display="flex"
          >
            <ExitToAppIcon
              fontSize="large"
              sx={{
                color: 'primary.main',

              }}
              onClick={onHandleLogout}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
