import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography, Box, Avatar,
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autorenew } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ProductDetails } from './ProductDetails';
import { CustomerProduct } from './CustomerProduct';
import { MarketProduct } from './MarketProduct';

export function ProductCard({
  product, shoppingView = false, marketView = false,
  historicalOffer = false, offerType = '',
}) {
  const { t } = useTranslation();

  // Methods to be used by market user
  const onHandleDeleteProduct = () => {
    if (historicalOffer) {
      Meteor.call(
        (offerType === 'lastminute' ? 'products.removeHistoricalLastMinute' : 'products.removeHistoricalOffer'),
        product,
        (error) => {
          if (error) console.log(error);
        },
      );
    } else {
      Meteor.call(
        (offerType === 'lastminute' ? 'products.removeLastMinute' : 'products.removeOffer'),
        product,
        (error) => {
          if (error) console.log(error);
        },
      );
    }
  };

  return (
    <>
      {
        !marketView && (
          <CustomerProduct product={product} shoppingView={shoppingView} />
        )
      }
      {
        marketView && (
          <SwipeableViews>
            <MarketProduct product={product} />
            <Grid
              container
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
              spacing={{
                xs: 0, sm: 0, md: 0, lg: 0,
              }}
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
                    backgroundColor: 'red',
                  }}
                  onClick={onHandleDeleteProduct}
                >
                  <Grid
                    container
                    columns={{
                      xs: 12, sm: 12, md: 12, lg: 12,
                    }}
                    textAlign="center"
                    justifyContent="center"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <DeleteIcon
                        sx={{
                          height: '94px',
                          width: '100%',
                          color: 'secondary.main',
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
                      <Typography
                        sx={{
                          fontSize: 15,
                          color: 'secondary.main',
                        }}
                      >
                        {t('Eliminar')}
                      </Typography>
                    </Grid>
                  </Grid>
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
                    backgroundColor: 'primary.main',
                  }}
                  onClick={onHandleDeleteProduct}
                >
                  <Grid
                    container
                    columns={{
                      xs: 12, sm: 12, md: 12, lg: 12,
                    }}
                    textAlign="center"
                    justifyContent="center"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <SettingsIcon
                        sx={{
                          height: '94px',
                          width: '100%',
                          color: 'secondary.main',
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
                      <Typography
                        sx={{
                          fontSize: 15,
                          color: 'secondary.main',
                        }}
                      >
                        {
                          historicalOffer ? (
                            t('Extender')
                          ) : (
                            t('Modificar')
                          )
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </SwipeableViews>
        )
      }
      {/* {
        marketView && historicalOffer && (
          <SwipeableViews>
            <MarketProduct product={product} />
            <Grid
              container
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
              spacing={{
                xs: 0, sm: 0, md: 0, lg: 0,
              }}
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
                    backgroundColor: 'red',
                  }}
                  onClick={onHandleDeleteProduct}
                >
                  <Grid
                    container
                    columns={{
                      xs: 12, sm: 12, md: 12, lg: 12,
                    }}
                    textAlign="center"
                    justifyContent="center"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <DeleteIcon
                        sx={{
                          height: '94px',
                          width: '100%',
                          color: 'secondary.main',
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
                      <Typography
                        sx={{
                          fontSize: 15,
                          // fontWeight: 'bold',
                          color: 'secondary.main',
                        }}
                      >
                        {t('Eliminar')}
                      </Typography>
                    </Grid>
                  </Grid>
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
                    backgroundColor: 'primary.main',
                  }}
                  onClick={onHandleDeleteProduct}
                >
                  <Grid
                    container
                    columns={{
                      xs: 12, sm: 12, md: 12, lg: 12,
                    }}
                    textAlign="center"
                    justifyContent="center"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <SettingsIcon
                        sx={{
                          height: '94px',
                          width: '100%',
                          color: 'secondary.main',
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
                      <Typography
                        sx={{
                          fontSize: 15,
                          // fontWeight: 'bold',
                          color: 'secondary.main',
                        }}
                      >
                        {t('Extender')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </SwipeableViews>
        )
      } */}
    </>

  );
}
