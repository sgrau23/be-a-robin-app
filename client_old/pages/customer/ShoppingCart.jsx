import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import {
  List, ListItem, Checkbox, DialogTitle, DialogContentText,
  DialogContent, DialogActions, Dialog, Button, Fab,
  Divider, Typography, Grid, Alert, Box, IconButton,
} from '@mui/material';
import $ from 'jquery';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  disabled: {
    opacity: 0.6,
  },
});

export function ShoppingCart() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
  const onHandleCloseConfirmationDialog = () => {
    setOpenDeleteConfirmationDialog(false);
  };
  const classes = useStyles();
  const punctuation = /[\.,?!]/g;

  // Get all products in user shopping cart
  useEffect(() => {
    Meteor.call('shoppingCart.getAll', Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setProducts(result);
    });
  }, []);

  // Set disabled products
  useEffect(() => {
    if (products.length > 0) {
      const disabledProducts = [];
      products.forEach((element) => {
        if (element.disabled) disabledProducts.push(element.name);
      });
      setChecked(disabledProducts);
    }
  }, [products]);

  // Handle checkbox
  const handleToggle = (product) => () => {
    const currentIndex = checked.indexOf(product.name);
    const newChecked = [...checked];

    const id = `#${product.name.replace(/\s/g, '').normalize('NFD').replace(punctuation, '')}-${product.marketName.replace(/\s/g, '').normalize('NFD').replace(punctuation, '')}`;
    console.log(id);
    if (currentIndex === -1) {
      newChecked.push(product.name);
      $(id).addClass(classes.disabled);
    } else {
      newChecked.splice(currentIndex, 1);
      $(id).removeClass(classes.disabled);
    }

    Meteor.call('shoppingCart.changeStatus', Meteor.user()._id, product, (currentIndex === -1), (error) => {
      if (error) console.log(error);
    });

    setChecked(newChecked);
  };

  // Remove all produts
  const onHandleRemoveAll = () => {
    Meteor.call('shoppingCart.deleteUserProducts', Meteor.user()._id, (error) => {
      if (error) console.log(error);
    });
    setProducts([]);
    setOpenDeleteConfirmationDialog(false);
  };

  return (
    <>
      {
        products.length !== 0 && (
          <>
            <Fab
              color="grey"
              style={{
                bottom: 70,
                left: 10,
                right: 'auto',
                position: 'fixed',
                height: '50px',
                width: '50px',
              }}
              onClick={() => setOpenDeleteConfirmationDialog(true)}
            >
              <DeleteIcon color="error" />
            </Fab>
            <Box
              sx={{
                marginBottom: 2,
              }}
            >
              {/* <IconButton
                // variant="contained"
                color="error"
                // size="large"
                sx={{
                  // borderRadius: 3,
                  // boxShadow: 4,
                  float: 'right',
                }}
                onClick={() => { setOpenDeleteConfirmationDialog(true); }}
              >
                <DeleteIcon />
              </IconButton> */}
              <Dialog
                open={openDeleteConfirmationDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {t('¿Estás seguro que quieres limpiar la lista de la compra?')}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t('Si eliminas la lista no podrás recuperarla.')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={onHandleCloseConfirmationDialog}>{t('Cancelar')}</Button>
                  <Button onClick={onHandleRemoveAll}>{t('Confirmar')}</Button>

                </DialogActions>
              </Dialog>
            </Box>
            <List dense sx={{ width: '100%', bgcolor: '#e6e6e6' }}>
              {products.map((product) => (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={product.name}
                    id={`${product.name.replace(/\s/g, '').normalize('NFD').replace(punctuation, '')}-${product.marketName.replace(/\s/g, '').normalize('NFD').replace(punctuation, '')}`}
                    className={(product.disabled ? classes.disabled : undefined)}
                    secondaryAction={(
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(product)}
                        checked={checked.indexOf(product.name) !== -1}
                      />
              )}
                  >
                    <Grid
                      container
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
                        <Typography>
                          <b>{t('Nombre producto: ')}</b>
                          {' '}
                          <i>{product.name}</i>
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <Typography>
                          <b>{t('Mercado: ')}</b>
                          {' '}
                          <i>{product.marketName}</i>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider component="li" />
                </>
              ),
              )}

            </List>
          </>
        )
      }

      {
        products.length === 0 && (
          <Alert severity="info" color="primary">{t('No tienes productos en la lista de compra.')}</Alert>
        )
      }
    </>

  );
}
