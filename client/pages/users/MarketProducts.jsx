import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  useParams,
} from 'react-router-dom';
import {
  TablePagination, Box, Backdrop, CircularProgress, Fab, Dialog, DialogContent, DialogTitle,
  DialogContentText, Alert,
} from '@mui/material';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { ResponsiveGrid } from '../../components/ResponsiveGrid';

import { MarketsOfferProductsCollection } from '../../../imports/db/collections';
import { ProductCard } from '../../components/ProductCard';

const pages = [20, 40, 60, 100];

export function MarketProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [productsPerPage, setProductsPerPage] = useState(pages[0]);
  const [page, setPage] = useState(0);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useTracker(() => {
    const handler = Meteor.subscribe('marketProducts', id);
    if (!handler.ready()) setProducts([]);
    else {
      const data = MarketsOfferProductsCollection.find().fetch();
      const components = [];
      data.forEach((element) => {
        components.push(
          {
            component: <ProductCard product={element} market />,
            key: element._id,
          },
        );
      });
      setProducts(components);
      setVisibleProducts(components.slice(
        page * productsPerPage,
        page * productsPerPage + productsPerPage,
      ));
      setLoading(false);
    }
  }, []);

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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        (visibleProducts.length === 0) && !loading && (
          <Alert severity="success">{t('No hay productos en oferta para este comercio de proximidad.')}</Alert>
        )
      }
      {
        (visibleProducts.length !== 0) && (
          <>
            <Fab
              color="primary"
              style={{
                top: 'auto',
                right: 10,
                left: 'auto',
                position: 'fixed',
              }}
              onClick={() => setOpenFilterModal(true)}
            >
              <FilterListOutlinedIcon />
            </Fab>
            <Dialog
              open={openFilterModal}
              // TransitionComponent={Transition}
              keepMounted
              onClose={() => setOpenFilterModal(false)}
            >
              <DialogTitle>Use Googles location service?</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Let Google help apps determine location. This means sending anonymous
                  location data to Google, even when no apps are running.
                </DialogContentText>
              </DialogContent>
            </Dialog>

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
        )
      }

    </>

  );
}
