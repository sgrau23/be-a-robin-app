import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import { ResponsiveGrid } from '../../components/ResponsiveGrid';
import { SupermarketsCollection } from '../../../imports/db/collections';
import { DashboardCard } from '../../components/DashboardCard';

export function Supermarkets() {
  const { t } = useTranslation();
  const [superMarketsList, setSupermarketsList] = useState([]);
  // const SupermarketsCollectionClient = Mongo.Collection('SupermarketsCollection_Client');
  useTracker(() => {
    const handler = Meteor.subscribe('supermarkets');
    if (!handler.ready()) setSupermarketsList([]);
    else {
      const data = SupermarketsCollection.find().fetch();
      const components = [];
      data.forEach((element) => {
        components.push(
          {
            component: <DashboardCard logo={element.photo} contentText="" route={`/supermarkets/${element.key}`} />,
            key: element.key,
          },
        );
      });
      setSupermarketsList(components);
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
      items={superMarketsList}
    />

  );
}
