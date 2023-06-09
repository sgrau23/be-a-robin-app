import React, { useState } from 'react';
import {
  AppBar, Grid, Button, CardActions, Dialog,
  DialogTitle, DialogContent, FormControl, InputLabel,
  Select, MenuItem, InputAdornment, Alert, Fab,
  Autocomplete,
  Typography,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HistoryIcon from '@mui/icons-material/History';
import { esES } from '@mui/x-date-pickers/locales';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextInput } from '../../styles/styledComponents';
import { FooterNavIcon } from '../icons/FooterNavIcon';
import { productTypes, categories } from '../../../imports/inubaVariables';

require('dayjs/locale/es');

dayjs.locale('es');

const defaultProductData = {
  description: '',
  category_id: '',
  image: undefined,
  productType: '',
  price: 0,
  expirationDate: dayjs().endOf('week'),
  offerType: 'offer',
  unit: '€/kg',
};

export function MarketFooterNavbar() {
  // Translations
  const { t } = useTranslation();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addError, setAddError] = useState(false);
  const { priceTypes } = Meteor.settings.public;
  // Product data
  const [productData, setProductData] = useState(defaultProductData);
  const navIcons = [
    <FooterNavIcon
      iconComponent={<HomeIcon fontSize="medium" color="secondary" />}
      route="/"
      text="Inicio"
      key="inicio"
    />,
    <FooterNavIcon
      iconComponent={<AddCircleIcon fontSize="medium" color="secondary" />}
      route=""
      text="Añadir"
      key="addOffer"
      setOpen={setOpenAddModal}
      open={openAddModal}
    />,
    <FooterNavIcon
      iconComponent={(
        <HistoryIcon fontSize="medium" color="secondary" />
      )}
      route="/historicalOffers"
      text="Histórico"
      key="historicalOffers"
    />,
    <FooterNavIcon
      iconComponent={<PersonIcon fontSize="medium" color="secondary" />}
      route="/marketPreferences"
      text="Perfil"
      key="perfil"
    />,
  ];

  const onHandleProductData = (e) => {
    if (e.target.name === 'offerType' && e.target.value === 'offer') {
      productData.expirationDate = dayjs().endOf('week');
    } else if (e.target.name === 'offerType' && e.target.value === 'lastminute') {
      productData.expirationDate = dayjs().endOf('day');
    }
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const onHandleAddProduct = (e) => {
    const data = { ...productData };
    console.log(data);
    data.expirationDate = data.expirationDate.$d.toLocaleDateString(
      'es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    );
    setAddError(false);

    Meteor.call(
      `products.${(productData.offerType === 'offer' ? 'createOffer' : 'createLastMinute')}`,
      data,
      Meteor.user().profile.preferences.name,
      (error) => {
        if (error) {
          setAddError(true);
        } else {
          setOpenAddModal(false);
          setProductData(defaultProductData);
        }
      });
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
      <Dialog
        open={openAddModal}
        keepMounted
      >
        <DialogTitle>
          <CloseRoundedIcon
            style={{
              cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',
            }}
            onClick={() => setOpenAddModal(false)}
          />
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {t('Añadir producto en oferta:')}
          </Typography>
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
                sx={{
                  marginTop: '8px',
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="offerType-select-label">{t('Tipo de Oferta')}</InputLabel>
                  <Select
                    labelId="offerType-select-label"
                    value={productData.offerType}
                    label={t('Tipo de Oferta')}
                    onChange={onHandleProductData}
                    name="offerType"
                    variant="filled"
                  >
                    <MenuItem
                      id="offer"
                      value="offer"
                      key="offer"
                    >
                      {t('Semanal')}
                    </MenuItem>

                    <MenuItem
                      id="lastminute"
                      value="lastminute"
                      key="lastminute"
                    >
                      {t('Last Minute')}
                    </MenuItem>

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
                <Autocomplete
                  // disablePortal
                  id="productType"
                  options={productTypes}
                  onChange={(event, value) => {
                    console.log(value);
                    setProductData({ ...productData, productType: value.label });
                  }}
                  // sx={{ width: 300 }}
                  renderInput={
                    (params) => (
                      <TextInput
                        required
                        value={productData.productType}
                        variant="filled"
                        name="productType"
                        {...params}
                        label={t('Tipo producto')}
                      />
                    )
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <TextInput
                  label={t('Descripción')}
                  variant="filled"
                  name="description"
                  type="description"
                  autoComplete=""
                  onChange={onHandleProductData}
                  value={productData.description}
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
                      Object.entries(categories).map(([id, name]) => (
                        <MenuItem
                          id={id}
                          value={name}
                          key={id}
                        >
                          {t(name)}
                        </MenuItem>
                      ))
                    )}
                  </Select>

                </FormControl>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
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
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
              >
                <FormControl fullWidth>
                  <InputLabel id="unit-select-label">{t('Tipo precio')}</InputLabel>
                  <Select
                    labelId="unit-select-label"
                    value={productData.unit}
                    label={t('Tipo precio')}
                    onChange={onHandleProductData}
                    name="unit"
                    variant="filled"
                    required
                  >
                    {(
                      priceTypes.map((value) => (
                        <MenuItem
                          id={value}
                          value={value}
                          key={value}
                        >
                          {t(value)}
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
                    {t('Subir Oferta')}
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </form>

        </DialogContent>
      </Dialog>
      <AppBar
        sx={{
          bottom: 0,
          right: 0,
          left: 0,
          top: 'auto',
          position: 'fixed',
          backgroundColor: 'primary.main',
          display: 'flex',
          height: '60px',
        }}
        style={{
          maxWidth: '100%',
        }}
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
            justifyContent="center"
          >
            {
            navIcons.map((icon) => icon)
          }
          </Grid>
        </Toolbar>
      </AppBar>
    </>

  );
}
