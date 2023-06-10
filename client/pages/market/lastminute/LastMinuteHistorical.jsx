import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  Alert, CircularProgress, Backdrop,
} from '@mui/material';
import { OfferCard } from '../../../components/OfferCard';
import { ResponsiveGrid } from '../../../components/ResponsiveGrid';
import { MarketsHistoricalLastMinuteProductsCollection } from '../../../../imports/db/collections';

export function LastMinuteHistorical() {
  const { t } = useTranslation();
  const [lastmintues, setLastMinutes] = useState();
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);

  Meteor.call('products.categories', (error, result) => {
    if (error) console.log(error);
    else setCategories(result);
  });

  useTracker(() => {
    const { marketName } = Meteor.user().profile.attributes;
    const handler = Meteor.subscribe('marketsHistoricalLastMinuteProducts', marketName);
    if (!handler.ready()) setLastMinutes();
    else {
      const data = MarketsHistoricalLastMinuteProductsCollection.find({ marketName }).fetch();
      const components = [];
      data.forEach((element) => {
        components.push(
          {
            component: <OfferCard offer={element} extend endpointUpdate="extendLastMinute" categories={categories} setSuccess={setSuccess} />,
            key: element._id,
            offer: element,
          },
        );
      });
      setLastMinutes(components);
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

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!lastmintues}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        success && (
          <Alert severity="success">{t('Oferta last minute extendida correctamente.')}</Alert>
        )
      }
      {
        (lastmintues && lastmintues.length !== 0) && (
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
            items={lastmintues}
          />
        )
      }
      {
        (lastmintues && (lastmintues.length === 0) && !success) && (
          <Alert severity="info" color="success">{t('No hay ofertas last minute en el histórico.')}</Alert>
        )
      }

    </>

  );
}
