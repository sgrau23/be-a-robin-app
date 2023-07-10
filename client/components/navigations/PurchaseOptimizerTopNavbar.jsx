import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
} from 'react-router-dom';
import {
  AppBar, Grid, Typography, Box,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { OptimizerPreferencesForm } from '../optimizer/OptimizerPreferencesForm';

export function PurchaseOptimizerTopNavbar({
  text, customerPreferences, setCustomerPreferences,
  openOptimizerPreferencesForm, setOpenOptimizerPreferencesForm,
  setPurchasePurpose,
}) {
  // Translations
  const { t } = useTranslation();
  const onHandleCloseOptimizerForm = () => {
    setOpenOptimizerPreferencesForm(false);
  };

  const optimizePurchase = (data) => {
    setPurchasePurpose([]);
    Meteor.call('purchaseOptimizer.optimize', data, Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setPurchasePurpose(result.products);
    });
  };
  return (
    <>
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
              xs={12}
              sm={12}
              md={12}
              lg={12}
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
