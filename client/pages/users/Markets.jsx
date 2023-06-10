import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
// import { useTranslation } from 'react-i18next';
import { ResponsiveGrid } from '../../components/ResponsiveGrid';
import { DashboardCard } from '../../components/DashboardCard';

export function Markets() {
//   const { t } = useTranslation();
  const [marketsList, setMarketsList] = useState([]);
  // const SupermarketsCollectionClient = Mongo.Collection('SupermarketsCollection_Client');
  useTracker(() => {
    const handler = Meteor.subscribe('markets');
    if (!handler.ready()) setMarketsList([]);
    else {
      const data = Meteor.users.find({ 'profile.attributes.userType': 'comercio' }).fetch();
      const components = [];
      console.log(data);
      data.forEach((element) => {
        components.push(
          {
            component: <DashboardCard logo={element.photo} contentText={element.profile.given_name} route={`/marketsOffers/${element.profile.attributes.marketName}`} />,
            key: element.profile.attributes.marketName,
          },
        );
      });
      setMarketsList(components);
    }
  }, []);

  return (
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
      items={marketsList}
    />

  );
}
