import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  Grid, Box, Backdrop, CircularProgress,
} from '@mui/material';
import { CustomerFooterNavbar } from '../../../components/navigations/CustomerFooterNavbar';
import { ProductCard } from '../../../components/products/ProductCard';
import { PurchaseOptimizerTopNavbar } from '../../../components/navigations/PurchaseOptimizerTopNavbar';
import { OptimizedPurchaseCollection } from '../../../../imports/db/collections';
import { Loader } from '../../../components/others/Loader';

export function PurchaseOptimizer() {
  const { t } = useTranslation();
  const [purchasePurpose, setPurchasePurpose] = useState([]);
  const [visiblePurchasePurpose, setVisiblePurchasePurpose] = useState([]);
  const user = Meteor.user();
  const [customerPreferences, setCustomerPreferences] = useState(user.profile.preferences);
  const [openOptimizerPreferencesForm, setOpenOptimizerPreferencesForm] = useState(false);

  // Get current market data
  useTracker(() => {
    const handler = Meteor.subscribe('optimizedPurchase', user._id);
    if (!handler.ready()) setPurchasePurpose([]);
    else {
      const data = OptimizedPurchaseCollection.find(
        {
          _id: user._id,
        },
      ).fetch().pop();
      if (!data) setOpenOptimizerPreferencesForm(true);
      else {
        setPurchasePurpose(data.products);
        setVisiblePurchasePurpose(data.products);
      }
    }
  }, []);
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={purchasePurpose.length === 0}
      >
        {/* <CircularProgress color="inherit" /> */}
        <Loader />
      </Backdrop>
      <Box
        sx={{
          marginTop: '120px',
          marginBottom: '60px',
        }}
      >
        <PurchaseOptimizerTopNavbar
          text="Optimizador Compra"
          customerPreferences={customerPreferences}
          setCustomerPreferences={setCustomerPreferences}
          openOptimizerPreferencesForm={openOptimizerPreferencesForm}
          setOpenOptimizerPreferencesForm={setOpenOptimizerPreferencesForm}
          setPurchasePurpose={setPurchasePurpose}
          purchasePurpose={purchasePurpose}
          setVisiblePurchasePurpose={setVisiblePurchasePurpose}
        />
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
            visiblePurchasePurpose.map((product) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key={product.name}
              >
                {/* {product.component} */}
                <ProductCard product={product} optimizerView />
              </Grid>
            ))
          }
        </Grid>
      </Box>
      <CustomerFooterNavbar />
    </>

  );
}
