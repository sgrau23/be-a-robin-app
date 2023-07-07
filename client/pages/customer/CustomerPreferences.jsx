import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography, Grid, Fab,
  Button, Box, Alert,
} from '@mui/material';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  useHistory,
} from 'react-router-dom';
import { CustomerPreferencesTopNavbar } from '../../components/navigations/CustomerPreferencesTopNavbar';
import { CustomerFooterNavbar } from '../../components/navigations/CustomerFooterNavbar';
import { OptimizerPreferencesForm } from '../../components/optimizer/OptimizerPreferencesForm';
import { TextInput } from '../../styles/styledComponents';

export function CustomerPreferences() {
  const { t } = useTranslation();
  const [openOptimizerPreferencesForm, setOpenOptimizerPreferencesForm] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  const user = Meteor.user();
  const [customerPreferences, setCustomerPreferences] = useState(user.profile.preferences);

  const onHandleCustomerPreferences = (e) => {
    setCustomerPreferences({ ...customerPreferences, [e.target.name]: e.target.value });
  };

  const onHandleUploadClick = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setCustomerPreferences({ ...customerPreferences, image: reader.result });
    };
  };

  const onHandleCloseOptimizerForm = () => {
    setOpenOptimizerPreferencesForm(false);
  };

  const onHandleBack = () => {
    history.push('/');
  };

  const onHandleSubmitPreferences = () => {
    Meteor.call('user.storePreferences', customerPreferences, Meteor.user()._id, (err) => {
      if (err) {
        setError(true);
      } else {
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

  return (
    <>
      <CustomerPreferencesTopNavbar user={user} />
      <OptimizerPreferencesForm
        open={openOptimizerPreferencesForm}
        onHandleClose={onHandleCloseOptimizerForm}
        preferences={customerPreferences}
        setCustomerPreferences={setCustomerPreferences}
      />
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
                {t('Datos personales:')}
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
                autoComplete=""
                onChange={onHandleCustomerPreferences}
                value={customerPreferences.name}
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
                name="surname"
                type="text"
                autoComplete=""
                onChange={onHandleCustomerPreferences}
                value={customerPreferences.surname}
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
                autoComplete=""
                onChange={onHandleCustomerPreferences}
                value={customerPreferences.postalCode}
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
                label={t('Edad')}
                variant="filled"
                name="age"
                type="number"
                autoComplete=""
                onChange={onHandleCustomerPreferences}
                value={customerPreferences.age}
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
                {t('Datos optimizador:')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              justifyContent="flex-end"
              display="flex"
            >
              <Box
                sx={{
                  borderRadius: 5,
                  backgroundColor: '#e6e6e6',
                  boxShadow: 5,
                  width: '90px',
                  marginBottom: '10px',
                }}
                style={{ textDecoration: 'none', color: 'black' }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={() => setOpenOptimizerPreferencesForm(true)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: '5px',
                }}
                >
                  <SettingsIcon
                    sx={{
                      height: '15px',
                      width: '15px',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 10,
                    }}
                  >
                    {t('Modificar')}
                  </Typography>
                </div>
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

      <CustomerFooterNavbar />
    </>

  );
}
