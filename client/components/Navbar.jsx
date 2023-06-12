import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Badge, Typography, Menu, Button,
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
import { breadcumbsMapping } from '../lib/breadcumbs';
import { getPreviousPath } from '../lib/utils';

export function Navbar() {
  // Translations
  const { t } = useTranslation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorNotifications, setAnchorNotifications] = React.useState(null);
  const { userType } = Meteor.user().profile.attributes;
  const history = useHistory();

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
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {
            useHistory().location.pathname !== '/' && (
              <Box
                sx={{
                  marginRight: 3,
                }}
              >
                <Link to={getPreviousPath(useHistory().location.pathname)}>
                  <ArrowBackIosRoundedIcon color="secondary" />
                </Link>
              </Box>
            )
          }

          {/* </Fab> */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              flexGrow: 1,
              // fontWeight: 600,
              // letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {t(breadcumbsMapping[useHistory().location.pathname])}
          </Typography>
          {/* <Avatar src="logo.jpg" sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} /> */}
          <Box sx={{ flexGrow: 0 }}>
            <PersonIcon
              onClick={handleOpenUserMenu}
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

          <Box sx={{ flexGrow: 0, marginLeft: '4%' }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon
                onClick={handleOpenNotifications}
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

        </Toolbar>
      </Container>
    </AppBar>
  );
}
