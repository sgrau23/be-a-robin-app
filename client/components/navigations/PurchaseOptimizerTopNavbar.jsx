import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid, Typography, Box, Drawer,
} from '@mui/material';

import Toolbar from '@mui/material/Toolbar';
import TuneIcon from '@mui/icons-material/Tune';
import _ from 'lodash';
import { OptimizerPreferencesForm } from '../optimizer/OptimizerPreferencesForm';
import { MultiSelector } from '../others/MultiSelector';

export function PurchaseOptimizerTopNavbar({
  text, customerPreferences, setCustomerPreferences,
  openOptimizerPreferencesForm, setOpenOptimizerPreferencesForm,
  setPurchasePurpose, purchasePurpose, setVisiblePurchasePurpose,
  availableMarkets, availableCategories, setAvailableMarkets,
  setAvailableCategories,
}) {
  // Translations
  const { t } = useTranslation();
  const [selectedMarkets, setSelectedMarkets] = useState(availableMarkets);
  const [selectedCategories, setSelectedCategories] = useState(availableCategories.map(
    (value) => value,
  ));

  useEffect(() => {
    setVisiblePurchasePurpose(
      _.filter(
        purchasePurpose,
        (product) => (
          (
            selectedMarkets.includes(product.marketName) || selectedMarkets.length === 0
          )
          && (
            selectedCategories.includes(product.category_id) || selectedCategories.length === 0
          )
        ),
      ),
    );
  }, [selectedMarkets, selectedCategories]);

  const onHandleCloseOptimizerForm = () => {
    setOpenOptimizerPreferencesForm(false);
  };
  const [openFilter, setOpenFilter] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenFilter(open);
  };

  const optimizePurchase = (data) => {
    setPurchasePurpose([]);
    Meteor.call('purchaseOptimizer.optimize', data, Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else {
        setPurchasePurpose(result.products);
        setVisiblePurchasePurpose(result.products);
        setAvailableMarkets(result.involvedMarkets);
        setAvailableCategories(result.involvedCategories);
      }
    });
  };

  const onHandleMarketsFilter = (event, values) => setSelectedMarkets(values);
  const onHandleCategoriesFilter = (event, values) => { setSelectedCategories(values); };

  const list = () => (
    <Box
      sx={{
        // height: '200px',
        flexGrow: 1,
      }}
      role="presentation"
      // onClick={toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          margin: '20px',
        }}
      >
        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: 2, sm: 2, md: 3, lg: 3,
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 30,
              }}
            >
              {t('Filtra tu propuesta:')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <MultiSelector
              id="marketsFilter"
              text={t('Filtro mercados')}
              options={availableMarkets}
              onHandleChange={onHandleMarketsFilter}
              selectedOptions={selectedMarkets}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <MultiSelector
              id="categoriesFilter"
              text={t('Filtro categorías')}
              options={availableCategories}
              onHandleChange={onHandleCategoriesFilter}
              selectedOptions={selectedCategories}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="top"
        open={openFilter}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
      <OptimizerPreferencesForm
        open={openOptimizerPreferencesForm}
        onHandleClose={onHandleCloseOptimizerForm}
        preferences={customerPreferences}
        setCustomerPreferences={setCustomerPreferences}
        optimizePurchase={optimizePurchase}
      />
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
          height: '120px',
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
              md={10}
              lg={10}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: 25,
                  color: 'black',
                }}
              >
                {t(text)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sm={2}
              md={2}
              lg={2}
              sx={{
                display: 'flex',
                float: 'right',
              }}
            >
              <TuneIcon
                onClick={toggleDrawer(true)}
                color="primary"
                sx={{
                  height: '40px',
                  width: '40px',
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <Box
                maxWidth
                sx={{
                  backgroundColor: 'secondary.main',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    padding: '8px',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#e6e6e6',
                      width: '100%',
                      borderRadius: 5,
                    }}
                  >
                    <Grid
                      container
                      columns={{
                        xs: 12, sm: 12, md: 12, lg: 12,
                      }}
                      textAlign="center"
                    >
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                      >
                        <Box
                          sx={{
                            margin: '8px',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              borderRadius: 5,
                              backgroundColor: 'secondary.main',
                            }}
                            id="pendingButton"
                          >

                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: 10,
                                color: 'black',
                              }}
                              onClick={() => setOpenOptimizerPreferencesForm(true)}
                            >
                              {t('PREFERENCIAS')}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                      >
                        <Box
                          sx={{
                            margin: '8px',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              borderRadius: 5,
                              backgroundColor: 'primary.main',
                              marginRight: '5px',
                            }}
                            id="purchasedButton"
                          >
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: 10,
                                color: 'black',
                              }}
                              onClick={() => optimizePurchase(customerPreferences)}
                            >
                              {t('RECALCULAR')}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>

  );
}
