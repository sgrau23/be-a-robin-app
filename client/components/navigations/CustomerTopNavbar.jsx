import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid, Badge, Typography, Box,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import TuneIcon from '@mui/icons-material/Tune';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
export function CustomerTopNavbar() {
  // const [totalProductsCart, setTotalProductsCart] = useState(0);
  const { location } = Meteor.user().profile.preferences;
  const [currentLocation, setCurrentLocation] = useState(
    (location ? location.address : undefined),
  );
  const [coordinates, setCoordinates] = useState();
  // Translations
  const { t } = useTranslation();

  function success(pos) {
    const crd = pos.coords;
    setCoordinates({
      latitude: crd.latitude,
      longitude: crd.longitude,
    });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  // Obtain current coordinats of user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  const onHandleFilters = () => {
    console.log('FILTERS');
  };

  useEffect(() => {
    if (!location && coordinates) {
      Meteor.call('location.getAddress', coordinates, Meteor.user()._id, (err, result) => {
        if (err) console.log(err);
        else setCurrentLocation(result);
      });
    }
  }, [coordinates]);

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
            xs={2}
            sm={2}
            md={2}
            lg={2}
          />
          <Grid
            item
            xs={7}
            sm={7}
            md={7}
            lg={7}
          >

            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
            >
              <GpsFixedIcon
                color="primary"
                sx={{
                  marginRight: '9px',
                }}
              />

              <Typography
                color="black"
                sx={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  maxWidth: '170px',
                }}
              >
                {`${(currentLocation || t('No localización'))}`}
              </Typography>

            </div>

            {/* <GpsFixedIcon color="primary" /> */}
          </Grid>
          <Grid
            item
            xs={1}
            sm={1}
            md={1}
            lg={1}
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
