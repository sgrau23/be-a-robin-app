import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
// import { useTranslation } from 'react-i18next';
import {
  Fab, Dialog, AppBar, Toolbar, IconButton, Slide, Typography,
  Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar, Badge,
  Box, Container, TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import SendIcon from '@mui/icons-material/Send';
import { ChatConversationsMessagesCollection } from '../../imports/db/collections';
import { TextInput } from '../styles/styledComponents';
import { mainTheme } from '../styles/theme';

const defaultNewChat = {
  title: '',
  message: '',
  destinataryName: '',
  destinataryId: '',
};

export function ChatMessage({ data }) {
  return (
    // <TextField
    //   disabled
    //   multiline
    //   value={data.message}
    //   fullWidth
    //   InputProps={{
    //     sx: {
    //       borderRadius: 10,
    //       boxShadow: 5,
    //       backgroundColor: 'white',
    //       border: 2,
    //       borderColor: mainTheme.palette.primary.main,
    //       // color: 'black',
    //     },
    //   }}
    // >
    //   {data.message}
    // </TextField>
    <Typography
      // noWrap
      style={{
        wordWrap: 'break-word',
      }}
      sx={{
        // border: 2,
        // borderColor: 'black',
        width: 'auto',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 1,
        boxShadow: 5,
      }}
    >
      {data.message}
    </Typography>

  );
}
