import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import {
  useParams, useHistory, Link,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Grid, Fab, Typography, Box,
  Backdrop, CircularProgress, Badge,
} from '@mui/material';
// import { DashboardCard } from '../../components/DashboardCard';
// import { ResponsiveGrid } from '../../components/ResponsiveGrid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import $ from 'jquery';
import { makeStyles } from '@material-ui/core';
import {
  SupermarketsCollection,
  SupermarketProductsCollection,
  MarketsOfferProductsCollection,
  MarketsLastMinuteProductsCollection,
} from '../../../../imports/db/collections';
import { ProductCard } from '../../../components/products/ProductCard';

const useStyles = makeStyles({
  selected: {
    backgroundColor: '#ffffff',
  },
  notSelected: {
    backgroundColor: '#e6e6e6',
  },
});

export function ProductList() {
  const { t } = useTranslation();
  const { id } = useParams();
  const type = useHistory().location.pathname.split('/')[1];
  const [marketData, setMarkeData] = useState();
  const [products, setProducts] = useState([]);
  const [lastminuteProducts, setLastminuteProduts] = useState([]);
  const [offerTypeSelected, setOfferTypeSelected] = useState('offer');
  const classes = useStyles();

  // Get current market data
  useTracker(() => {
    let handler;
    if (type === 'supermarkets') handler = Meteor.subscribe('supermarkets');
    else handler = Meteor.subscribe('markets');

    if (!handler.ready()) setMarkeData();
    else {
      let data;
      if (type === 'supermarkets') {
        data = SupermarketsCollection.find(
          {
            'profile.attributes.marketName': id,
          },
        ).fetch().pop();
      } else {
        data = Meteor.users.find(
          {
            'profile.attributes.userType': 'comercio',
            'profile.attributes.marketName': id,
            'profile.attributes.eco': (type === 'eco' ? 'yes' : 'no'),
          },
        ).fetch().pop();
      }
      console.log(data);
      setMarkeData(data);
    }
  }, []);

  // Get current market products
  useTracker(() => {
    let handler;
    if (type === 'supermarkets') handler = Meteor.subscribe('supermarketProducts', id, parseInt(Meteor.user().profile.attributes.postalCode, 10));
    else handler = Meteor.subscribe('marketProducts', id);
    if (!handler.ready()) setProducts([]);
    else {
      let data;
      if (type === 'supermarkets') data = SupermarketProductsCollection.find().fetch();
      else data = MarketsOfferProductsCollection.find().fetch();
      console.log(data);
      setProducts(data);
    }
  }, []);

  // Get last minute market products
  useTracker(() => {
    if (type !== 'supermarkets') {
      const handler = Meteor.subscribe('marketLastMinuteProducts', id);
      if (!handler.ready()) setProducts([]);
      else {
        const data = MarketsLastMinuteProductsCollection.find({ marketName: id }).fetch();
        setLastminuteProduts(data);
      }
    }
  }, []);

  // Change offer type
  const onHandleOfferType = (event) => {
    if (event.target.id !== offerTypeSelected) {
      setOfferTypeSelected(event.target.id);
    }
  };

  useEffect(() => {
    // Remove previous classes
    $('#offerButton').removeClass((offerTypeSelected === 'offer' ? classes.notSelected : classes.selected));
    $('#lastminuteButton').removeClass((offerTypeSelected === 'lastminute' ? classes.notSelected : classes.selected));
    // Add new classes
    $('#offerButton').addClass((offerTypeSelected === 'offer' ? classes.selected : classes.notSelected));
    $('#lastminuteButton').addClass((offerTypeSelected === 'lastminute' ? classes.selected : classes.notSelected));
  }, [offerTypeSelected]);

  //   useEffect(() => {
  //     console.log(marketTypeSelected);
  //   }, [marketTypeSelected]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!marketData}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        marketData && (
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
                style={{
                  maxWidth: '100%',
                }}
              >
                <img
                  src={marketData.profile.image}
                  alt=""
                  style={{
                    height: '150px',
                    width: '100%',
                  }}
                />
              </Box>

              <Link to="/">
                <Fab
                  color="secondary"
                  style={{
                    top: 30,
                    left: 15,
                    right: 'auto',
                    position: 'fixed',
                    height: '10px',
                    width: '35px',
                  }}
                >
                  <ArrowBackIcon color="black" fontSize="small" />
                </Fab>
              </Link>
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
                style={{
                  maxWidth: '100%',
                }}
              >
                <Box
                  sx={{
                    padding: '8px',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {t(marketData.profile.attributes.marketName)}
                  </Typography>
                  <Typography
                    sx={{
                    // fontWeight: 'bold',
                      fontSize: 10,
                    }}
                  >
                    Horario: 9:00h a 13:00h - 17:00h a 20:00h
                  </Typography>
                  <Typography
                    sx={{
                    // fontWeight: 'bold',
                      fontSize: 10,
                    }}
                  >
                    Se encuentra a 300 metros de tu localización.
                  </Typography>
                </Box>
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
                            }}
                            className={classes.selected}
                            id="offerButton"
                          >

                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: 10,
                              }}
                              id="offer"
                              onClick={onHandleOfferType}
                            >
                              {t('OFERTAS')}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 10,
                              }}
                              color="black"
                            >
                              {t('Semanales')}
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
                          <Badge badgeContent={lastminuteProducts.length} color="error" sx={{ marginLeft: 3, float: 'right' }} />
                          <Box
                            sx={{
                              width: '100%',
                              borderRadius: 5,
                            }}
                            id="lastminuteButton"
                            className={classes.notSelected}
                          >
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: 10,
                              }}
                              id="lastminute"
                              onClick={onHandleOfferType}
                            >
                              {t('LAST MINUTE')}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 10,
                              }}
                              color="black"
                            >
                              {t('Diarias')}
                            </Typography>
                          </Box>
                        </Box>

                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Box
              style={{
                overflow: 'auto',
                maxHeight: '100vh',
              }}
            >
              {
                offerTypeSelected === 'offer' ? (
                  products.map((product) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      key={product.name}
                    >
                      <ProductCard product={product} />
                    </Grid>
                  ))
                ) : (
                  lastminuteProducts.map((lastminuteProduct) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      key={lastminuteProduct.name}
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
                        <ProductCard product={lastminuteProduct} />
                      </Grid>
                    </Grid>
                  ))
                )
              }
            </Box>

          </Grid>
        )
      }

    </>
  // <Grid
  //   item
  //   xs={12}
  //   sm={12}
  //   md={12}
  //   lg={12}
  // //   key={market.key}
  // >
  //   <Box
  //     maxWidth
  //     sx={{
  //       backgroundColor: 'secondary.main',
  //       width: '100%',
  //     }}
  //     style={{
  //       maxWidth: '100%',
  //     }}
  //   >
  //     <Box
  //       sx={{
  //         padding: '8px',
  //       }}
  //     >
  //       <Grid
  //         container
  //         columns={{
  //           xs: 12, sm: 12, md: 12, lg: 12,
  //         }}
  //       >
  //         <Grid
  //           item
  //           xs={12}
  //           sm={12}
  //           md={12}
  //           lg={12}
  //         >
  //           <img
  //             src={data.profile.image}
  //             alt=""
  //             style={{
  //               height: '150px',
  //               width: '100%',
  //               borderRadius: 6,
  //             }}
  //           />
  //         </Grid>
  //         <Grid
  //           item
  //           xs={8}
  //           sm={8}
  //           md={8}
  //           lg={8}
  //         >
  //           <Typography
  //             sx={{
  //               fontWeight: 'bold',
  //               fontSize: 12,
  //             }}
  //           >
  //             {t(data.profile.attributes.marketName)}
  //           </Typography>
  //         </Grid>
  //         <Grid
  //           item
  //           xs={4}
  //           sm={4}
  //           md={4}
  //           lg={4}
  //         >
  //           <Typography
  //             sx={{
  //               fontStyle: 'italic',
  //               fontSize: 12,
  //               textAlign: 'right',
  //             }}
  //           >
  //             {t('a 300 metros')}
  //           </Typography>
  //         </Grid>

  //       </Grid>
  //     </Box>
  //   </Box>
  // </Grid>
  );
}
