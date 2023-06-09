import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
} from 'react-router-dom';
import {
  AppBar, Grid, Typography, Box, Fab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Toolbar from '@mui/material/Toolbar';
import HistoryIcon from '@mui/icons-material/History';
import TuneIcon from '@mui/icons-material/Tune';
import { makeStyles } from '@material-ui/core';

// Define tab classes
const useStyles = makeStyles({
  selected: {
    backgroundColor: '#ffffff',
  },
  notSelected: {
    backgroundColor: '#e6e6e6',
  },
});

export function ShoppingListTopNavbar({
  text, onHandleTypeChange, historical = false, historicalDetails = false,
}) {
  // Translations
  const { t } = useTranslation();
  const classes = useStyles();

  const onHandleFilters = () => {
    console.log('FILTERS');
  };

  return (
    <AppBar
      sx={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 'auto',
        position: 'fixed',
        backgroundColor: 'secondary.main',
        display: 'flex',
        boxShadow: 0,
        height: (!historical ? '120px' : '60px'),
        padding: '8px',
      }}
      style={{ maxWidth: '100%' }}
    >
      <Toolbar disableGutters>
        {
          !historical && (
            <Grid
              container
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
              spacing={{
                xs: 1, sm: 1, md: 1, lg: 1,
              }}
            >
              <Grid
                item
                xs={9}
                sm={10}
                md={11}
                lg={11}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 25,
                    color: 'black',
                  }}
                >
                  {t(text)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sm={2}
                md={1}
                lg={1}
              >
                <Box
                  component={Link}
                  sx={{
                    borderRadius: 5,
                    backgroundColor: 'primary.main',
                    boxShadow: 5,
                    // marginTop: '10px',
                  }}
                  style={{ textDecoration: 'none', color: 'white' }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  to="/historicalShoppingList"
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    padding: '5px',
                  }}
                  >
                    <HistoryIcon
                      sx={{
                        height: '15px',
                        width: '15px',
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 10,
                      }}
                    >
                      {t('Historial')}
                    </Typography>
                  </div>

                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Box
                  maxWidth
                  sx={{
                    backgroundColor: 'secondary.main',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      padding: '8px',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#e6e6e6',
                        width: '100%',
                        borderRadius: 5,
                      }}
                    >
                      <Grid
                        container
                        columns={{
                          xs: 12, sm: 12, md: 12, lg: 12,
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
                          <Box
                            sx={{
                              margin: '8px',
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                borderRadius: 5,
                                // padding: '5px',
                              }}
                              className={classes.selected}
                              id="pendingButton"
                            >

                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: 10,
                                  color: 'black',
                                }}
                                id="pending"
                                onClick={onHandleTypeChange}
                              >
                                {t('PENDIENTE')}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                        >
                          <Box
                            sx={{
                              margin: '8px',
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                borderRadius: 5,
                                // padding: '5px',
                                marginRight: '5px',
                              }}
                              id="purchasedButton"
                            >
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: 10,
                                  color: 'black',
                                }}
                                id="purchased"
                                onClick={onHandleTypeChange}
                              >
                                {t('COMPRADO')}
                              </Typography>
                            </Box>
                          </Box>

                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>

              </Grid>
            </Grid>
          )
        }
        {
          historical && (
            <Grid
              container
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
              spacing={{
                xs: 1, sm: 1, md: 1, lg: 1,
              }}
            >

              <Grid
                item
                xs={(historicalDetails ? 2 : 1)}
                sm={(historicalDetails ? 2 : 1)}
                md={(historicalDetails ? 2 : 1)}
                lg={(historicalDetails ? 2 : 1)}
              >
                {
                  historicalDetails && (
                    <Link to="/historicalShoppingList">
                      <Fab
                        color="secondary"
                        style={{
                        // top: 30,
                        // left: 15,
                        // right: 'auto',
                        // position: 'fixed',
                          height: '5px',
                          width: '35px',
                          marginBottom: '10px',
                        }}
                      >
                        <ArrowBackIcon color="black" fontSize="small" />
                      </Fab>
                    </Link>
                  )
                }

              </Grid>
              <Grid
                item
                xs={(historicalDetails ? 8 : 9)}
                sm={(historicalDetails ? 8 : 9)}
                md={(historicalDetails ? 8 : 9)}
                lg={(historicalDetails ? 8 : 9)}
                sx={{
                  marginLeft: '8px',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: (!historicalDetails ? 25 : 20),
                    color: 'black',
                  }}
                >
                  {t(text)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                lg={1}
              >
                <Box
                  onClick={onHandleFilters}
                >
                  <TuneIcon color="primary" />
                </Box>
              </Grid>
            </Grid>
          )
        }
      </Toolbar>
    </AppBar>
  );
}
