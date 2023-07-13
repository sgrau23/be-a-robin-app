import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Backdrop, Grid, Divider, CircularProgress, FormControl, Box,
  Avatar, InputAdornment, IconButton, FormControlLabel, RadioGroup,
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
  WhiteTypography, TextInput, RoundedButton,
} from '../../styles/styledComponents';
import { DialogInformative } from '../../components/dialogs/DialogInformative';
import { categories } from '../../../imports/inubaVariables';

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

function getStyles(id, cats, theme) {
  return {
    fontWeight:
      cats.indexOf(id) === -1
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
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacity, setOpenPrivacity] = useState(false);

  const onHandleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };
  const onHandleCloseTerms = () => {
    setOpenTerms(false);
  };
  const onHandleClosePrivacity = () => {
    setOpenPrivacity(false);
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
  // Customer user  data
  const [customerData, setCustomerData] = useState({
    name: '',
    firstName: '',
    postalCode: undefined,
    age: undefined,
    // secondName: '',
    // diet: '',
  });
  const onHandleCustomerData = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };
  // Market user  data
  const [marketData, setMarketData] = useState({
    name: '',
    categories: [],
    image: undefined,
    eco: '0',
    city: '',
    address: '',
    postalcode: '',
  });
  const onHandleMarketData = (e) => {
    setMarketData({ ...marketData, [e.target.name]: e.target.value });
  };
  const onHandleCategories = (event) => {
    const {
      target: { value },
    } = event;
    setMarketData({
      ...marketData,
      categories: (typeof value === 'string' ? value.split(',') : value),
    });
  };

  const onHandleEco = (event) => {
    marketData.eco = (event.target.checked ? '1' : '0');
  };
  // Loading page
  const [loading, setLoading] = useState(false);
  // Submit new account
  const onHandleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (userData.pass !== userData.pass2) return false;
    marketData.categories = marketData.categories.join(',');
    Meteor.call(
      'users.createUser',
      userData,
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
        return false;
      },
    );
    setLoading(false);
    return false;
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
    <Box
      sx={{
        backgroundColor: ' #ffff',
        maxHeight: '100%',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (th) => th.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="success" />
      </Backdrop>
      <Box sx={{ padding: '2%' }}>
        <form onSubmit={onHandleSubmit}>
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
                  <Avatar
                    src="logo_notitle.png"
                  />
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <Typography variant="h6" align="left">
                {t('Datos cuenta usuario:')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <FormControl>
                <Typography sx={{ color: 'black' }} variant="h6" align="left">
                  {t('Tipo de cuenta:')}
                </Typography>
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
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Typography variant="h6" align="left">
                  {t(`Datos cuenta ${userData.userType}:`)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
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
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
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
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <TextInput
                  label={t('Código postal')}
                  variant="filled"
                  name="postalCode"
                  type="number"
                  autoComplete="postalCode"
                  onChange={onHandleCustomerData}
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
                <TextInput
                  label={t('Años')}
                  variant="filled"
                  name="age"
                  type="number"
                  autoComplete="age"
                  onChange={onHandleCustomerData}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Divider />
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
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Typography variant="h6" align="left">
                  {t(`Datos cuenta ${userData.userType}:`)}
                </Typography>
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
                    // name="categories"
                    variant="filled"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={categories[value]} label={categories[value]} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {(
                      Object.entries(categories).map(([id, name]) => (
                        <MenuItem
                          id={id}
                          value={id}
                          key={id}
                          style={getStyles(id, marketData.categories, theme)}
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
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <TextInput
                  label={t('Nombre comercio')}
                  variant="filled"
                  name="name"
                  type="text"
                  autoComplete="name"
                  onChange={onHandleMarketData}
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
                <TextInput
                  label={t('Ciudad')}
                  variant="filled"
                  name="city"
                  type="text"
                  autoComplete="city"
                  onChange={onHandleMarketData}
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
                <TextInput
                  label={t('Dirección')}
                  variant="filled"
                  name="address"
                  type="text"
                  autoComplete="address"
                  onChange={onHandleMarketData}
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
                <TextInput
                  label={t('Código Postal')}
                  variant="filled"
                  name="postalcode"
                  type="number"
                  autoComplete="postalcode"
                  onChange={onHandleMarketData}
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
          <DialogInformative
            open={openTerms}
            onHandleClose={onHandleCloseTerms}
            title="TÉRMINOS Y CONDICIONES:"
            data={Meteor.settings.public.termsAndConditions}
          />
          <DialogInformative
            open={openPrivacity}
            onHandleClose={onHandleClosePrivacity}
            title="POLÍTICA DE PRIVACIDAD:"
            data={Meteor.settings.public.privacityPolicy}
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox required />}
              label={(
                <div>
                  <span>{t('Accepto los ')}</span>
                  <RouteLink to="#" onClick={() => setOpenTerms(true)}>{t('términos y condiciones.')}</RouteLink>
                </div>
              )}
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox required />}
              label={(
                <div>
                  <span>{t('Accepto la ')}</span>
                  <RouteLink to="#" onClick={() => setOpenPrivacity(true)}>{t('política de privacidad.')}</RouteLink>
                </div>
              )}
            />
          </FormGroup>
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
                color="grayButton"
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
                color="primary"
              >
                {t('Crear cuenta')}
              </RoundedButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
