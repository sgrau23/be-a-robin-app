import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Grid, Typography, Box,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import HistoryIcon from '@mui/icons-material/History';
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

export function ShoppingListTopNavbar({ onHandleTypeChange }) {
  // Translations
  const { t } = useTranslation();
  const classes = useStyles();

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
        height: '120px',
        padding: '8px',
      }}
      style={{ maxWidth: '100%' }}
    >
      <Toolbar disableGutters>
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
              {t('Lista de la compra')}
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
              sx={{
                borderRadius: 5,
                backgroundColor: 'primary.main',
                boxShadow: 5,
                // marginTop: '10px',
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
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
                    color: 'black',
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 10,
                    color: 'black',
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
      </Toolbar>
    </AppBar>
  );
}
