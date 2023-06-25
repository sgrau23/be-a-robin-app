import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  Grid, Button, Fab, Dialog, DialogContent, DialogTitle,
  Alert, CardActions, Select, MenuItem, FormControl, InputLabel, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { esES } from '@mui/x-date-pickers/locales';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { OfferCard } from '../../../components/OfferCard';
import { TextInput } from '../../../styles/styledComponents';
import { ResponsiveGrid } from '../../../components/ResponsiveGrid';

import { MarketsLastMinuteProductsTemporalCollection } from '../../../../imports/db/collections';

require('dayjs/locale/es');

dayjs.locale('es');

const defaultProductData = {
  name: '',
  category_id: '',
  image: undefined,
  price: 0,
  expirationDate: dayjs().endOf('week'),
};

export function LastMinuteAdd() {
  const { t } = useTranslation();
  const [lastminutes, setLastMinutes] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addError, setAddError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [visibleOffers, setVisibleOffers] = useState([]);
  // Product data
  const [productData, setProductData] = useState(defaultProductData);

  Meteor.call('products.categories', (error, result) => {
    if (error) console.log(error);
    else setCategories(result);
  });

  useTracker(() => {
    const { marketName } = Meteor.user().profile.attributes;
    const handler = Meteor.subscribe('marketsLastMinuteProductsTemporal', marketName);
    if (!handler.ready()) setLastMinutes([]);
    else {
      const data = MarketsLastMinuteProductsTemporalCollection.find({ marketName }).fetch();
      const components = [];
      data.forEach((element) => {
        components.push(
          {
            component: <OfferCard offer={element} editable={false} endpointRemove="removeTemporalLastMinute" />,
            key: element._id,
            lastminute: element,
          },
        );
      });
      setLastMinutes(components);
    // setVisibleOffers(components.slice(
    //   page * productsPerPage,
    //   page * productsPerPage + productsPerPage,
    // ));
    }
  }, []);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        // After 3 seconds set the show value to false
        setSuccess(false);
      }, 3000);
    }
  }, [success]);

  const onHandleProductData = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const onHandleAddProduct = (e) => {
    const data = { ...productData };
    data.expirationDate = data.expirationDate.$d.toLocaleDateString(
      'es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    );
    setAddError(false);
    Meteor.call(
      'products.createTemporalLastMinute',
      data,
      Meteor.user().profile.attributes.marketName,
      (error) => {
        if (error) setAddError(true);
        else {
          setOpenAddModal(false);
          setProductData(defaultProductData);
        }
      });
    e.preventDefault();
    return false;
  };

  const onHandleSubmitLastMinutes = () => {
    if (lastminutes.length !== 0) {
      Meteor.call(
        'products.submitLastMinutes',
        lastminutes,
        (error) => {
          if (error) console.log('error');
          else {
            setSuccess(true);
          }
        });
    }
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
      {
        success && (
          <Alert severity="success">{t('Las ofertas last minute se han subido correctamente.')}</Alert>
        )
      }
      <Fab
        color="inherit"
        style={{
          bottom: 70,
          left: 20,
          right: 'auto',
          position: 'fixed',
        }}
        onClick={() => setOpenAddModal(true)}
      >
        <AddIcon />
      </Fab>
      <Fab
        color="primary"
        style={{
          bottom: 70,
          left: 90,
          right: 'auto',
          position: 'fixed',
        }}
        onClick={onHandleSubmitLastMinutes}
      >
        <DoneRoundedIcon />
      </Fab>

      <Dialog
        open={openAddModal}
        // TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>
          <CloseRoundedIcon
            style={{
              cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',
            }}
            onClick={() => setOpenAddModal(false)}
          />
          {t('Añadir producto en oferta last minute:')}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={onHandleAddProduct}>
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
                    value={productData.category_id}
                    label={t('Categoría Producto')}
                    onChange={onHandleProductData}
                    name="category_id"
                    variant="filled"
                  >
                    {(
                        categories.map((category) => (
                          <MenuItem
                            id={category.id}
                            value={category.id}
                            key={category.id}
                          >
                            {t(category.name)}
                          </MenuItem>
                        ))
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
                addError && (
                  <Grid item xs={12}>
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ opacity: 0.7 }}
                    >
                      {t('Error en la subida')}
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
                      width: '50%',
                      boxShadow: 5,
                      borderRadius: 10,
                    }}
                  >
                    {t('Subir')}
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </form>

        </DialogContent>
      </Dialog>

      <ResponsiveGrid
        containerSpacing={{
          xs: 5, sm: 8, md: 15, lg: 15,
        }}
        containerColumns={{
          xs: 12, sm: 8, md: 12, lg: 12,
        }}
        itemXs={12}
        itemSm={4}
        itemMd={4}
        itemLg={3}
        items={lastminutes}
      />

    </>
  );
}
