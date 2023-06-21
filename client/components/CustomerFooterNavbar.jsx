import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid, Badge,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import {
  Link,
} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ShoppingCartCollection } from '../../imports/db/collections';

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
  const [totalProductsCart, setTotalProductsCart] = useState(0);
  // Translations
  const t = useTranslation();
  useTracker(() => {
    const handler = Meteor.subscribe('shoppingCart', Meteor.user()._id);
    if (!handler.ready()) setTotalProductsCart(0);
    else setTotalProductsCart(ShoppingCartCollection.find().fetch().length);
  }, []);
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
          <Grid item xs={2} sm={2} md={2} lg={2}>
            <Link to="/shoppingCart">
              <Badge badgeContent={totalProductsCart} color="error">
                <ShoppingCartIcon fontSize="large" color="secondary" />
              </Badge>
            </Link>
          </Grid>
          {/* <Grid item xs={2} sm={2} md={2} lg={2}>
            <Link to="/">
              <HomeIcon fontSize="large" color="secondary" />
            </Link>
          </Grid> */}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
