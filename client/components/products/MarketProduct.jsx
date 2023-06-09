import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography, Box, Avatar,
} from '@mui/material';

export function MarketProduct({
  product,
}) {
  const { t } = useTranslation();
  // const { categories, categoriesMapping } = Meteor.settings.public;
  return (
    <Box
      maxWidth
      sx={{
        backgroundColor: 'secondary.main',
        width: '100%',
        height: '120px',
      }}
      style={{
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          padding: '8px',
        }}
      >
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
            xs={9}
            sm={9}
            md={9}
            lg={9}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
              }}
            >
              {product.productType}
            </Typography>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontStyle: 'italic',
                fontSize: 12,
              }}
            >
              {product.description}
            </Typography>
            <Typography
              sx={{
                fontStyle: 'italic',
                fontSize: 12,
              }}
            >
              {/* {t(categoriesMapping[categories[product.category_id]])} */}
              {t(product.category_id)}
            </Typography>
            {
                product.price ? (
                  <Typography
                    sx={{
                      fontStyle: 'italic',
                      fontSize: 12,
                    }}
                  >
                    {t('Precio: ')}
                    {product.price}
                    €
                  </Typography>
                ) : (
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
                    >
                      <Typography
                        sx={{
                          fontStyle: 'italic',
                          fontSize: 12,
                        }}
                      >
                        {t('Precio: ')}
                        {`${product.price_info.price}€ /`}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                    >
                      <Typography
                        sx={{
                          textDecoration: 'line-through',
                          color: 'red',
                          fontSize: 12,
                        }}
                      >
                        {`${product.price_info.prev_price}€`}
                      </Typography>
                    </Grid>
                  </Grid>

                )
              }

            {
                product.expirationDate && (
                  <Typography
                    sx={{
                      fontStyle: 'italic',
                      fontSize: 10,
                      color: 'red',
                    }}
                  >
                    {`${t('Expira el')} ${product.expirationDate}`}
                  </Typography>
                )
              }

          </Grid>
          <Grid
            item
            xs={3}
            sm={3}
            md={3}
            lg={3}
          >
            <center>
              <Avatar
                alt=""
                src={product.image}
                sx={{
                  height: '75px',
                  width: '75px',
                }}
              />
            </center>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
