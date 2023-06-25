import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
// import { useTranslation } from 'react-i18next';
import {
  Backdrop, CircularProgress,
} from '@mui/material';
import { ResponsiveGrid } from '../../components/ResponsiveGrid';
import { DashboardCard } from '../../components/DashboardCard';

export function MarketsLastMinute() {
  // const { t } = useTranslation();
  const [marketsLastMinuteList, setMarketsLastMinuteList] = useState([]);
  const [loading, setLoading] = useState(true);

  useTracker(() => {
    const handler = Meteor.subscribe('marketsLastMinute');
    if (!handler.ready()) setMarketsLastMinuteList([]);
    else {
      const markets = Meteor.users.find({ 'profile.attributes.userType': 'comercio' }).fetch();
      Meteor.call('lastMinute.getMarketsInfo', markets, (error, result) => {
        if (error) console.log(error);
        else {
          const components = Object.entries(result).map(([, value]) => ({
            component: (
              <DashboardCard
                logo={value.logo}
                contentText={value.contentText}
                route={value.route}
                notifications={value.notifications}
              />
            ),
            key: value.key,
          }));
          setMarketsLastMinuteList(components);
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
        itemLg={4}
        items={marketsLastMinuteList}
      />
    </>

  );
}
