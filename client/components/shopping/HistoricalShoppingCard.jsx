import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
} from 'react-router-dom';
import {
  Grid, Typography, Box, Avatar,
} from '@mui/material';

export function HistoricalShoppingCard({ data, idx }) {
  const { t } = useTranslation();
  const blankImage = Meteor.settings.public.data.blank_image;

  return (
    <Box
      maxWidth
      sx={{
        backgroundColor: 'secondary.main',
        width: '100%',
      }}
      style={{
        maxWidth: '100%',
      }}
      to={`/historicalShoppingList/${data._id}`}
    >
      <Link
        to={`/historicalShoppingList/${data._id}`}
        style={{ textDecoration: 'none', color: 'black' }}
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
            spacing={{
              xs: 0, sm: 0, md: 0, lg: 0,
            }}
          >
            <Grid
              item
              xs={3}
              sm={3}
              md={3}
              lg={3}
            >
              <center>
                <Avatar
                  alt=""
                  src={blankImage}
                  sx={{
                    height: '50%',
                    width: '50%',
                  }}
                />
              </center>
            </Grid>
            <Grid
              item
              xs={9}
              sm={9}
              md={9}
              lg={9}
            >
              <Typography
                sx={{
                // fontWeight: 'bold',
                  fontSize: 14,
                  marginTop: '4%',
                }}
              >
                <b>{`#${idx} - `}</b>
                {`${t('Compra de')} ${data.timestamp.toLocaleDateString()}`}
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Link>

    </Box>

  );
}
