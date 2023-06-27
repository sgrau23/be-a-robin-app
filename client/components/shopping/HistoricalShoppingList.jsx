import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Box, Alert, Typography, Backdrop, CircularProgress,
} from '@mui/material';
import { CustomerFooterNavbar } from '../navigations/CustomerFooterNavbar';
import { ProductCard } from '../products/ProductCard';
import { ShoppingListTopNavbar } from '../navigations/ShoppingListTopNavbar';
import { HistoricalShoppingCard } from './HistoricalShoppingCard';

export function HistoricalShoppingList() {
  const { t } = useTranslation();
  const [historicalShoppings, setHistoricalShoppings] = useState();

  // Make tab interaction
  useEffect(() => {
    Meteor.call('shoppingCart.getallHistorical', Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setHistoricalShoppings(result);
      console.log(result);
    });
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!historicalShoppings}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          marginTop: '60px',
          marginBottom: '60px',
        }}
      >
        <ShoppingListTopNavbar text="Compras anteriores" historical />
        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: 0, sm: 0, md: 0, lg: 0,
          }}
        >
          {
            historicalShoppings && historicalShoppings.map((historicalShopping, idx) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key={idx}

              >
                <HistoricalShoppingCard data={historicalShopping} idx={idx} />
              </Grid>
            ))
          }
        </Grid>
        {
          historicalShoppings && (historicalShoppings.length === 0) && (
            <Alert
              severity="info"
              color="success"
              sx={{
                margin: '8px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                }}
              >
                {t('No tienes compras anteriores')}
              </Typography>
            </Alert>
          )
        }
      </Box>
      <CustomerFooterNavbar />
    </>

  );
}
