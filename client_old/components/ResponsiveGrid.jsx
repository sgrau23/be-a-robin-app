import React from 'react';

import {
  Grid,
} from '@mui/material';

export function ResponsiveGrid({
  containerSpacing, containerColumns, itemXs, itemSm, itemMd, itemLg,
  items,
}) {
  return (
    <Grid
      container
      spacing={containerSpacing}
      columns={containerColumns}
      sx={{
        paddingTop: 2,
      }}
    >
      {(

        items.map((element) => (
          <Grid
            item
            key={element.key}
            xs={itemXs}
            sm={itemSm}
            md={itemMd}
            lg={itemLg}
          >
            {element.component}
          </Grid>
        ))
      )}
    </Grid>
  );
}
