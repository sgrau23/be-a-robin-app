import React from 'react';
import {
  Grid, Box,
} from '@mui/material';
import { IconMarketType } from '../icons/IconMarketType';

export function MarketTypes({ marketTypeSelected, setMarketTypeSelected }) {
  const onHandleMarketType = (event) => {
    if (event.target.id !== '') setMarketTypeSelected(event.target.id);
  };

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
    >
      <Grid
        container
        columns={{
          xs: 12, sm: 12, md: 12, lg: 12,
        }}
        columnSpacing={{
          xs: 2, sm: 2, md: 2, lg: 2,
        }}
      >
        <Grid
          item
          xs={3}
          sm={2}
          md={1}
          lg={1}

        >
          <IconMarketType
            id="frescos"
            image="markets-icon.png"
            text="Frescos"
            isSelected={marketTypeSelected === 'frescos'}
            onHandleClick={onHandleMarketType}
          />
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          md={1}
          lg={1}

        >
          <IconMarketType
            id="eco"
            image="eco-icon.png"
            text="Tiendas ECO"
            isSelected={marketTypeSelected === 'eco'}
            onHandleClick={onHandleMarketType}
          />
        </Grid>
        <Grid
          item
          xs={3}
          sm={2}
          md={1}
          lg={1}
        >
          <IconMarketType
            id="secos"
            image="supermarkets-icon.png"
            text="Secos"
            isSelected={marketTypeSelected === 'secos'}
            onHandleClick={onHandleMarketType}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
