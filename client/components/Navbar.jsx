import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Badge, Typography, Menu, Button, Grid,
} from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {
  Link, useHistory,
} from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getPreviousPath } from '../lib/utils';
import { ShoppingCartCollection } from '../../imports/db/collections';
import { BreadCrumb } from './BreadCrumb';

export function Navbar() {
  // Translations
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorNotifications, setAnchorNotifications] = React.useState(null);
  const { userType } = Meteor.user().profile.attributes;
  const history = useHistory();

  const [totalProductsCart, setTotalProductsCart] = useState(0);
  // Translations
  useTracker(() => {
    const handler = Meteor.subscribe('shoppingCart', Meteor.user()._id);
    if (!handler.ready()) setTotalProductsCart(0);
    else setTotalProductsCart(ShoppingCartCollection.find().fetch().length);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotifications = (event) => {
    setAnchorNotifications(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotifications = () => {
    setAnchorNotifications(null);
  };

  const onHandleLogout = () => {
    Meteor.logout();
    history.push('/');
  };

  return (
    <AppBar sx={{ backgroundColor: '#e6e6e6', boxShadow: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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
              xs={2}
              sm={2}
              md={2}
              lg={2}
            >
              {
                useHistory().location.pathname !== '/' && (
                  <Box
                    sx={{
                      marginRight: 3,
                    }}
                  >
                    <Link to={getPreviousPath(useHistory().location.pathname)}>
                      <ArrowBackIosRoundedIcon color="primary" />
                    </Link>
                  </Box>
                )
              }
            </Grid>
            <Grid
              item
              xs={7}
              sm={7}
              md={7}
              lg={7}
            />
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              lg={1}
            >
              <Box sx={{ flexGrow: 0 }}>
                <PersonIcon
                  onClick={handleOpenUserMenu}
                  color="primary"
                />
                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem key="userProfile">
                    <Typography textAlign="center">
                      {t('Perfil Usuario')}
                    </Typography>
                  </MenuItem>
                  <MenuItem key="logout" onClick={onHandleLogout}>
                    <Typography textAlign="center">
                      {t('Cerrar Sessión')}
                    </Typography>
                  </MenuItem>
                </Menu>

              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              lg={1}
            >
              <Box sx={{ flexGrow: 0 }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon
                    onClick={handleOpenNotifications}
                    color="primary"
                  />
                </Badge>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorNotifications}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorNotifications)}
                  onClose={handleCloseNotifications}
                />
              </Box>
            </Grid>
            {
              userType === 'cliente' && (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                >
                  <Box>

                    <Box sx={{ flexGrow: 0 }}>
                      <Link to="/shoppingCart">
                        <Badge badgeContent={totalProductsCart} color="error">
                          <ShoppingCartIcon color="primary" />
                        </Badge>
                      </Link>
                    </Box>
                  </Box>
                </Grid>
              )
            }
          </Grid>

          {/* </Fab> */}
          {/* <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              flexGrow: 1,
              // fontWeight: 600,
              // letterSpacing: '.3rem',
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            {t(breadcumbsMapping[useHistory().location.pathname])}
          </Typography> */}
          {/* <Avatar src="logo.jpg" sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} /> */}

        </Toolbar>
        <BreadCrumb paths={useHistory().location.pathname.split('/')} />
      </Container>
    </AppBar>
  );
}
