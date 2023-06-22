import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import {
  Link,
} from 'react-router-dom';
import { ResponsiveGrid } from '../../../components/ResponsiveGrid';
import { DashboardCard } from '../../../components/DashboardCard';

export function Offers() {
  const { t } = useTranslation();
  const components = [
    {
      component: <DashboardCard logo="" contentText={t('Añadir Ofertas')} route="/offers/add" />,
      key: 'add_offers',
    },
    {
      component: <DashboardCard logo="" contentText={t('Gestionar Ofertas Activas')} route="/offers/manage" />,
      key: 'manage_offers',
    },
    {
      component: <DashboardCard logo="historical.png" contentText={t('Histórico de ofertas')} route="/offers/historical" />,
      key: 'historical_offers',
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
      items={components}
    />

  );
}
