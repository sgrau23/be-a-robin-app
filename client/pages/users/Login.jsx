import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Backdrop, Typography, Grid, Link, CircularProgress, FormControl, Box,
  Alert, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link as RouteLink, useHistory } from 'react-router-dom';
import { RoundedButton, TextInput, WhiteTypography } from '../../styles/styledComponents';

export function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState();
  const history = useHistory();

  const onHandleLogin = () => {
    if (email === '' || pass === '') {
      setLoginError(t('Email y contraseña obligatorios.'));
    } else {
      setLoading(true);
      setLoginError(undefined);
      Meteor.login({ email, pass }, (error) => {
        if (error) setLoginError(error.error);
        else history.push('/');
        setLoading(false);
      });
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffff',
        height: '100vh',
        maxHeight: '100%',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ paddingY: '2%' }}>
        <Grid
          container
          textAlign="center"
          alignItems="center"
          direction="column"
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <Box
              component="img"
              src="logo.jpg"
              sx={{
                flexGrow: 0,
                maxHeight: '25%',
                borderRadius: 5,
                boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <WhiteTypography
              variant="h5"
              color="white"
            >
              BE A ROBIN
            </WhiteTypography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ padding: '5%' }}>
        <FormControl required fullWidth>
          <Grid container spacing={2} alignItems="center" textAlign="center">
            <Grid item xs={12}>
              <TextInput
                label={t('Correo electrónico')}
                variant="filled"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                label={t('Contraseña')}
                variant="filled"
                name="pass"
                type={showPassword ? 'text' : 'password'}
                autoComplete="pass"
                fullWidth
                onChange={(e) => setPass(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={handleMouseDownPassword}
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
              {
                  loginError && (
                    <Alert
                      variant="filled"
                      severity="error"
                      sx={{ opacity: 0.7 }}
                    >
                      {loginError}
                    </Alert>
                  )
                }
            </Grid>
            <Grid item xs={12}>
              <RoundedButton
                variant="contained"
                onClick={onHandleLogin}
                color="primary"
              >
                {t('Iniciar sesión')}
              </RoundedButton>
            </Grid>
            <Grid item xs={12}>
              <RouteLink
                to="/registration"
              >
                <RoundedButton
                  variant="contained"
                  color="grayButton"
                >
                  {t('Crear cuenta nueva')}
                </RoundedButton>
              </RouteLink>
            </Grid>
            {/* <Grid item xs={12}>
              <Link
                to="/"
                underline="always"
                sx={{
                  color: '#3C6435',
                }}
              >
                {t('¿Has olvidado la contraseña?')}
              </Link>
            </Grid> */}
          </Grid>
        </FormControl>
      </Box>
    </Box>
  );
}
