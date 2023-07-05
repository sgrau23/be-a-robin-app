import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  Grid, Box, Alert, Typography, Fab, DialogActions,
  DialogContent, Dialog, Button, DialogTitle, Backdrop,
  DialogContentText, CircularProgress,
} from '@mui/material';
import $ from 'jquery';
import { makeStyles } from '@material-ui/core';
import CheckIcon from '@mui/icons-material/Check';
import { CustomerFooterNavbar } from '../navigations/CustomerFooterNavbar';
import { ShoppingCartCollection } from '../../../imports/db/collections';
import { ProductCard } from '../products/ProductCard';
import { ShoppingListTopNavbar } from '../navigations/ShoppingListTopNavbar';

// Define tab classes
const useStyles = makeStyles({
  selected: {
    backgroundColor: '#ffffff',
  },
  notSelected: {
    backgroundColor: '#e6e6e6',
  },
});

export function ShoppingList() {
  const { t } = useTranslation();
  const [pendingProduts, setPendingProducts] = useState();
  const [purchasedProduts, setPurchasedProducts] = useState();
  const [typeProducts, setTypeProducts] = useState('pending');
  const classes = useStyles();
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
  const onHandleCloseConfirmationDialog = () => {
    setOpenDeleteConfirmationDialog(false);
  };

  // Get pending products
  useTracker(() => {
    const handler = Meteor.subscribe('shoppingCart', Meteor.user()._id);
    if (!handler.ready()) setPendingProducts();
    else setPendingProducts(ShoppingCartCollection.find({ $or: [{ 'product.disabled': false }, { 'product.disabled': { $exists: false } }] }).fetch());
  }, []);

  // Get purchased products
  useTracker(() => {
    const handler = Meteor.subscribe('shoppingCart', Meteor.user()._id);
    if (!handler.ready()) setPurchasedProducts();
    else setPurchasedProducts(ShoppingCartCollection.find({ 'product.disabled': true }).fetch());
  }, []);

  // Change offer type
  const onHandleTypeProducts = (event) => {
    if (event.target.id !== typeProducts) {
      setTypeProducts(event.target.id);
    }
  };

  // Make tab interaction
  useEffect(() => {
    // Remove previous classes
    $('#pendingButton').removeClass((typeProducts === 'pending' ? classes.notSelected : classes.selected));
    $('#purchasedButton').removeClass((typeProducts === 'purchased' ? classes.notSelected : classes.selected));
    // Add new classes
    $('#pendingButton').addClass((typeProducts === 'pending' ? classes.selected : classes.notSelected));
    $('#purchasedButton').addClass((typeProducts === 'purchased' ? classes.selected : classes.notSelected));
  }, [typeProducts]);

  // Remove all produts
  const onHandleRemoveAll = () => {
    Meteor.call('shoppingCart.deleteUserProducts', Meteor.user()._id, (error) => {
      if (error) console.log(error);
    });
    // setPendingProducts([]);
    // setPurchasedProducts([]);
    setOpenDeleteConfirmationDialog(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!pendingProduts}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={openDeleteConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            {t('¿Estás seguro que quieres limpiar la lista de la compra?')}
          </Typography>

        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>
              {t('Al eliminarla la podrás encontrar en el historial de compras.')}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onHandleCloseConfirmationDialog}>{t('Cancelar')}</Button>
          <Button onClick={onHandleRemoveAll}>{t('Confirmar')}</Button>

        </DialogActions>
      </Dialog>
      <Fab
        color="grey"
        style={{
          bottom: 130,
          right: 5,
          left: 'auto',
          position: 'fixed',
          height: '50px',
          width: '50px',
        }}
        onClick={() => setOpenDeleteConfirmationDialog(true)}
      >
        <CheckIcon color="success" />
      </Fab>
      <Box
        sx={{
          marginTop: '120px',
          marginBottom: '60px',
        }}
      >
        <ShoppingListTopNavbar text="Lista de la compra" onHandleTypeChange={onHandleTypeProducts} />
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
            pendingProduts && (typeProducts === 'pending') && (
              pendingProduts.map((product, idx) => (
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
            )
          }
          {
            purchasedProduts && (typeProducts === 'purchased') && (
              purchasedProduts.map((product, idx) => (
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
            )
          }
        </Grid>
        {
          pendingProduts && (pendingProduts.length === 0) && typeProducts === 'pending' && (
            <Alert
              severity="info"
              color="success"
              sx={{
                margin: '8px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                }}
              >
                {t('No tienes productos pendientes por comprar.')}
              </Typography>

            </Alert>
          )
        }
        {
          purchasedProduts && (purchasedProduts.length === 0) && typeProducts === 'purchased' && (
            <Alert
              severity="info"
              color="success"
              sx={{
                margin: '8px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                }}
              >
                {t('No tienes productos seleccionados como comprados.')}
              </Typography>
            </Alert>
          )
        }
      </Box>
      <CustomerFooterNavbar />
    </>

  );
}
