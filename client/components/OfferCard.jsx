import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

import EditIcon from '@mui/icons-material/Edit';
import { esES } from '@mui/x-date-pickers/locales';
import {
  Card, CardContent, CardMedia, Grid, CardActions, Typography,
  DialogTitle, DialogContent, DialogActions, Dialog, Button,
  MenuItem, FormControl, InputLabel, InputAdornment, Select,
  Fab, Alert, Backdrop, CircularProgress,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mainTheme } from '../styles/theme';
import { TextInput } from '../styles/styledComponents';
import { CardImage } from './CardImage';

require('dayjs/locale/es');

dayjs.locale('es');

export function OfferCard({
  offer, endpointRemove = 'removeTemporalOffer', editable = false, endpointUpdate = 'updateOffer', categories = [], setSuccess = undefined,
  extend = false,
}) {
  const { t } = useTranslation();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: offer.name,
    category_name: offer.category_name,
    image: offer.image,
    price: offer.price,
    expirationDate: dayjs(offer.expirationDate, 'DD/MM/YYYY'),
  });
  const [updateError, setUpdateError] = useState(false);

  const onHandleDeleteOffer = () => {
    Meteor.call(`products.${endpointRemove}`, offer, (error) => {
      if (error) console.log(error);
      else setOpenConfirmationDialog(false);
    });
  };

  const onHandleProductData = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const onHandleUpdateOffer = (e) => {
    setUpdateError(false);
    setLoading(true);
    // Assign id and market name
    const data = { ...productData };
    data.marketName = Meteor.user().profile.attributes.marketName;
    data.expirationDate = data.expirationDate.$d.toLocaleDateString(
      'es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    );
    Meteor.call(
      `products.${endpointUpdate}`,
      data,
      offer._id,
      (error) => {
        if (error) setUpdateError(true);
        else {
          setOpenUpdateModal(false);
          setSuccess(true);
        }
        setLoading(false);
      },
    );
    e.preventDefault();
    return false;
  };

  const onHandleUploadClick = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProductData({ ...productData, image: reader.result });
    };
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card
        sx={{
          width: '100%',
          background: mainTheme.palette.secondary.main,
          boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)',
          // borderRadius: 8,
          // height: '50%',
        }}
      >
        <CardContent>
          {
            !extend && (
              <DeleteIcon
                style={{
                  cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px', marginRight: 15, color: 'red',
                }}
                onClick={() => setOpenConfirmationDialog(true)}
              />
            )
          }

          {
          (editable || extend) && (
          <EditIcon
            style={{
              cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px', marginRight: 10, color: mainTheme.palette.primary.main,
            }}
            onClick={() => setOpenUpdateModal(true)}
          />
          )
          }
        </CardContent>

        <CardMedia>
          <CardImage url={offer.image} />
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
                  {offer.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {`${offer.price}€`}
                </Typography>
              </Grid>
            </Grid>
          </center>
        </CardContent>
      </Card>
      <Dialog
        open={openConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('¿Estás seguro que quieres eliminar la oferta?')}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)}>{t('Cancelar')}</Button>

          <Button onClick={onHandleDeleteOffer} autoFocus>
            {t('Confirmar')}
          </Button>

        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdateModal}
        // TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>
          <CloseRoundedIcon
            style={{
              cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',
            }}
            onClick={() => setOpenUpdateModal(false)}
          />
          {t((editable ? 'Actualizar producto en oferta:' : 'Extender producto en oferta'))}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={onHandleUpdateOffer}>
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
                <TextInput
                  label={t('Nombre producto')}
                  variant="filled"
                  name="name"
                  type="name"
                  autoComplete=""
                  onChange={onHandleProductData}
                  value={productData.name}
                  fullWidth
                  required
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">{t('Categoría Producto')}</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={productData.category_name}
                    label={t('Categoría Producto')}
                    onChange={onHandleProductData}
                    name="category_name"
                    variant="filled"
                  >
                    {(
                        categories.map((category) => (<MenuItem value={category} key={category}>{category}</MenuItem>))
                    )}
                  </Select>

                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <TextInput
                  label={t('Precio')}
                  variant="filled"
                  name="price"
                  type="number"
                  autoComplete=""
                  onChange={onHandleProductData}
                  fullWidth
                  value={productData.price}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
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
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                  localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}

                >
                  <DemoContainer
                    components={['DatePicker']}
                  >
                    <DatePicker
                      name="expirationDate"
                      label={t('Fecha expiración')}
                      value={productData.expirationDate}
                      onChange={(date) => { productData.expirationDate = date; }}
                      slotProps={{ textField: { variant: 'filled' } }}
                      format="DD/MM/YYYY"
                    />
                  </DemoContainer>
                </LocalizationProvider>

              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <label htmlFor="attach-product-img">
                  <input
                    accept="image/*"
                    id="attach-product-img"
                    type="file"
                    onChange={onHandleUploadClick}
                    style={{
                      display: 'none',
                    }}
                  />
                  <Fab component="span">
                    <AddPhotoAlternateRoundedIcon />
                  </Fab>
                </label>

              </Grid>
              {
                updateError && (
                  <Grid item xs={12}>
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ opacity: 0.7 }}
                    >
                      {t('Error en la actualización')}
                    </Alert>
                  </Grid>
                )
              }

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <CardActions
                  sx={{
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    paddingBottom: 2,
                  }}
                >
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    sx={{
                      width: '750%',
                      boxShadow: 5,
                      borderRadius: 10,
                    }}
                  >
                    {t((editable ? 'Actualizar Oferta' : 'Extender Oferta'))}
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </form>

        </DialogContent>
      </Dialog>
    </>

  );
}
