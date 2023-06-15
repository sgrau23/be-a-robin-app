import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, AppBar, Box, Backdrop, CircularProgress,
} from '@mui/material';
import { set } from 'lodash';
import { OptimizerPreferencesForm } from '../../components/OptimizerPreferencesForm';
import { OptimizerPurchaseList } from '../../components/OptimizerPurchaseList';

export function PurchaseOptimizer() {
  const { t } = useTranslation();
  const [optimizerPreferences, setOptimizerPreferences] = useState(Meteor.user().profile.purchaseOptimizerPreferences);
  const [purchasePurpose, setPurchasePurpose] = useState();
  const [
    openOptimizerPreferencesForm, setOpenOptimizerPerferencesForm,
  ] = useState(optimizerPreferences === undefined);

  useEffect(() => {
    Meteor.call('purchaseOptimizer.get', Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setPurchasePurpose(result);
    });
  }, []);

  const onHandleCloseOptimizerPreferencesForm = () => {
    setOpenOptimizerPerferencesForm(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!purchasePurpose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <OptimizerPreferencesForm
        open={openOptimizerPreferencesForm}
        onHandleClose={onHandleCloseOptimizerPreferencesForm}
        setOptimizerPreferences={setOptimizerPreferences}
        optimizerPreferences={optimizerPreferences}
        setPurchasePurpose={setPurchasePurpose}
      />

      {
          purchasePurpose && (
            <OptimizerPurchaseList
              purpose={purchasePurpose}
              openOptimizerPreferencesForm={setOpenOptimizerPerferencesForm}
              setPurchasePurpose={setPurchasePurpose}
              optimizerPreferences={optimizerPreferences}
            />
          )
        }

    </>
  );
}
