import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid, Badge,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import { ShoppingCartCollection } from '../../../imports/db/collections';
import { FooterNavIcon } from '../icons/FooterNavIcon';

export function CustomerFooterNavbar() {
  const [totalProductsCart, setTotalProductsCart] = useState(0);
  // Translations
  const { t } = useTranslation();
  useTracker(() => {
    const handler = Meteor.subscribe('shoppingCart', Meteor.user()._id);
    if (!handler.ready()) setTotalProductsCart(0);
    else setTotalProductsCart(ShoppingCartCollection.find({ $or: [{ 'product.disabled': false }, { 'product.disabled': { $exists: false } }] }).fetch().length);
  }, []);

  const navIcons = [
    <FooterNavIcon
      iconComponent={<HomeIcon fontSize="medium" color="secondary" />}
      route="/"
      text="Inicio"
      key="inicio"
    />,
    <FooterNavIcon
      iconComponent={<ReceiptIcon fontSize="medium" color="secondary" />}
      route="/purchaseOptimizer"
      text="Propuesta"
      key="propuesta"
    />,
    <FooterNavIcon
      iconComponent={(
        <ShoppingBasketIcon fontSize="medium" color="secondary" />
      )}
      route="/shoppingList"
      text="Compra"
      key="compra"
      notifications={totalProductsCart}
    />,
    <FooterNavIcon
      iconComponent={<PersonIcon fontSize="medium" color="secondary" />}
      route="/customerPreferences"
      text="Perfil"
      key="perfil"
    />,
  ];

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
        height: '60px',
      }}
      style={{
        maxWidth: '100%',
      }}
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
          {
            navIcons.map((icon) => icon)
          }
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
