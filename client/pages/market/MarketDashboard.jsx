import React from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography } from '@mui/material';
import { DashboardCard } from '../../components/DashboardCard';
import { ResponsiveGrid } from '../../components/ResponsiveGrid';

export function MarketDashboard() {
  const { t } = useTranslation();
  const items = [
    {
      component: <DashboardCard logo="frescos-offers.jpeg" contentText={t('Ofertas')} route="/offers" />,
      key: 'offers',
    },
    {
      component: <DashboardCard logo="lastminute.jpeg" contentText={t('Last Minute')} route="/lastminute" />,
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
