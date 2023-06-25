import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardCard } from '../../components/DashboardCard';
import { ResponsiveGrid } from '../../components/ResponsiveGrid';

export function CustomerDashboard() {
  const { t } = useTranslation();
  const [totalLastMinuteProducts, setTotalLastMinuteProducts] = useState();

  useEffect(() => {
    Meteor.call('lastMinute.getTotalProducts', (error, result) => {
      if (error) console.log(error);
      else setTotalLastMinuteProducts(result);
    });
  }, []);

  const items = [
    {
      component: <DashboardCard logo="secos-offers.png" contentText={t('Rastreador de ofertas en supermercados')} route="/supermarkets" />,
      key: 'rastreator',
    },
    {
      component: <DashboardCard logo="frescos-offers.jpeg" contentText={t('Rastreador de ofertas en comercios de proximidad')} route="/marketsOffers" />,
      key: 'marketRastreator',
    },
    {
      component: <DashboardCard logo="compra.jpeg" contentText={t('Optmiza tu compra')} route="/purchaseOptimizer" />,
      key: 'compra',
    },
    {
      component: <DashboardCard logo="tienda-eco.jpeg" contentText={t('Tienda ECO')} route="/echoshop" />,
      key: 'eco',
    },
    {
      component: <DashboardCard logo="lastminute.jpeg" contentText={t('Last Minute')} route="/marketsLastMinute" notifications={totalLastMinuteProducts} />,
      key: 'lastminute',
    },
  ];

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
      items={items}
    />
  );
}
