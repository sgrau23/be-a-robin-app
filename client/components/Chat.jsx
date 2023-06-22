import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
// import { useTranslation } from 'react-i18next';
import {
  Fab, Dialog, AppBar, Toolbar, IconButton, Slide, Typography,
  Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar,
  DialogTitle, DialogContent, Grid, CardActions, Button, MenuItem, InputLabel,
  FormControl, Select,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ChatConversationsCollection } from '../../imports/db/collections';
import { TextInput } from '../styles/styledComponents';
import { Conversation } from './Conversation';

const defaultNewChat = {
  title: '',
  message: '',
  destinataryName: '',
};

export function Chat() {
  const { userType } = Meteor.user().profile.attributes;
  const { name } = Meteor.user().profile;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [openNewChatModal, setOpenNewChatModal] = useState(false);
  const [newChatData, setNewChatData] = useState(defaultNewChat);

  useEffect(() => {
    Meteor.call('markets.getAll', (error, result) => {
      if (error) console.log(error);
      else {
        setMarkets(result);
      }
    });
  }, []);

  useTracker(() => {
    const handler = Meteor.subscribe('chatConversations', Meteor.user()._id, userType);
    let data = [];
    if (!handler.ready()) setConversations(data);
    else if (userType === 'cliente') data = ChatConversationsCollection.find({ senderId: Meteor.user()._id }).fetch();
    else data = ChatConversationsCollection.find({ receiverId: Meteor.user()._id }).fetch();
    setConversations(data);
  }, []);

  const onHandleNewChat = (e) => {
    Meteor.call(
      'chat.createConversation',
      newChatData,
      (error) => {
        if (error) console.log(error);
        else {
          setOpenNewChatModal(false);
          setNewChatData(defaultNewChat);
        }
      });
    e.preventDefault();
    return false;
  };

  const onHandleNewChatData = (e) => {
    setNewChatData({ ...newChatData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Fab
        color="primary"
        style={{
          bottom: 70,
          right: 5,
          left: 'auto',
          position: 'fixed',
          height: '50px',
          width: '50px',
        }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon color="secondary" />
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        // TransitionComponent={Transition}
        PaperProps={{
          style: {
            backgroundColor: '#e6e6e6',
            boxShadow: 'none',
          },
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Typography>
              {`Chat ${name}`}
            </Typography>

          </Toolbar>
        </AppBar>
        <List sx={{ width: '100%' }}>
          {
            (conversations.length !== 0) && (

              conversations.map((element) => (
                <Conversation data={element} key={element._id} />
              ))
            )
          }
          {
            (conversations.length === 0) && (
              <ListItem alignItems="flex-start">
                <ListItemText>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {/* {t('No tienes conversaciones')} */}
                  </Typography>
                </ListItemText>

              </ListItem>

            )
          }
        </List>
        {
          userType === 'cliente' && (
            <>
              <Fab
                color="inherit"
                style={{
                  bottom: 20,
                  right: 20,
                  left: 'auto',
                  position: 'fixed',
                }}
                onClick={() => setOpenNewChatModal(true)}
              >
                <AddIcon />
              </Fab>
              <Dialog
                open={openNewChatModal}
                // TransitionComponent={Transition}
                PaperProps={{
                  style: {
                    backgroundColor: '#e6e6e6',
                    boxShadow: 'none',
                  },
                }}
                keepMounted
              >
                <DialogTitle>
                  <CloseRoundedIcon
                    style={{
                      cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',
                    }}
                    onClick={() => setOpenNewChatModal(false)}
                  />
                  {t('Iniciar nueva conversación:')}
                </DialogTitle>
                <DialogContent>
                  <form onSubmit={onHandleNewChat}>
                    <Grid
                      container
                      columns={{
                        xs: 12, sm: 12, md: 12, lg: 12,
                      }}
                      spacing={{
                        xs: 2, sm: 2, md: 3, lg: 3,
                      }}
                    >

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <TextInput
                          label={t('Asunto')}
                          variant="filled"
                          name="title"
                          type="text"
                          autoComplete=""
                          onChange={onHandleNewChatData}
                          value={newChatData.title}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <FormControl fullWidth>
                          <InputLabel id="market-select-label">{t('Mensaje a')}</InputLabel>
                          <Select
                            labelId="market-select-label"
                            value={newChatData.destinataryName}
                            label={t('Mensaje a')}
                            onChange={onHandleNewChatData}
                            name="destinataryName"
                            variant="filled"
                            required
                          >
                            {(
                                markets.map((market) => (
                                  <MenuItem value={`${market.profile.attributes.marketName}_${market._id}`} id={market._id} key={market._id}>
                                    {market.profile.attributes.marketName}
                                  </MenuItem>
                                ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <TextInput
                          label={t('Mensaje')}
                          variant="filled"
                          name="message"
                          type="text"
                          multiline
                          rows={10}
                          size="large"
                          autoComplete=""
                          onChange={onHandleNewChatData}
                          value={newChatData.message}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <CardActions
                          sx={{
                            alignItems: 'stretch',
                            justifyContent: 'center',
                            paddingBottom: 2,
                          }}
                        >
                          <Button
                            type="submit"
                            size="small"
                            variant="contained"
                            sx={{
                              width: '75%',
                              boxShadow: 5,
                              borderRadius: 10,
                            }}
                          >
                            {t('Iniciar conversación')}
                          </Button>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </form>

                </DialogContent>
              </Dialog>
            </>
          )
        }

      </Dialog>

    </>

  );
}
