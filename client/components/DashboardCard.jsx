import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card, CardContent, CardMedia, CardActions, Button, Typography, Badge, Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { CardImage } from './CardImage';
import { mainTheme } from '../styles/theme';

export function DashboardCard({
  logo, contentText, route, notifications = 0,
}) {
  const { t } = useTranslation();
  return (
    <Box>
      <Card
        sx={{
          width: '100%',
          background: mainTheme.palette.secondary.main,
          boxShadow: '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)',
          borderRadius: 2,
        // height: '50%',
        }}
      >
        <CardMedia>
          <CardImage url={logo} />
        </CardMedia>
        <CardContent
          sx={{
            color: mainTheme.typography.color,
            paddingTop: 1,
          }}
        >
          <Typography
            align="center"
            variant="h6"
            sx={{ fontWeight: 'bold' }}
          >
            {t(contentText)}
            {
               (notifications !== 0) && (
                 <Badge badgeContent={notifications} color="error" sx={{ marginLeft: 3 }} />
               )
             }
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            alignItems: 'stretch',
            justifyContent: 'center',
            paddingBottom: 2,
          }}
        >
          <Button
            component={Link}
            to={route}
            size="small"
            variant="contained"
            sx={{
              width: '50%',
              boxShadow: 5,
              borderRadius: 10,
            }}
          >
            {t('Ver')}
          </Button>
        </CardActions>
      </Card>
    </Box>

  );
  // return (
  //   <Box
  //     component={Link}
  //     to={route}
  //   >
  //     <Box
  //       // id={id}
  //       component="img"
  //       sx={{
  //         width: '100%',
  //         height: '100%',
  //         borderRadius: 4,
  //         boxShadow: 6,
  //         // opacity: 0.7,
  //       }}
  //       alt=""
  //       src={logo}
  //     />
  //     {/* <div
  //       style={{
  //         position: 'absolute',
  //         bottom: '5%',
  //         left: '20%',
  //       }}
  //     >
  //       <Typography
  //         variant="h6"
  //         sx={{ fontWeight: 'bold', opacity: 1 }}
  //       >
  //         {cardMessage}
  //       </Typography>
  //     </div> */}
  //   </Box>
  // );
}
