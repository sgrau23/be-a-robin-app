import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import {
  TablePagination, AppBar, Box, Backdrop, CircularProgress, FormControl,
  InputLabel, Select, MenuItem, Chip, Typography, Divider, Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SyncIcon from '@mui/icons-material/Sync';
import SettingsIcon from '@mui/icons-material/Settings';
import { ResponsiveGrid } from './ResponsiveGrid';
import { ProductCard } from './ProductCard';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const useStyles = makeStyles({
  transparentSelect: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #484850',
      borderRadius: '5px 5px 0 0',
    },
  },
});

const pages = [20, 40, 60, 100];

export function OptimizerPurchaseList({
  purpose, openOptimizerPreferencesForm, setPurchasePurpose, optimizerPreferences,
}) {
  console.log(purpose);
  const { t } = useTranslation();
  const theme = useTheme();
  const [marketsFilter, setMarketsFilter] = useState(purpose.involvedMarkets);
  const [products, setProducts] = useState([]);
  const [productsPerPage, setProductsPerPage] = useState(pages[0]);
  const [page, setPage] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState([]);

  useEffect(() => {
    const components = [];
    Object.entries(purpose.purpose).forEach((element) => {
      element[1].products.forEach((item) => {
        components.push(
          {
            component: <ProductCard product={item} marketName={element[1].marketName} />,
            key: item.name,
          },
        );
      });
    });
    setProducts(components);
  }, []);

  useEffect(() => {
    setVisibleProducts(products.slice(
      page * productsPerPage,
      page * productsPerPage + productsPerPage,
    ));
  }, [products]);

  const optimizePurchase = () => {
    setPurchasePurpose(undefined);
    Meteor.call('purchaseOptimizer.optimize', optimizerPreferences, Meteor.user()._id, (error, result) => {
      if (error) console.log(error);
      else setPurchasePurpose(result);
    });
  };

  const onHandleMarketsFilter = (event) => {
    const {
      target: { value },
    } = event;
    if (value.includes('Todos')) setMarketsFilter(purpose.involvedMarkets);
    else setMarketsFilter(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    setVisibleProducts(products.slice(
      page * productsPerPage,
      page * productsPerPage + productsPerPage,
    ));
  }, [page, productsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeProductsPerPage = (event) => {
    setProductsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <AppBar sx={{
        position: 'relative', backgroundColor: 'transparent', boxShadow: 0, padding: 0,
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
            xs={8}
            sm={8}
            md={8}
            lg={8}
          >
            <FormControl fullWidth>
              <Typography color="primary" sx={{ marginBottom: 1 }}>
                Filtro mercados
              </Typography>
              <Select
                labelId="-select-label"
                multiple
                disableUnderline
                value={marketsFilter}
                label={t('Filtro mercados')}
                onChange={onHandleMarketsFilter}
                name="marketsFilter"
                variant="standard"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} sx={{ backgroundColor: 'theme.primary.main' }} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {(
              purpose.involvedMarkets.concat(['Todos']).map((marketName) => (
                <MenuItem
                  id={marketName}
                  value={marketName}
                  key={marketName}
                  style={getStyles(marketName, purpose.involvedMarkets, theme)}
                >
                  {marketName}
                </MenuItem>
              ))
            )}
              </Select>

            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={4}
            lg={4}
          >
            <Grid
              container
              justifyContent="flex-end"
              spacing={3}
            >
              <Grid
                item
              >
                <SyncIcon
                  color="primary"
                  onClick={() => optimizePurchase()}
                />
              </Grid>

              <Grid
                item
              >
                <SettingsIcon
                  color="primary"
                  onClick={() => openOptimizerPreferencesForm(true)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </AppBar>
      <Divider color="primary" sx={{ marginTop: 3 }} />
      <Box
        sx={{
          padding: 0,
        }}
      >
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={products.length}
          rowsPerPage={productsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeProductsPerPage}
          labelRowsPerPage={t('Productos por página')}
          sx={{
            marginTop: 3,
          }}
        />
        <ResponsiveGrid
          containerSpacing={{
            xs: 5, sm: 8, md: 15, lg: 15,
          }}
          containerColumns={{
            xs: 12, sm: 8, md: 12, lg: 12,
          }}
          itemXs={12}
          itemSm={4}
          itemMd={4}
          itemLg={3}
          items={visibleProducts}
        />
        {
          (visibleProducts.length !== 0) && (
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              count={products.length}
              rowsPerPage={productsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeProductsPerPage}
              labelRowsPerPage={t('Productos por página')}
              sx={{
                marginTop: 3,
              }}
            />
          )
        }
      </Box>
    </>
  );
}
