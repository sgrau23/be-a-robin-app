import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import {
  Grid, Backdrop, CircularProgress, Alert, Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CustomerFooterNavbar } from '../../components/navigations/CustomerFooterNavbar';
import { CustomerTopNavbar } from '../../components/navigations/CustomerTopNavbar';
import { MarketTypes } from '../../components/others/MarketTypes';
import { SupermarketsCollection } from '../../../imports/db/collections';
import { MarketCard } from '../../components/markets/MarketCard';

export function CustomerDashboard() {
  const { t } = useTranslation();
  const [marketsList, setMarketsList] = useState();
  const { location } = Meteor.user().profile.preferences;
  const [supermarketsList, setSupermarketsList] = useState();
  const [ecoList, setEcoList] = useState();
  // const [marketsList, setMarketsList] = useState();
  const [marketTypeSelected, setMarketTypeSelected] = useState('frescos');

  // Get all supermarkets
  useTracker(() => {
    const handler = Meteor.subscribe('markets');
    if (!handler.ready()) setMarketsList();
    else {
      let data = [];
      if (location) {
        data = Meteor.users.find(
          {
            'profile.attributes.userType': 'comercio',
            // 'profile.preferences.coordinates': {
            //   $near: {
            //     $geometry: location.coordinates,
            //     $maxDistance: 10000,
            //   },
            // },
            'profile.preferences.city': { $regex: new RegExp(location.city, 'i') },
          },
        ).fetch();
      }
      const markets = [];
      const eco = [];
      data.forEach((element) => {
        if (element.profile.preferences.eco) eco.push(element);
        else markets.push(element);
      });
      setMarketsList(markets);
      setEcoList(eco);
    }
  }, []);
  // Get all markets
  useTracker(() => {
    const handler = Meteor.subscribe('supermarkets');
    if (!handler.ready()) setSupermarketsList();
    else {
      const data = SupermarketsCollection.find().fetch();
      setSupermarketsList(data);
    }
  }, []);

  // useEffect(() => {
  //   console.log(marketTypeSelected);
  // }, [marketTypeSelected]);

  return (
    <>
      <CustomerTopNavbar />
      <div
        style={{
          marginTop: '53px',
          width: '100%',
        }}
      >
        <Grid
          container
          columns={{
            xs: 12, sm: 12, md: 12, lg: 12,
          }}
          spacing={{
            xs: '5px', sm: '5px', md: '5px', lg: '5px',
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <MarketTypes
              marketTypeSelected={marketTypeSelected}
              setMarketTypeSelected={setMarketTypeSelected}
            />
          </Grid>
          {
            marketsList && marketTypeSelected === 'frescos' && (
              marketsList.map(
                (market) => <MarketCard data={market} key={market.profile.preferences.name} id={market.profile.preferences.name} type="markets" />,
              )
            )
          }
          {
            ecoList && marketTypeSelected === 'eco' && (
              ecoList.map((market) => <MarketCard data={market} id={market.profile.preferences.name} type="eco" />)
            )
          }
          {
            supermarketsList && marketTypeSelected === 'secos' && (
              supermarketsList.map((market) => <MarketCard data={market} id={market.key} type="supermarkets" />)
            )
          }
          {
            supermarketsList && supermarketsList.length === 0 && marketTypeSelected === 'secos' && (
              <Alert
                severity="info"
                color="success"
                sx={{
                  margin: '8px',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                  }}
                >
                  {t('No hay comercios en tu filtro de distancia.')}
                </Typography>
              </Alert>
            )
          }
          {
            marketsList && marketsList.length === 0 && marketTypeSelected === 'frescos' && (
              <Alert
                severity="info"
                color="success"
                sx={{
                  margin: '8px',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                  }}
                >
                  {t('No hay comercios en tu filtro de distancia.')}
                </Typography>
              </Alert>
            )
          }
          {
            ecoList && ecoList.length === 0 && marketTypeSelected === 'eco' && (
              <Alert
                severity="info"
                color="success"
                sx={{
                  margin: '8px',
                  width: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                  }}
                >
                  {t('No hay comercios en tu filtro de distancia.')}
                </Typography>
              </Alert>
            )
          }
        </Grid>
      </div>
      <CustomerFooterNavbar />
      {
        !supermarketsList && marketTypeSelected === 'secos' && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!supermarketsList}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )
      }

      {
        !marketsList && marketTypeSelected === 'frescos' && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!marketsList}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )
      }

      {
        !ecoList && marketTypeSelected === 'eco' && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!ecoList}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )
      }
    </>
  );
}
