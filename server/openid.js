import { Meteor } from 'meteor/meteor';
import jwtDecode from 'jwt-decode';
import Future from 'fibers/future';
import fetch from 'node-fetch';
import { UsersTemporalPhotoCollection } from '../imports/db/collections';

const service = 'openid';
const {
  clientId, clientSecret, tokenUrl, usersUrl,
} = Meteor.settings.openid;

export const getAccessToken = () => {
  const future = new Future();
  // Define required body to obtain access token
  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);
  // Make curl request
  fetch(
    tokenUrl,
    {
      method: 'post',
      body,
    },
  )
    .then((r) => r.json())
    .then((r) => future.return(r))
    .catch((error) => { console.error(error); future.return(); });
  const response = future.wait();
  return response.access_token;
};

const fillAttributes = (userData, userCommonData, userTypeData) => {
  let result = {};
  result = Object.assign(result, userData, userCommonData, userTypeData);
  return result;
};

export const createUser = (userData, userCommonData, userTypeData) => {
  const future = new Future();
  const accessToken = getAccessToken();
  const attributes = fillAttributes(userData, userCommonData, userTypeData);
  const { image } = attributes;
  delete attributes.image;

  // console.log(typeof attributes.image);
  // Define body
  const body = {
    createdTimestamp: new Date().getTime(),
    username: userData.username,
    credentials: [{
      type: 'password',
      value: userData.pass,
      temporary: false,
    }],
    enabled: true,
    emailVerified: true,
    firstName: (userData.userType === 'cliente' ? userTypeData.firstName : userTypeData.marketName),
    lastName: (userData.userType === 'cliente' ? userTypeData.secondName : userTypeData.marketName),
    email: userData.email,
    attributes,
  };
  // Make curl request
  fetch(
    usersUrl,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    },
  )
    .then((r) => r.json())
    .then((r) => future.return(r))
    .catch((error) => { console.error(error); future.return(); });
  const response = future.wait();
  // Prepare output response
  const result = {
    message: 'El usuario ha sido creado',
    status: 201,
  };
  if (response && 'errorMessage' in response) {
    result.message = response.errorMessage;
    result.status = 400;
  } else {
    UsersTemporalPhotoCollection.insert({
      email: userData.email,
      image,
    });
  }
  return result;
};

export const getUserAttributes = (email) => {
  const future = new Future();
  const accessToken = getAccessToken();
  // Make curl request
  fetch(
    `${usersUrl}?email=${email}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
    .then((r) => r.json())
    .then((r) => future.return(r))
    .catch((error) => { console.error(error); future.return(); });

  const { attributes } = future.wait()[0];
  // Parse attributes
  Object.keys(attributes).forEach((key) => {
    const element = attributes[key][0];
    attributes[key] = element;
  });
  return attributes;
};

Accounts.registerLoginHandler(service, (options) => {
  if (!options.openid || !options.email || !options.pass) return undefined;
  // Define required body
  const body = new URLSearchParams();
  body.append('username', options.email);
  body.append('password', options.pass);
  body.append('grant_type', 'password');
  body.append('client_id', clientId);
  body.append('client_secret', clientSecret);
  if (options.scope) body.append('scope', options.scope);
  // Make curl request to get authentication
  const future = new Future();
  fetch(
    tokenUrl,
    {
      method: 'post',
      body,
    },
  )
    .then((r) => r.json())
    .then((r) => future.return(r))
    .catch((error) => { console.error(error); future.return(); });
  const response = future.wait();
  // Return error message if authentication has failed
  if (!response) throw new Meteor.Error('error');
  if (response.error) throw new Meteor.Error(response.error_description);
  const attributes = getUserAttributes(options.email);
  // Decode JWT token
  const accessTokenInfo = jwtDecode(response.access_token);
  // Check user preferences

  const user = Meteor.users.find({ 'profile.email': accessTokenInfo.email }).fetch();
  const userPhoto = UsersTemporalPhotoCollection.find({ email: accessTokenInfo.email }).fetch();
  // Update or create user account
  const uid = Accounts.updateOrCreateUserFromExternalService(
    this.service,
    {
      id: accessTokenInfo.sub,
      accessToken: response.access_token,
      accessTokenInfo,
    },
    {
      profile: {
        name: accessTokenInfo.name,
        scope: accessTokenInfo.scope,
        sid: accessTokenInfo.sid,
        preferred_username: accessTokenInfo.preferred_username,
        given_name: accessTokenInfo.given_name,
        family_name: accessTokenInfo.family_name,
        email: accessTokenInfo.email,
        preferences: (user.length === 0 ? undefined : user[0].profile.preferences),
        image: userPhoto[0].image,
        savings: {
          currentMonthsavings: 0,
          currentMonthPotentialSavings: 0,
        },
        attributes,
      },
    },
    { upsert: true },
  );
  return uid;
});

// eslint-disable-next-line no-unused-vars
Accounts.onExternalLogin((options, user) => options);
