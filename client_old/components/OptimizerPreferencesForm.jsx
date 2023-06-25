import { Meteor } from 'meteor/meteor';
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
import $ from 'jquery';
import { getPreviousPath } from '../lib/utils';
import { ResponsiveGrid } from './ResponsiveGrid';

const StyledMobileStepper = withStyles({
  root: {
    maxWidth: '90%',
    flexGrow: 1,
  },
  progress: {
    maxWidth: '90%',
    flexGrow: 1,
  },
})(MobileStepper);

const useStyles = makeStyles({
  selected: {
    border: '4px solid green',
    opacity: 1,
  },
  selectedDislike: {
    border: '2px solid green',
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

function DislikeCard({
  id, name, onClickDislikes, url,
}) {
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
            backgroundColor: 'white',
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

export function OptimizerPreferencesForm({
  open, onHandleClose, setOptimizerPreferences, optimizerPreferences, setPurchasePurpose,
}) {
  const { t } = useTranslation();
  // const [optimizerPreferences, setOptimizerPreferences] = useState(Meteor.user().optimizerPreferences);
  const [selectedDiet, setSelectedDiet] = useState((optimizerPreferences === undefined ? 'no_preferences' : optimizerPreferences.diet));
  const [activeStep, setActiveStep] = React.useState(0);
  const [dislikes, setDislikes] = React.useState(
    (optimizerPreferences === undefined ? [] : optimizerPreferences.dislikes),
  );
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    // Meteor.call('lastMinute.getTotalProducts', (error, result) => {
    //   if (error) console.log(error);
    //   else setTotalLastMinuteProducts(result);
    // });

    if (activeStep === 1 && optimizerPreferences.dislikes.length > 0) {
      optimizerPreferences.dislikes.forEach((element) => {
        $(`#${element}`).addClass(classes.selectedDislike);
      });
    }
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0 && optimizerPreferences) onHandleClose();
    else if (activeStep === 0 && !optimizerPreferences) history.push(getPreviousPath(history.location.pathname));
    else setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onClickCard = (event) => {
    setSelectedDiet(event.target.id);
  };

  const onClickDislikes = (event) => {
    if (!dislikes.includes(event.target.id)) {
      dislikes.push(event.target.id);
      setDislikes(dislikes);
      $(`#${event.target.id}`).addClass(classes.selectedDislike);
    } else {
      dislikes.splice(dislikes.indexOf(event.target.id), 1);
      setDislikes(dislikes);
      $(`#${event.target.id}`).removeClass(classes.selectedDislike);
    }
  };

  const dislikeCategories = Meteor.settings.public.dislikeCategories.map(
    (element) => (
      {
        component: <DislikeCard
          id={element.id}
          name={t(element.name)}
          onClickDislikes={onClickDislikes}
          url={element.img}
        />,
        key: element.id,
      }
    ),
  );

  const optimizePurchase = (preferences) => {
    Meteor.call('purchaseOptimizer.optimize', preferences, Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setPurchasePurpose(result);
    });
  };

  const storePurchaseOptimizerPreferences = () => {
    Meteor.call('purchaseOptimizer.storePreferences', dislikes, selectedDiet, Meteor.user()._id, (error) => {
      if (error) console.log(error);
    });
  };

  const handleOptimizePurchase = () => {
    const preferences = {
      dislikes,
      diet: selectedDiet,
    };
    setPurchasePurpose(undefined);
    storePurchaseOptimizerPreferences();
    optimizePurchase(preferences);
    setOptimizerPreferences(preferences);
    setActiveStep(0);
    onHandleClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      // onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: '#e6e6e6',
          boxShadow: 'none',
        },
      }}
    >
      <AppBar sx={{ position: 'relative', backgroundColor: 'transparent', boxShadow: 0 }}>
        <Toolbar>
          <Button onClick={handleBack}>
            <ArrowBackIosRoundedIcon color="primary" />
          </Button>
          <StyledMobileStepper
            variant="progress"
            steps={2}
            position="static"
            activeStep={activeStep}
            sx={{
              backgroundColor: '#e6e6e6',
            }}
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
              {
                Meteor.settings.public.diets.map((element) => (
                  <Grid
                    item
                  >
                    <DietCard
                      id={element.id}
                      url={element.img}
                      selectedDiet={selectedDiet}
                      onClickCard={onClickCard}
                      cardMessage={t(element.name)}
                    />
                  </Grid>
                ))
              }
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
      {
        activeStep === 1 && (
          <>
            <Box
              sx={{
                width: '100%',
                marginTop: 2,
              }}
            >
              <center>
                <Typography color="primary">
                  {t('¿Hay algún grupo de alimentos que no te guste?')}
                </Typography>
              </center>
            </Box>
            <div
              style={{
                paddingLeft: '10%',
                paddingRight: '10%',
                paddingTop: '20px',
              }}
            >
              <ResponsiveGrid
                containerSpacing={{
                  xs: 5, sm: 8, md: 10, lg: 10,
                }}
                containerColumns={{
                  xs: 12, sm: 12, md: 12, lg: 12,
                }}
                itemXs={4}
                itemSm={4}
                itemMd={3}
                itemLg={3}
                items={dislikeCategories}
              />
              <Button
                onClick={handleOptimizePurchase}
                size="small"
                variant="contained"
                sx={{
                  marginTop: 4,
                  width: '100%',
                  boxShadow: 5,
                  borderRadius: 10,
                }}
              >
                {t('Siguiente')}
              </Button>
            </div>
          </>
        )
      }
    </Dialog>
  );
}
