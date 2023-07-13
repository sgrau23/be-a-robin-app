import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogTitle, DialogContentText, Box,
  DialogContent, Typography, Dialog,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export function DialogInformative({
  open, onHandleClose, data, title,
}) {
  // Translations
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        <CloseRoundedIcon
          style={{
            cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',
          }}
          onClick={onHandleClose}
        />
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 20,
          }}
        >
          {t(title)}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {
            data.map((element) => (
              <Box
                key={element.title}
                component="span"
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: 'black',
                    marginTop: '15px',
                  }}
                >
                  {element.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    marginTop: '5px',
                  }}
                >
                  {element.text}
                </Typography>
              </Box>
            ))
          }
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
