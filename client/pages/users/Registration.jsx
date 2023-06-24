import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Backdrop, Grid, Divider, CircularProgress, FormControl, Box,
  FormLabel, Avatar, Link, InputAdornment, IconButton, FormControlLabel, RadioGroup,
  Radio, InputLabel, Select, MenuItem, Alert, DialogTitle, DialogContentText,
  DialogContent, DialogActions, Dialog, Button, Chip, Fab, Checkbox, FormGroup,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Link as RouteLink,
  useHistory,
} from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { useTheme } from '@mui/material/styles';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import {
  WhiteTypography, TextInput, RoundedButton, GreenTypography,
} from '../../styles/styledComponents';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function Registration() {
  const history = useHistory();
  const theme = useTheme();
  // Translations
  const { t } = useTranslation();
  // Confirmation dialog variables
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const onHandleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };
  // User data variables
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    pass: '',
    pass2: '',
    userType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password2ValidationError, setPassword2ValidationError] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const onHandleUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    // Passwords validation
    if (e.target.name === 'pass2' && e.target.value !== userData.pass) setPassword2ValidationError(true);
    else if (e.target.name === 'pass' && e.target.value !== userData.pass2) setPassword2ValidationError(true);
    else if (e.target.name === 'pass2' && e.target.value === userData.pass) setPassword2ValidationError(false);
    else if (e.target.name === 'pass' && e.target.value === userData.pass2) setPassword2ValidationError(false);
  };
  // User common data
  const [userCommonData, setUserCommonData] = useState({
    country: '',
    city: '',
    address: '',
  });
  const onHandleUserCommonData = (e) => {
    setUserCommonData({ ...userCommonData, [e.target.name]: e.target.value });
  };
  // Customer user  data
  const [customerData, setCustomerData] = useState({
    name: '',
    firstName: '',
    postalCode: undefined,
    // secondName: '',
    // diet: '',
  });
  Meteor.call('products.categories', (error, result) => {
    if (error) console.log(error);
    else setCategories(result);
  });
  const onHandleCustomerData = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };
  // Market user  data
  const [marketData, setMarketData] = useState({
    marketName: '',
    categories: [],
    image: undefined,
    eco: 'no',
  });
  const onHandleMarketData = (e) => {
    setMarketData({ ...marketData, [e.target.name]: e.target.value });
  };
  const onHandleCategories = (event) => {
    const {
      target: { value },
    } = event;
    marketData.categories = (typeof value === 'string' ? value.split(',') : value);
  };

  const onHandleEco = (event) => {
    marketData.eco = (event.target.checked ? 'yes' : 'no');
  };
  // Loading page
  const [loading, setLoading] = useState(false);
  // Submit new account
  const onHandleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (userData.pass !== userData.pass2) return false;
    marketData.marketCategories = marketData.categories.join(',');
    Meteor.call(
      'users.createUser',
      userData,
      userCommonData,
      (userData.userType === 'comercio' ? marketData : customerData),
      (error, result) => {
        if (error) {
          setRegistrationError(error.error);
          return false;
        }

        if (result.status === 400) {
          setRegistrationError(result.message);
          return false;
        }
        setRegistrationError('');
        history.push('/');
        return true;
      });
    setLoading(false);
  };

  const onHandleUploadClick = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setMarketData({ ...marketData, image: reader.result });
    };
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (th) => th.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="success" />
      </Backdrop>
      <Box sx={{ padding: '2%' }}>
        <form onSubmit={onHandleSubmit} action={<Link to="/" />}>
          {/* <form> */}
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={2}
            sx={{
              paddingY: '3%',
            }}
          >
            <Grid item>
              <Grid
                container
                direction="row"
                spacing={2}
              >
                <Grid item>
                  <Avatar src="logo.jpg" />
                </Grid>
                <Grid item>
                  <WhiteTypography
                    variant="h5"
                    color="white"
                  >
                    BE A ROBIN
                  </WhiteTypography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            spacing={2}
            sx={{
              paddingY: '3%',
            }}
          >
            <Grid item xs={12}>
              <WhiteTypography variant="h6" align="left">
                {t('Datos cuenta usuario:')}
              </WhiteTypography>
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label={t('Nombre de usuario')}
                variant="filled"
                name="username"
                type="username"
                autoComplete="username"
                onChange={onHandleUserData}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label={t('Correo electrónico')}
                variant="filled"
                name="email"
                type="email"
                autoComplete="email"
                onChange={onHandleUserData}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label={t('Contraseña')}
                variant="filled"
                name="pass"
                type={showPassword ? 'text' : 'password'}
                autoComplete="pass"
                onChange={onHandleUserData}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword && <VisibilityIcon />}
                        {!showPassword && <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label={t('Repite la contraseña')}
                variant="filled"
                name="pass2"
                type={showPassword ? 'text' : 'password'}
                autoComplete="pass2"
                onChange={onHandleUserData}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword && <VisibilityIcon />}
                        {!showPassword && <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {password2ValidationError && (
              <div style={{ marginTop: '3%' }}>
                <i>
                  <span style={{ color: 'red' }}>
                    {t('La contraseña debe de coincidir')}
                  </span>
                </i>
              </div>

              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>
                  <WhiteTypography variant="h6" align="left">
                    {t('Tipo de cuenta:')}
                  </WhiteTypography>
                </FormLabel>
                <RadioGroup row>
                  <FormControlLabel
                    color="red"
                    value="cliente"
                    name="userType"
                    required
                    control={<Radio />}
                    label={<Typography>{t('Cliente')}</Typography>}
                    onChange={onHandleUserData}
                  />
                  <FormControlLabel
                    value="comercio"
                    name="userType"
                    control={<Radio />}
                    required
                    label={<Typography>{t('Comercio')}</Typography>}
                    onChange={onHandleUserData}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          { userData.userType && userData.userType === 'cliente' && (
          <>
            <Divider />
            <Grid
              container
              spacing={2}
              sx={{
                paddingY: '3%',
              }}
            >
              <Grid item xs={12}>
                <WhiteTypography variant="h6" align="left">
                  {t(`Datos cuenta ${userData.userType}:`)}
                </WhiteTypography>
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Nombre')}
                  variant="filled"
                  name="name"
                  type="text"
                  autoComplete="name"
                  onChange={onHandleCustomerData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Primer apellido')}
                  variant="filled"
                  name="firstName"
                  type="text"
                  autoComplete="firstName"
                  onChange={onHandleCustomerData}
                  fullWidth
                  required
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextInput
                  label={t('Segundo apellido')}
                  variant="filled"
                  name="secondName"
                  type="text"
                  autoComplete="secondName"
                  onChange={onHandleCustomerData}
                  fullWidth
                  required
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextInput
                  label={t('País')}
                  variant="filled"
                  name="country"
                  type="text"
                  autoComplete="country"
                  onChange={onHandleUserCommonData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Ciudad')}
                  variant="filled"
                  name="city"
                  type="text"
                  autoComplete="city"
                  onChange={onHandleUserCommonData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Código postal')}
                  variant="filled"
                  name="postalCode"
                  type="number"
                  autoComplete="postalCode"
                  onChange={onHandleUserCommonData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Dirección')}
                  variant="filled"
                  name="address"
                  type="text"
                  autoComplete="address"
                  onChange={onHandleUserCommonData}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Divider />
            {/* <Grid
              container
              spacing={2}
              sx={{
                paddingY: '3%',
              }}
            >
              <Grid item xs={12}>
                <WhiteTypography variant="h6" align="left">
                  {t('Datos alimentación:')}
                </WhiteTypography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel variant="filled">{t('Tipo de dieta')}</InputLabel>
                  <Select
                    value={customerData.diet}
                    variant="filled"
                    // sx={{ color: 'green' }}
                    label={t('Tipo de dieta')}
                    name="diet"
                    onChange={onHandleCustomerData}
                  >
                    {
                      Object.keys(diets).map((key) => <MenuItem key={key} value={key}>{t(diets[key])}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>

            </Grid> */}
          </>
          )}

          { userData.userType && userData.userType === 'comercio' && (
          <>
            <Divider />
            <Grid
              container
              spacing={2}
              sx={{
                paddingY: '3%',
              }}
            >
              <Grid item xs={12}>
                <WhiteTypography variant="h6" align="left">
                  {t(`Datos cuenta ${userData.userType}:`)}
                </WhiteTypography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <FormGroup>
                  <FormControlLabel control={<Checkbox onClick={onHandleEco} />} label={t('Ecológico')} />
                </FormGroup>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">{t('Categorías comercio')}</InputLabel>
                  <Select
                    labelId="category-select-label"
                    multiple
                    value={marketData.categories}
                    label={t('Categorías comercio')}
                    onChange={onHandleCategories}
                    name="categories"
                    variant="filled"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {(
                        categories.map((category) => (
                          <MenuItem
                            id={category.id}
                            value={category.id}
                            key={category.id}
                            style={getStyles(category.name, marketData.categories, theme)}
                          >
                            {t(category.name)}
                          </MenuItem>
                        ))
                    )}
                  </Select>

                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Nombre comercio')}
                  variant="filled"
                  name="marketName"
                  type="text"
                  autoComplete="marketName"
                  onChange={onHandleMarketData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('País')}
                  variant="filled"
                  name="country"
                  type="text"
                  autoComplete="country"
                  onChange={onHandleUserCommonData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Ciudad')}
                  variant="filled"
                  name="city"
                  type="text"
                  autoComplete="city"
                  onChange={onHandleUserCommonData}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  label={t('Dirección')}
                  variant="filled"
                  name="address"
                  type="text"
                  autoComplete="address"
                  onChange={onHandleUserCommonData}
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
                <label htmlFor="attach-market-img">
                  <input
                    accept="image/*"
                    id="attach-market-img"
                    type="file"
                    required
                    onChange={onHandleUploadClick}
                    style={{
                      display: 'none',
                    }}
                  />
                  <Fab component="span">
                    <AddPhotoAlternateRoundedIcon />
                  </Fab>
                  {' '}
                  *
                </label>

              </Grid>
            </Grid>
          </>
          )}

          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="right"
            sx={{
              paddingY: '2%',
            }}
          >
            {
                password2ValidationError && (
                <Grid item xs={12}>
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ opacity: 0.7 }}
                  >
                    {t('Las contraseñas deben coincidir.')}
                  </Alert>
                </Grid>
                )
            }
            {
                (registrationError !== '') && (
                  <Grid item xs={12}>
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ opacity: 0.7 }}
                    >
                      {t(registrationError)}
                    </Alert>
                  </Grid>
                )
            }
            <Grid item xs={6}>
              <RoundedButton
                variant="contained"
                color="whiteButton"
                onClick={() => { setOpenConfirmationDialog(true); }}
              >
                {t('Atrás')}
              </RoundedButton>
              <Dialog
                open={openConfirmationDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {t('¿Estás seguro que quieres abandonar la página?')}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t('Si abandonas la página se perderán todos los datos introducidos!')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={onHandleCloseConfirmationDialog}>{t('Cancelar')}</Button>
                  <RouteLink
                    to="/"
                  >
                    <Button onClick={onHandleCloseConfirmationDialog} autoFocus>
                      {t('Abandonar')}
                    </Button>
                  </RouteLink>

                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item xs={6}>
              <RoundedButton
                variant="contained"
                type="submit"
                // onClick={onHandleSubmit}
                color="primary"
              >
                {t('Crear cuenta')}
              </RoundedButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}
