import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import {
  Dialog, AppBar, Toolbar, IconButton, Typography,
  Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar, Badge,
  Box, Container, TextField, Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import SendIcon from '@mui/icons-material/Send';
import { ChatConversationsMessagesCollection } from '../../../imports/db/collections';
import { ChatMessage } from './ChatMessage';

export function Conversation({ data }) {
  const { userType } = Meteor.user().profile.attributes;
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [openMessages, setOpenMessages] = useState(false);

  const setMessagesAsRead = () => {
    Meteor.call('chat.readConversationMessages', data._id, Meteor.user()._id, (error) => {
      if (error) console.log(error);
    });
  };

  useEffect(() => {
    if (openMessages) setMessagesAsRead();
  }, [openMessages]);

  useTracker(() => {
    const handler = Meteor.subscribe('chatConversationMessages', data._id);
    // Store all messages
    if (!handler.ready()) setMessages([]);
    else {
      setMessages(
        ChatConversationsMessagesCollection.find({ chatId: data._id }, { sort: { createdTime: -1 } }).fetch(),
      );
    }
    // Obtain total unread messages
    ChatConversationsMessagesCollection.countDocuments({
      chatId: data._id,
      read: false,
      receiverId: Meteor.user()._id,
    }).then((r) => setUnreadMessages(r));
    // If conversation is openned mark messages as read
    if (openMessages) {
      setMessagesAsRead();
    }
  }, []);

  const onHandleSubmitMessage = () => {
    if (message !== '') {
      Meteor.call('chat.submitMessage', data, message, (error) => {
        if (error) console.log(error);
        else setMessage('');
      });
    }
  };

  return (
    <>

      <ListItem alignItems="flex-start" key={data._id} onClick={() => setOpenMessages(true)}>
        <ListItemAvatar>
          <Avatar alt="" src="" />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <>
              {data.title}
              {
                (unreadMessages !== 0) && (
                  <Badge badgeContent={unreadMessages} color="error" sx={{ marginLeft: 3 }} />
                )
              }
            </>

          )}
          secondary={(
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {(userType === 'cliente' ? data.receiverName : data.senderName)}

            </Typography>
          )}
        />
      </ListItem>
      <Divider component="li" />

      <Dialog
        fullScreen
        open={openMessages}
        onClose={() => setOpenMessages(false)}
        PaperProps={{
          style: {
            backgroundColor: '#fffff',
            boxShadow: 'none',
          },
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenMessages(false)}
              aria-label="close"
            >
              <ArrowBackIosRoundedIcon />
            </IconButton>

            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: 15,
              }}
            >
              {`${t('Asunto')} - ${data.title}`}
            </Typography>

          </Toolbar>
        </AppBar>
        <Container
          sx={{
            width: '100%',
            height: '100%',
            padding: 1,
            overflow: 'auto',
          }}
        >
          <Box
            style={{ overflow: 'auto' }}
            sx={{
              width: '100%',
              height: '90%',
              backgroundColor: '#E2E4E0',
              boxShadow: 10,
              borderRadius: 2,
            }}
          >
            <List style={{ maxHeight: '100%', overflow: 'auto' }}>
              {
                messages.map((element) => (
                  <Grid
                    container
                    sx={{
                      padding: 1,
                    }}
                    spacing={1}
                    justifyContent={(element.senderId === Meteor.user()._id ? 'right' : 'left')}
                    key={element._id}
                  >
                    <Grid
                      item
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      sx={{ marginTop: 1 }}
                    >
                      <ChatMessage data={element} key={element._id} />
                    </Grid>
                    {
                      element.senderId !== Meteor.user()._id && (
                        <Grid
                          item
                          xs={2}
                          sm={2}
                          md={2}
                          lg={2}
                          sx={{ marginTop: 1 }}
                        >
                          <Avatar />
                        </Grid>
                      )
                    }

                  </Grid>
                ))
              }

            </List>

          </Box>
          <Grid
            container
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{
                marginTop: 1,
              }}

            >
              <TextField
                variant="outlined"
                sx={{
                  width: '100%',
                  height: 'auto',

                }}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: 10,
                    backgroundColor: '#E2E4E0',
                    // border: 2,
                    // borderColor: mainTheme.palette.primary.main,
                  },
                  endAdornment: <SendIcon color="primary" onClick={onHandleSubmitMessage} />,
                }}

              />
            </Grid>
          </Grid>
        </Container>

      </Dialog>

    </>

  );
}
