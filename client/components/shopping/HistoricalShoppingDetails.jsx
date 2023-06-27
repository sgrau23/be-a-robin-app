import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Box, Backdrop, CircularProgress,
} from '@mui/material';
import { ShoppingListTopNavbar } from '../navigations/ShoppingListTopNavbar';
import { CustomerFooterNavbar } from '../navigations/CustomerFooterNavbar';
import { ProductCard } from '../products/ProductCard';

export function HistoricalShoppingDetails({ ...props }) {
  const { t } = useTranslation();
  const id = props.location.pathname.split('/').slice(-1)[0];
  const [data, setData] = useState();

  // Make tab interaction
  useEffect(() => {
    Meteor.call('shoppingCart.getHistoricalList', id, (error, result) => {
      if (error) console.log(error);
      else setData(result[0]);
      console.log(result[0]);
    });
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!data}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        data && (
          <Box
            sx={{
              marginTop: '60px',
              marginBottom: '60px',
            }}
          >
            <ShoppingListTopNavbar text={`${t('Compra del')} ${data.timestamp.toLocaleDateString()}`} historical historicalDetails />
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
                data.products.map((product, idx) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    key={idx}

                  >
                    <ProductCard product={product.product} shoppingView />
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        )
      }

      <CustomerFooterNavbar />
    </>

  );
}
