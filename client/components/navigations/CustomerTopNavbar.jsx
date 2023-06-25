import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid, Badge, Typography, Box,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import TuneIcon from '@mui/icons-material/Tune';

export function CustomerTopNavbar() {
  // const [totalProductsCart, setTotalProductsCart] = useState(0);
  const [location, setLocation] = useState();
  // Translations
  const { t } = useTranslation();
  // useTracker(() => {
  //   const handler = Meteor.subscribe('shoppingCart', Meteor.user()._id);
  //   if (!handler.ready()) setTotalProductsCart(0);
  //   else setTotalProductsCart(ShoppingCartCollection.find().fetch().length);
  // }, []);

  const onHandleFilters = () => {
    console.log('FILTERS');
  };

  // function success(position) {
  //   const { latitude } = position.coords;
  //   const { longitude } = position.coords;
  //   setLocation({ latitude, longitude });
  //   console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

  //   // Make API call to OpenWeatherMap
  //   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=<YOUR_API_KEY>&units=metric`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // setWeather(data);
  //       console.log(data);
  //     })
  //     .catch((error) => console.log(error));
  // }

  // function error() {
  //   console.log('Unable to retrieve your location');
  // }

  // if (navigator.geolocation) {
  //   console.log(navigator.geolocation.getCurrentPosition(success, error));
  // } else {
  //   console.log('Geolocation not supported');
  // }

  return (
    <AppBar
      sx={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 'auto',
        position: 'fixed',
        backgroundColor: 'secondary.main',
        display: 'flex',
        boxShadow: 0,
        height: '55px',
      }}
      style={{ maxWidth: '100%' }}
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
          textAlign="center"
        >
          <Grid
            item
            xs={10}
            sm={10}
            md={10}
            lg={10}
          >
            <Typography
              color="black"
            >
              {/* aaa */}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            lg={2}
          >
            <Box
              onClick={onHandleFilters}
            >
              <TuneIcon color="primary" />
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
