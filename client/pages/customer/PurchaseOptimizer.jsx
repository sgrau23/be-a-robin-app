import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
} from '@mui/material';
import { OptimizerPreferencesForm } from '../../components/OptimizerPreferencesForm';

export function PurchaseOptimizer() {
  const { t } = useTranslation();
  const [optimizerPreferences, setOptimizerPreferences] = useState(Meteor.user().profile.purchaseOptimizerPreferences);
  const [
    openOptimizerPreferencesForm, setOpenOptimizerPerferencesForm,
  ] = useState(optimizerPreferences === undefined);

  useEffect(() => {
    // Meteor.call('lastMinute.getTotalProducts', (error, result) => {
    //   if (error) console.log(error);
    //   else setTotalLastMinuteProducts(result);
    // });
  }, []);

  const onHandleCloseOptimizerPreferencesForm = () => {
    setOpenOptimizerPerferencesForm(false);
  };

  //   const items = [
  //     {
  //       component: <DashboardCard logo="" contentText={t('Rastreador de ofertas en supermercados')} route="/supermarkets" />,
  //       key: 'rastreator',
  //     },
  //     {
  //       component: <DashboardCard logo="" contentText={t('Rastreador de ofertas en comercios de proximidad')} route="/marketsOffers" />,
  //       key: 'marketRastreator',
  //     },
  //     {
  //       component: <DashboardCard logo="" contentText={t('Optmiza tu compra')} route="/purchase" />,
  //       key: 'compra',
  //     },
  //     {
  //       component: <DashboardCard logo="" contentText={t('Tienda ECO')} route="/echoshop" />,
  //       key: 'eco',
  //     },
  //     {
  //       component: <DashboardCard logo="" contentText={t('Last Minute')} route="/marketsLastMinute" notifications={totalLastMinuteProducts} />,
  //       key: 'lastminute',
  //     },
  //   ];

  const optimizePurchase = () => {
    Meteor.call('purchaseOptimizer.optimize', { dislikes: ['eggs'], diet: 'mediterranean' }, Meteor.user()._id, (error) => {
      if (error) console.log(error);
    });
  };

  return (
    <>
      {
            (optimizerPreferences === undefined)
              ? (
                <OptimizerPreferencesForm
                  open={openOptimizerPreferencesForm}
                  handleClose={onHandleCloseOptimizerPreferencesForm}
                  setOptimizerPreferences={setOptimizerPreferences}
                />
              )

              : (
                <Button onClick={optimizePurchase}>HOLA</Button>
              )

        }
      <div />
    </>
  );
}
