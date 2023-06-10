import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveGrid } from '../../../components/ResponsiveGrid';
import { DashboardCard } from '../../../components/DashboardCard';

export function LastMinute() {
  const { t } = useTranslation();
  const components = [
    {
      component: <DashboardCard logo="" contentText={t('Añadir Ofertas Last Minute')} route="/lastminute/add" />,
      key: 'add_lastminute',
    },
    {
      component: <DashboardCard logo="" contentText={t('Gestionar Ofertas Last Minute Activas')} route="/lastminute/manage" />,
      key: 'manage_lastminute',
    },
    {
      component: <DashboardCard logo="" contentText={t('Histórico Ofertas Last Minute')} route="/lastminute/historical" />,
      key: 'historical_lastminute',
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
