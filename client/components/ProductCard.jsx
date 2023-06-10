import React from 'react';
// import { useTranslation } from 'react-i18next';
import {
  Card, CardContent, CardMedia, Grid, CardActions, Typography,
} from '@mui/material';
// import { Link } from 'react-router-dom';
import { CardImage } from './CardImage';
import { mainTheme } from '../styles/theme';

export function ProductCard({ product, market = false }) {
  // const { t } = useTranslation();
  return (
    <Card
      sx={{
        width: '100%',
        background: mainTheme.palette.secondary.main,
        boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)',
        // borderRadius: 8,
        // height: '50%',
      }}
    >
      <CardMedia>
        <CardImage url={product.image} />
      </CardMedia>
      <CardContent
        sx={{
          color: mainTheme.typography.color,
          paddingTop: 1,
        }}
        color="inherit"
      >
        <center>
          <Grid
            container
            spacing={{
              xs: 2, sm: 4, md: 4, lg: 4,
            }}
          >

            <Grid item xs={12} sm={12} md={12} lg={12}>

              <Typography variant="h7">
                {product.name}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              {
                !market ? (
                  <>
                    <Typography
                  // align="left"
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {`${product.price_info.price}€`}
                    </Typography>
                    <Typography
                // align="left"
                      variant="h6"
                      sx={{
                        marginLeft: 1,
                        textDecoration: 'line-through',
                        color: 'red',
                      }}
                    >
                      {`${product.price_info.prev_price}€`}
                    </Typography>
                  </>

                ) : (
                  <Typography
                  // align="left"
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {`${product.price}€`}
                  </Typography>
                )
              }

            </Grid>

          </Grid>
        </center>

      </CardContent>
      { !market && (
        <center>
          <CardActions
            sx={{
              backgroundColor: '#83B875',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >

            <Typography
              variant="h7"
              sx={{
                marginLeft: 1,
                fontWeight: 'bold',
              }}
            >
              {product.offer_type}
            </Typography>
          </CardActions>
        </center>
      )}
    </Card>
  );
}
