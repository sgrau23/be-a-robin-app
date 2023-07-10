import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography, Box, Avatar,
} from '@mui/material';
import { ProductDetails } from './ProductDetails';

export function CustomerProduct({
  product, shoppingView = false, optimizerView = false,
}) {
  const { t } = useTranslation();
  const { categoriesMapping } = Meteor.settings.public;
  const [openDetails, setOpenDetails] = useState(false);

  const onHandleClose = () => {
    setOpenDetails(false);
  };

  const onHandleProductClick = () => {
    if (!shoppingView) setOpenDetails(true);
    else if (shoppingView) {
      Meteor.call('shoppingCart.changeStatus', Meteor.user()._id, product, (product.disabled === false), (error) => {
        if (error) console.log(error);
      });
    }
  };

  return (
    <>
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
        onClick={onHandleProductClick}
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
                {product.name}
              </Typography>
              {
            (shoppingView || optimizerView) && (
            <Typography
              sx={{
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: 12,
                color: 'primary.main',
              }}
            >
              {product.marketName}
            </Typography>
            )
            }
              <Typography
                sx={{
                  fontStyle: 'italic',
                  fontSize: 12,
                }}
              >
                {t(categoriesMapping[product.category_id])}
              </Typography>
              {
            product.price ? (
              <Typography
                sx={{
                  fontStyle: 'italic',
                  fontSize: 12,
                }}
              >
                {product.price}
                €
              </Typography>
            ) : (
              product.price_info && (
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
      {
        !shoppingView && (
          <ProductDetails
            product={product}
            open={openDetails}
            onHandleClose={onHandleClose}
          />
        )
      }
    </>
  );
}
