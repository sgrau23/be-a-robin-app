import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog, Slide, AppBar, Toolbar, MobileStepper, Button, Typography,
  Grid, Box, TextField, InputAdornment,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Divider,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
  useHistory,
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import $ from 'jquery';
import { getPreviousPath } from '../../lib/utils';
import { ResponsiveGrid } from '../ResponsiveGrid';
import { ListFilter } from '../others/ListFilter';

export function DislikeCard({
  id, name, onClickDislikes, url,
}) {
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
      >
        <Box
          id={id}
          name={name}
          key={id}
          sx={{
            width: '80px',
            height: '80px',
            borderRadius: 4,
            boxShadow: 6,
            padding: 1,
            backgroundColor: '#e6e6e6',
          }}
        >
          <Box
            onClick={onClickDislikes}
            component="img"
            id={id}
            name={name}
            sx={{
              width: '70px',
              height: '70px',
              backgroundColor: 'transparent',
            }}
            alt=""
            src={url}
          />
        </Box>

      </Grid>
      <Grid
        item
      >
        <center>
          <Typography color="inherit">
            {name}
          </Typography>
        </center>

      </Grid>
    </Grid>
  );
}
