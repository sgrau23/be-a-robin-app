import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  Alert, CircularProgress, Backdrop,
} from '@mui/material';
import { OfferCard } from '../../../components/OfferCard';
import { ResponsiveGrid } from '../../../components/ResponsiveGrid';
import { MarketsOfferProductsCollection } from '../../../../imports/db/collections';

export function OffersManage() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState();
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);

  Meteor.call('products.categories', (error, result) => {
    if (error) console.log(error);
    else setCategories(result);
  });

  useTracker(() => {
    const { marketName } = Meteor.user().profile.attributes;
    const handler = Meteor.subscribe('marketsOfferProducts', marketName);
    if (!handler.ready()) setOffers();
    else {
      const data = MarketsOfferProductsCollection.find({ marketName }).fetch();
      const components = [];
      data.forEach((element) => {
        components.push(
          {
            component: <OfferCard offer={element} editable endpointRemove="removeOffer" categories={categories} setSuccess={setSuccess} />,
            key: element._id,
            offer: element,
          },
        );
      });
      setOffers(components);
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
        open={!offers}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        success && (
          <Alert severity="success">{t('Oferta actualizada correctamente.')}</Alert>
        )
      }
      {
        (offers && offers.length !== 0) && (
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
            items={offers}
          />
        )
      }
      {
        (offers && offers.length === 0) && (
          <Alert severity="info" color="success">{t('No hay ofertas activas.')}</Alert>
        )
      }

    </>

  );
}
