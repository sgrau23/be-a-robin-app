import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import {
  Grid, Typography, Box,
} from '@mui/material';

const useStyles = makeStyles({
  selected: {
    border: '2px solid green',
  },
});

export function IconMarketType({
  image, text, isSelected, id, onHandleClick,
}) {
  const { t } = useTranslation();
  const classes = useStyles();
  //   const { t } = useTranslation();
  // const SupermarketsCollectionClient = Mongo.Collection('SupermarketsCollection_Client');

  return (
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
        <center>
          <Box
            sx={{
              backgroundColor: '#e6e6e6',
              borderRadius: 2,
              boxShadow: 5,
              margin: 1,
              height: '55px',
              width: '55px',
            }}
            className={(isSelected ? classes.selected : null)}
            onClick={onHandleClick}
          >
            <img
              id={id}
              src={image}
              alt=""
              style={{
                marginTop: '12px',
              }}
            />
          </Box>
        </center>

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
            fontSize: 12,
            fontWeight: 'bold',
          }}
          id={id}
          onClick={onHandleClick}
        >
          {t(text)}
        </Typography>

      </Grid>
    </Grid>

  );
}
