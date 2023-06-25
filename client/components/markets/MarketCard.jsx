import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography, Box,
} from '@mui/material';

export function MarketCard({ data, type }) {
  const { t } = useTranslation();

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
    >
      <Link
        to={`/${type}/${data.profile.attributes.marketName}`}
        style={{ color: 'inherit', textDecoration: 'inherit' }}
      >
        <Box
          maxWidth
          sx={{
            backgroundColor: 'secondary.main',
            width: '100%',
          }}
          style={{
            maxWidth: '100%',
          }}
        >
          <Box
            sx={{
              padding: '8px',
            }}
          >
            <Grid
              container
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <img
                  src={data.profile.image}
                  alt=""
                  style={{
                    height: '150px',
                    width: '100%',
                    borderRadius: 6,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                lg={8}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {t(data.profile.attributes.marketName)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
              >
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    fontSize: 12,
                    textAlign: 'right',
                  }}
                >
                  {t('a 300 metros')}
                </Typography>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Link>
    </Grid>
  );
}
