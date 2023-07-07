import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography, Grid, Fab, FormControl, InputLabel, Select, Chip,
  Button, Box, Alert, FormControlLabel, FormGroup, Checkbox,
  MenuItem,
} from '@mui/material';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import { useTheme } from '@mui/material/styles';
import {
  useHistory,
} from 'react-router-dom';
import { MarketPreferencesTopNavbar } from '../../components/navigations/MarketPreferencesTopNavbar';
import { MarketFooterNavbar } from '../../components/navigations/MarketFooterNavbar';
import { TextInput } from '../../styles/styledComponents';

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

export function MarketPreferences() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const history = useHistory();
  const theme = useTheme();

  Meteor.call('products.categories', (err, result) => {
    if (err) console.log(err);
    else setCategories(result);
  });

  const user = Meteor.user();
  const [marketPreferences, setMarketPreferences] = useState(user.profile.preferences);

  const onHandleMarketPreferences = (e) => {
    setMarketPreferences({ ...marketPreferences, [e.target.name]: e.target.value });
  };

  const onHandleUploadClick = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setMarketPreferences({ ...marketPreferences, image: reader.result });
    };
  };

  const onHandleBack = () => {
    history.push('/');
  };

  const onHandleSubmitPreferences = () => {
    Meteor.call('user.storePreferences', marketPreferences, Meteor.user()._id, (err) => {
      if (err) setError(true);
      else {
        setError(false);
        setSuccess(true);
      }
    });
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        // After 3 seconds set the show value to false
        setSuccess(false);
      }, 3000);
    }
  }, [success]);

  const onHandleEco = (event) => {
    marketPreferences.eco = (event.target.checked);
    setMarketPreferences(marketPreferences);
  };

  const onHandleCategories = (event) => {
    const {
      target: { value },
    } = event;
    marketPreferences.categories = (typeof value === 'string' ? value.split(',') : value);
    setMarketPreferences(marketPreferences);
  };

  return (
    <>
      <MarketPreferencesTopNavbar user={user} />
      <Box
        maxWidth
        sx={{
          backgroundColor: 'secondary.main',
          width: '100%',
          marginTop: '72px',
        }}
        style={{
          maxWidth: '100%',
        }}
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
              xs: 2, sm: 2, md: 2, lg: 2,
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
                  fontSize: 20,
                }}
              >
                {t('Datos del comercio:')}
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
                label={t('Nombre mercado')}
                variant="filled"
                name="name"
                type="text"
                autoComplete=""
                onChange={onHandleMarketPreferences}
                value={marketPreferences.name}
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
                autoComplete=""
                onChange={onHandleMarketPreferences}
                value={marketPreferences.city}
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
                autoComplete=""
                onChange={onHandleMarketPreferences}
                value={marketPreferences.address}
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
                autoComplete=""
                onChange={onHandleMarketPreferences}
                value={marketPreferences.postalcode}
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
                <InputLabel id="category-select-label">{t('Categorías comercio')}</InputLabel>
                <Select
                  labelId="category-select-label"
                  multiple
                  value={marketPreferences.categories}
                  label={t('Categorías comercio')}
                  onChange={onHandleCategories}
                  name="categories"
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
                          style={getStyles(id, marketPreferences.categories, theme)}
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
                label={t('Horario')}
                variant="filled"
                name="schedule"
                type="text"
                autoComplete=""
                onChange={onHandleMarketPreferences}
                value={marketPreferences.schedule}
                placeholder={t('Abierto de')}
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
                label={t('Descripción comercio')}
                variant="filled"
                name="description"
                type="text"
                autoComplete=""
                onChange={onHandleMarketPreferences}
                value={marketPreferences.description}
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
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={marketPreferences.eco} onClick={onHandleEco} />}
                  label={t('Ecológico')}
                />
              </FormGroup>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <Box
                justifyContent="flex-end"
                display="flex"
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
                  <Fab
                    component="span"
                  >
                    <AddPhotoAlternateRoundedIcon />
                  </Fab>
                </label>
              </Box>

            </Grid>
          </Grid>
        </Box>
      </Box>
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
        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: 2, sm: 2, md: 2, lg: 2,
          }}
          sx={{
            marginBottom: '75px',
            padding: '15px',
          }}
        >
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
          >
            <Button
              onClick={onHandleBack}
              size="small"
              variant="contained"
              sx={{
              // marginTop: 4,
                width: '100%',
                boxShadow: 5,
                borderRadius: 10,
                backgroundColor: '#e6e6e6',
                color: 'black',
              }}
            >
              {t('Cancelar')}
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
          >
            <Button
              onClick={onHandleSubmitPreferences}
              size="small"
              variant="contained"
              sx={{
              // marginTop: 4,
                width: '100%',
                boxShadow: 5,
                borderRadius: 10,
              }}
            >
              {t('Guardar')}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            {
              success && (
                <Alert
                  severity="success"
                >
                  {t('Perfil actualizado correctamente.')}
                </Alert>
              )
            }
            {
              error && (
                <Alert
                  severity="error"
                >
                  {t('Ha habido algún problema al momento de guardar.')}
                </Alert>
              )
            }
          </Grid>
        </Grid>
      </Box>
      <MarketFooterNavbar />
    </>

  );
}
