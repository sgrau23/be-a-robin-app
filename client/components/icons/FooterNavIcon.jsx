import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography,
} from '@mui/material';
import {
  Link,
} from 'react-router-dom';

export function FooterNavIcon({ iconComponent, text, route }) {
  // Translations
  const { t } = useTranslation();
  return (
    <Grid item xs={2} sm={2} md={2} lg={2} sx={{ marginLeft: 1 }}>
      <Grid
        container
        columns={{
          xs: 12, sm: 12, md: 12, lg: 12,
        }}
        textAlign="center"
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <Link to={route}>
            {iconComponent}
          </Link>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <Typography
            sx={{
              fontSize: 10,
            }}
          >
            {t(text)}
          </Typography>

        </Grid>
      </Grid>
    </Grid>
  );
}
