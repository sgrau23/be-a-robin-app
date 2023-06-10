import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import {
  Link,
} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

// const StyledFooter = styled.div`
//   width: 100%;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   text-align: center;
//   ${(p) => (p.bgcolor && `background: ${p.bgcolor} !important`)};
//   ${(p) => (p.color && `color: ${p.color} !important`)};
// `;

export function CustomerFooterNavbar() {
  // Translations
  const t = useTranslation();
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
      <Toolbar disableGutters>
        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: 1, sm: 1, md: 1, lg: 1,
          }}
          justifyContent="center"
        >
          <Grid item xs={2} sm={2} md={2} lg={2} sx={{ marginLeft: 5 }}>
            <Link to="/">
              <HomeIcon fontSize="large" color="secondary" />
            </Link>
          </Grid>
          {/* <Grid item xs={2} sm={2} md={2} lg={2}>
            <Link to="/">
              <HomeIcon fontSize="large" color="secondary" />
            </Link>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <Link to="/">
              <HomeIcon fontSize="large" color="secondary" />
            </Link>
          </Grid> */}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
