import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Grid, Typography, Box, Badge,
} from '@mui/material';
import {
  MarketsLastMinuteProductsCollection,
} from '../../../imports/db/collections';

export function MarketCard({ data, type }) {
  const { t } = useTranslation();
  const [totalLastMinuteProducts, setTotalLastMinuteProducts] = useState(0);

  // Get last minute market products
  useTracker(() => {
    if (type !== 'supermarkets') {
      const handler = Meteor.subscribe('marketLastMinuteProducts', data.profile.attributes.marketName);
      if (!handler.ready()) setTotalLastMinuteProducts(0);
      else {
        const total = MarketsLastMinuteProductsCollection.find({
          marketName: data.profile.attributes.marketName,
        }).fetch().length;
        setTotalLastMinuteProducts(total);
      }
    }
  }, []);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
    >
      <Link
        to={`/${type}/${data.profile.attributes.marketName}`}
        style={{ color: 'inherit', textDecoration: 'inherit' }}
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
            <Grid
              container
              columns={{
                xs: 12, sm: 12, md: 12, lg: 12,
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Badge
                  badgeContent={totalLastMinuteProducts}
                  color="error"
                  sx={{ marginRight: '10px', float: 'right' }}
                />
                <img
                  src={data.profile.image}
                  alt=""
                  style={{
                    height: '150px',
                    width: '100%',
                    borderRadius: 6,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                lg={8}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {t(data.profile.attributes.marketName)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
              >
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    fontSize: 12,
                    textAlign: 'right',
                  }}
                >
                  {t('a 300 metros')}
                </Typography>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Link>
    </Grid>
  );
}
