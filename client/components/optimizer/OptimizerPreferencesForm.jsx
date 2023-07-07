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
import { getPreviousPath } from '../../lib/utils';
import { ResponsiveGrid } from '../ResponsiveGrid';
import { ListFilter } from '../others/ListFilter';
import { DislikeCard } from './DislikeCard';

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
    // opacity: 1,
  },
  selectedDislike: {
    border: '2px solid green',
    // opacity: 1,
  },
});

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function DietCard({
  id, url, selectedDiet, onClickCard, cardMessage,
}) {
  console.log(id, selectedDiet);
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
          // opacity: 0.7,
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

export function OptimizerPreferencesForm({
  open, onHandleClose, setCustomerPreferences, preferences, setPurchasePurpose, pathname = '',
}) {
  console.log(preferences);
  const { t } = useTranslation();
  // const [optimizerPreferences, setOptimizerPreferences] = useState(Meteor.user().optimizerPreferences);
  const [selectedDiet, setSelectedDiet] = useState(((
    preferences.optimizerData && preferences.optimizerData.diet) ? preferences.optimizerData.diet : 11),
  );
  const [activeStep, setActiveStep] = useState(0);
  const [visibleDislike, setVisibleDislike] = useState();
  const [hasIntolerances, setHasIntolerances] = useState((!!((
    preferences.optimizerData && preferences.optimizerData.intolerances
    && preferences.optimizerData.intolerances.length > 0
  ))));
  const [intolerances, setIntolerances] = useState([]);
  const [productsSuperfamilies, setProductsSuperfamilies] = useState({});
  const [selectedIntolerances, setSelectedIntolerances] = useState(
    ((preferences.optimizerData
      && preferences.optimizerData.intolerances
    ) ? preferences.optimizerData.intolerances : []),
  );
  const [selectedDislikes, setSelectedDislikes] = useState(
    ((preferences.optimizerData
      && preferences.optimizerData.dislikes
    ) ? preferences.optimizerData.dislikes : []),
  );

  const history = useHistory();

  useEffect(() => {
    Meteor.call('inuba.getIntolerances', (error, result) => {
      if (error) console.log(error);
      else setIntolerances(result);
    });
    Meteor.call('inuba.getProductsSuperfamilies', (error, result) => {
      if (error) console.log(error);
      else setProductsSuperfamilies(result);
    });
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (visibleDislike) setVisibleDislike(undefined);
    else if (activeStep === 0 && preferences) onHandleClose();
    else if (activeStep === 0 && !preferences && pathname !== '') history.push(getPreviousPath(pathname));
    else if (activeStep === 0 && !preferences && pathname === '') onHandleClose();
    else setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onClickCard = (event) => {
    setSelectedDiet(parseInt(event.target.id, 10));
  };

  const onClickDislikes = (event) => {
    setVisibleDislike(event.target.id);
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

  const optimizePurchase = (data) => {
    Meteor.call('purchaseOptimizer.optimize', data, Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setPurchasePurpose(result);
    });
  };

  const storePurchaseOptimizerPreferences = () => {
    console.log(preferences);
    Meteor.call(
      'purchaseOptimizer.storePreferences',
      preferences.optimizerData.diet,
      preferences.optimizerData.dislikes,
      preferences.optimizerData.intolerances,
      Meteor.user()._id,
      (error) => {
        if (error) console.log(error);
      });
  };

  const handleOptimizePurchase = () => {
    preferences.optimizerData.diet = parseInt(selectedDiet, 10);
    preferences.optimizerData.dislikes = selectedDislikes;
    if (hasIntolerances) {
      preferences.optimizerData.intolerances = selectedIntolerances;
      setHasIntolerances((selectedIntolerances.length !== 0));
    } else {
      preferences.optimizerData.intolerances = [];
      setSelectedIntolerances([]);
    }
    if (pathname !== '') {
      setPurchasePurpose(undefined);
      optimizePurchase(preferences);
    }
    setActiveStep(0);
    setVisibleDislike();
    setCustomerPreferences(preferences);
    storePurchaseOptimizerPreferences();
    onHandleClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: '#ffff',
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
            steps={3}
            position="static"
            activeStep={activeStep}
            sx={{
              backgroundColor: '#ffffff',
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
                height: '85%',
              }}
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
              spacing={{
                xs: 2, sm: 2, md: 2, lg: 2,
              }}
              justifyContent="center"
              alignContent="center"
            >
              {
                Meteor.settings.public.diets.map((element) => (
                  <Grid
                    item
                    key={element.id}
                  >
                    <DietCard
                      id={parseInt(element.id, 10)}
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
                xs={12}
                sm={12}
                md={12}
                lg={12}
                justifyContent="center"
                display="flex"
              >
                <Button
                  onClick={handleNext}
                  size="small"
                  variant="contained"
                  sx={{
                    width: '75%',
                    boxShadow: 5,
                    borderRadius: 10,
                    bottom: '20px',
                    // margin: '10px',
                    position: 'fixed',
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
              }}
            >
              <center>
                <Typography
                  color="primary"
                >
                  {t('¿Tienes alguna intolerancia o alérgia?')}
                </Typography>
              </center>
            </Box>
            <Grid
              container
              sx={{
                // padding: '15px',
              }}
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
              spacing={{
                xs: 2, sm: 2, md: 2, lg: 2,
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Grid
                  container
                  columns={{
                    xs: 12, sm: 12, md: 12, lg: 12,
                  }}
                  spacing={{
                    xs: 2, sm: 2, md: 2, lg: 2,
                  }}
                  textAlign="center"
                >
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                  >
                    <Button
                      onClick={() => setHasIntolerances(true)}
                    >
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: 30,
                          color: (hasIntolerances ? 'primary.main' : 'gray'),
                        }}
                      >
                        {t('Sí')}
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                  >
                    <Button
                      onClick={() => setHasIntolerances(false)}
                    >
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: 30,
                          color: (!hasIntolerances ? 'primary.main' : 'gray'),
                        }}
                      >
                        {t('No')}
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box
              sx={{
                height: '75%',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              {
                hasIntolerances && (
                  <ListFilter
                    data={intolerances}
                    checked={selectedIntolerances}
                    setChecked={setSelectedIntolerances}
                  />
                )
              }
            </Box>
            <Box
              justifyContent="center"
              display="flex"
            >
              <Button
                onClick={handleNext}
                size="small"
                variant="contained"
                sx={{
                  width: '75%',
                  boxShadow: 5,
                  borderRadius: 10,
                  bottom: '20px',
                  // margin: '10px',
                  position: 'fixed',
                }}
              >
                {t('Siguiente')}
              </Button>
            </Box>

          </>

        )
      }
      {
        activeStep === 2 && (
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
            {
              visibleDislike ? (
                <Box
                  sx={{
                    height: '75%',
                    overflow: 'auto',
                    position: 'relative',
                  }}
                >
                  <ListFilter
                    data={(productsSuperfamilies[visibleDislike] ? productsSuperfamilies[visibleDislike] : [])}
                    checked={selectedDislikes}
                    setChecked={setSelectedDislikes}
                  />
                </Box>
              ) : (
                <Grid
                  container
                  sx={{
                    paddingTop: '15px',
                    padding: '15px',
                  }}
                  columns={{
                    xs: 12, sm: 12, md: 12, lg: 12,
                  }}
                  spacing={{
                    xs: 2, sm: 2, md: 2, lg: 2,
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    sx={{
                      marginBottom: '30px',
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
                  </Grid>
                </Grid>
              )
            }

            <Box
              justifyContent="center"
              display="flex"
            >
              <Button
                onClick={handleOptimizePurchase}
                size="small"
                variant="contained"
                sx={{
                  width: '75%',
                  boxShadow: 5,
                  borderRadius: 10,
                  bottom: '20px',
                  // margin: '10px',
                  position: 'fixed',
                }}
              >
                {
                  pathname !== '' ? (
                    t('Siguiente')
                  ) : (
                    t('Guardar')
                  )
                }
              </Button>
            </Box>
          </>
        )
      }
    </Dialog>
  );
}
