import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog, Slide, AppBar, Toolbar, MobileStepper, Button, Typography,
  Grid, Box,
} from '@mui/material';

import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
  useHistory,
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { getPreviousPath } from '../lib/utils';

const StyledMobileStepper = withStyles({
  root: {
    maxWidth: '100%',
    flexGrow: 1,
  },
  progress: {
    width: '95%',
  },
})(MobileStepper);

const useStyles = makeStyles({
  selected: {
    border: '4px solid green',
    opacity: 1,
  },
});

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function DietCard({
  id, url, selectedDiet, onClickCard, cardMessage,
}) {
  const classes = useStyles();
  return (
    <div
      style={{
        position: 'relative',
        textAlign: 'center',
        color: 'white',
      }}
    >
      <Box
        onClick={onClickCard}
        className={(id === selectedDiet ? classes.selected : null)}
        id={id}
        component="img"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 4,
          boxShadow: 6,
          opacity: 0.7,
        }}
        alt=""
        src={url}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '20%',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', opacity: 1 }}
        >
          {cardMessage}
        </Typography>
      </div>
    </div>

  );
}

export function OptimizerPreferencesForm({ open, handleClose }) {
  const { t } = useTranslation();
  const [optimizerPreferences, setOptimizerPreferences] = useState(Meteor.user().optimizerPreferences);
  const [selectedDiet, setSelectedDiet] = useState('no_preferences');
  const [activeStep, setActiveStep] = React.useState(0);
  const history = useHistory();

  useEffect(() => {
    // Meteor.call('lastMinute.getTotalProducts', (error, result) => {
    //   if (error) console.log(error);
    //   else setTotalLastMinuteProducts(result);
    // });
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) history.push(getPreviousPath(history.location.pathname));
    else setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onClickCard = (event) => {
    setSelectedDiet(event.target.id);
    console.log(selectedDiet);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', backgroundColor: 'transparent', boxShadow: 0 }}>
        <Toolbar>
          <Button onClick={handleBack}>
            <ArrowBackIosRoundedIcon color="primary" />
          </Button>

          <StyledMobileStepper
            variant="progress"
            steps={5}
            position="static"
            activeStep={activeStep}
            sx={{ maxWidth: '600', flexGrow: 1 }}
          />
        </Toolbar>
      </AppBar>
      {
        activeStep === 0 && (

          <>
            <Box
              sx={{
                width: '100%',
                marginTop: 2,
              }}
            >
              <center>
                <Typography color="primary">
                  {t('¿Que tipo de dieta quieres seguir?')}
                </Typography>
              </center>
            </Box>
            <Grid
              container
              sx={{
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
              }}
              spacing={2}
              direction="column"
              justifyContent="center"
              alignContent="center"
            >
              <Grid
                item
              >
                <DietCard
                  id="no_preferences"
                  url="no_preferences_diet.png"
                  selectedDiet={selectedDiet}
                  onClickCard={onClickCard}
                  cardMessage={t('Sin preferencias')}
                />
              </Grid>
              <Grid
                item
              >
                <DietCard
                  id="mediterranean"
                  url="mediterranean_diet.png"
                  selectedDiet={selectedDiet}
                  onClickCard={onClickCard}
                  cardMessage={t('Mediterránea')}
                />
              </Grid>
              <Grid
                item
              >
                <DietCard
                  id="pescatarian"
                  url="pescatarian_diet.png"
                  selectedDiet={selectedDiet}
                  onClickCard={onClickCard}
                  cardMessage={t('Pescatariana')}
                />
              </Grid>
              <Grid
                item
              >
                <DietCard
                  id="vegetarian"
                  url="vegetarian_diet.png"
                  selectedDiet={selectedDiet}
                  onClickCard={onClickCard}
                  cardMessage={t('Vegetariana')}
                />
              </Grid>
              <Grid
                item
              >
                <DietCard
                  id="vegan"
                  url="vegan_diet.png"
                  selectedDiet={selectedDiet}
                  onClickCard={onClickCard}
                  cardMessage={t('Vegana')}
                />
              </Grid>
              <Grid
                item
                sx={{
                  marginTop: 2,
                }}
              >
                <Button
                  onClick={handleNext}
                  size="small"
                  variant="contained"
                  sx={{
                    width: '100%',
                    boxShadow: 5,
                    borderRadius: 10,
                  }}
                >
                  {t('Siguiente')}
                </Button>
              </Grid>
            </Grid>
          </>

        )
      }
    </Dialog>
  );
}
