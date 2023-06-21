import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Badge, Typography, Menu, Button, Grid,
} from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
  Link, useHistory,
} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';

// const StyledFooter = styled.div`
//   width: 100%;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   text-align: center;
//   ${(p) => (p.bgcolor && `background: ${p.bgcolor} !important`)};
//   ${(p) => (p.color && `color: ${p.color} !important`)};
// `;

export function MarketFooterNavbar() {
  // Translations
  return (
    <AppBar
      sx={{
        bottom: 0,
        right: 0,
        left: 0,
        top: 'auto',
        position: 'fixed',
        backgroundColor: 'primary.main',
        display: 'flex',
      }}
      style={{ maxWidth: '100%' }}
    >
      <Toolbar
        disableGutters
        variant="dense"
      >
        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: 1, sm: 1, md: 1, lg: 1,
          }}
          justifyContent="center"
          // sx={{
          //   marginRight: '10px',
          // }}
        >
          <Grid item xs={2} sm={2} md={2} lg={2} sx={{ marginLeft: 5 }}>
            <Link to="/">
              <HomeIcon fontSize="large" color="secondary" />
            </Link>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <Link to="/offers">
              <LocalGroceryStoreIcon fontSize="large" color="secondary" />
            </Link>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <Link to="/lastminute">
              <AddAlertIcon fontSize="large" color="secondary" />
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
