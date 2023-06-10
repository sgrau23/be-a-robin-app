import { Meteor } from 'meteor/meteor';
import '/server/methods';
import './publications';
import { getProductProposal } from './inuba';

Meteor.startup(async () => {
  getProductProposal(3);
});
