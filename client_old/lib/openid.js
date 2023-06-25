import { Meteor } from 'meteor/meteor';

// Register login method into the client side
Meteor.login = ({ email, pass, service = 'openid' }, userCallback) => {
  const loginRequest = { email, pass };
  loginRequest[service] = true;
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback,
  });
};
