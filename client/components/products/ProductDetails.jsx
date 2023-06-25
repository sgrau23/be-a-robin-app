import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography, Box, Button, Dialog, Fab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export function ProductDetails({ product, onHandleClose, open }) {
  const { t } = useTranslation();
  const { categoriesMapping } = Meteor.settings.public;
  const [quantity, setQuantity] = useState(1);

  const onIncreaseQty = () => {
    setQuantity(quantity + 1);
  };

  const onDecreaseQty = () => {
    if (quantity >= 2) setQuantity(quantity - 1);
  };

  const onHandleAddProduct2Cart = () => {
    Meteor.call(
      'shoppingCart.addProduct',
      product,
      quantity,
      Meteor.user()._id,
      product.marketName,
      (error) => {
        if (error) console.log(error);
      },
    );
    onHandleClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      sx={{
        margin: '20px',
      }}
      PaperProps={{ sx: { borderRadius: '8px' } }}
    >
      <Fab
        color="secondary"
        style={{
          top: 30,
          right: 25,
          left: 'auto',
          position: 'fixed',
          height: '10px',
          width: '35px',
        }}
        onClick={onHandleClose}
      >
        <CloseIcon color="black" fontSize="small" />
      </Fab>
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
          xs={12}
          sm={12}
          md={12}
          lg={12}
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
            <Box
              maxWidth
              sx={{
                backgroundColor: 'secondary.main',
                width: '100%',
              }}
              style={{
                maxWidth: '100%',
              }}
            >
              <img
                src={product.image}
                alt=""
                style={{
                  height: '150px',
                  width: '100%',
                }}
              />
            </Box>

          </Grid>
          <Box
            sx={{
              padding: '8px',
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
                }}
              >
                {product.name}
              </Typography>
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
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <Box
                sx={{
                  height: '150px',
                  width: '100%',
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

              <Grid
                container
                columns={{
                  xs: 12, sm: 12, md: 12, lg: 12,
                }}
                spacing={{
                  xs: 2, sm: 2, md: 2, lg: 2,
                }}
                justifyContent="center"
                textAlign="center"
              >

                <Grid
                  item
                >
                  <Fab
                    color="secondary"
                    onClick={onDecreaseQty}
                    sx={{
                      height: '20px',
                      width: '35px',
                    }}
                  >
                    <RemoveIcon color="black" fontSize="small" />
                  </Fab>
                </Grid>
                <Grid
                  item
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    {quantity}
                  </Typography>
                </Grid>
                <Grid
                  item
                >
                  <Fab
                    color="secondary"
                    onClick={onIncreaseQty}
                    sx={{
                      height: '20px',
                      width: '35px',
                    }}
                  >
                    <AddIcon color="black" fontSize="small" />
                  </Fab>
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
                      fontStyle: 'italic',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                  >
                    {t('Unidades a añadir')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>

        </Grid>
      </Grid>
      <Button
        onClick={onHandleAddProduct2Cart}
        size="small"
        variant="contained"
        sx={{
          boxShadow: 5,
          borderRadius: 10,
          right: '40px',
          left: '40px',
          bottom: '40px',
          position: 'fixed',

        }}
      >
        {t('Añadir a la lista')}
      </Button>
    </Dialog>
  );
}
