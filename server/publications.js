import { check } from 'meteor/check';
import {
  SupermarketProductsCollection,
  SupermarketsCollection,
  MarketsOfferProductsTemporalCollection,
  MarketsOfferProductsCollection,
  MarketsHistoricalOfferProductsCollection,
  MarketsLastMinuteProductsTemporalCollection,
  MarketsLastMinuteProductsCollection,
  MarketsHistoricalLastMinuteProductsCollection,
  ChatConversationsCollection,
  ChatConversationsMessagesCollection,
  ShoppingCartCollection,
} from '../imports/db/collections';

// Publish user data
Meteor.publish('user', function User() {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          emails: 1,
          profile: 1,
          status: 1,
        },
      },
    );
  }
  return this.ready();
});

Meteor.publish('supermarkets', function Supermarkets() {
  if (this.userId) return SupermarketsCollection.find();
  this.ready();
});

Meteor.publish('supermarketProducts', function SupermarketProducts(key, postalCode) {
  check(key, String);
  check(postalCode, Number);
  if (this.userId) {
    return SupermarketProductsCollection.find({
      marketName: key, postal_code: { $in: [postalCode, undefined] },
    });
  }
  this.ready();
});

// OFFERS DB
Meteor.publish('marketsOfferProductsTemporal', function MarketsOfferProductsTemporal(marketName) {
  check(marketName, String);
  if (this.userId) return MarketsOfferProductsTemporalCollection.find({ marketName });
  this.ready();
});

Meteor.publish('marketsOfferProducts', function MarketsOfferProducts(marketName) {
  check(marketName, String);
  if (this.userId) return MarketsOfferProductsCollection.find({ marketName });
  this.ready();
});

Meteor.publish('marketsHistoricalOfferProducts', function MarketsHistoricalOfferProducts(marketName) {
  check(marketName, String);
  if (this.userId) return MarketsHistoricalOfferProductsCollection.find({ marketName });
  this.ready();
});

// LAST MINUTE DB
Meteor.publish('marketsLastMinuteProductsTemporal', function MarketsLastMinuteProductsTemporal(marketName) {
  check(marketName, String);
  if (this.userId) return MarketsLastMinuteProductsTemporalCollection.find({ marketName });
  this.ready();
});

Meteor.publish('marketsLastMinuteProducts', function MarketsLastMinuteProducts(marketName) {
  check(marketName, String);
  if (this.userId) return MarketsLastMinuteProductsCollection.find({ marketName });
  this.ready();
});

Meteor.publish('marketsHistoricalLastMinuteProducts', function MarketsHistoricalLastMinuteProducts(marketName) {
  check(marketName, String);
  if (this.userId) return MarketsHistoricalLastMinuteProductsCollection.find({ marketName });
  this.ready();
});
// Markets
Meteor.publish('markets', function Markets() {
  if (this.userId) return Meteor.users.find({ 'profile.attributes.userType': 'comercio' });
  this.ready();
});

Meteor.publish('marketProducts', function MarketProducts(key) {
  check(key, String);
  if (this.userId) {
    return MarketsOfferProductsCollection.find({
      marketName: key,
    });
  }
  this.ready();
});

Meteor.publish('marketsLastMinute', async function MarketsLastMinute() {
  if (this.userId) {
    const markets = await MarketsLastMinuteProductsCollection.rawCollection().distinct('marketName');
    return Meteor.users.find({
      'profile.attributes.marketName': { $in: markets },
    });
  }
  this.ready();
});

Meteor.publish('marketLastMinuteProducts', function MarketsLastMinuteProducts(key) {
  check(key, String);
  if (this.userId) {
    return MarketsLastMinuteProductsCollection.find({ marketName: key });
  }
  this.ready();
});
// Chat conversations
Meteor.publish('chatConversations', function ChatConversations(key, userType) {
  check(key, String);
  check(userType, String);
  if (this.userId) {
    if (userType === 'cliente') {
      return ChatConversationsCollection.find({
        senderId: key,
      });
    }
    return ChatConversationsCollection.find({
      receiverId: key,
    });
  }
  this.ready();
});

Meteor.publish('chatConversationMessages', function ChatConversationMessages(chatId) {
  check(chatId, String);
  if (this.userId) {
    return ChatConversationsMessagesCollection.find({
      chatId,
    });
  }
  this.ready();
});

Meteor.publish('shoppingCart', function ShoppingCart(userId) {
  check(userId, String);
  if (this.userId) {
    return ShoppingCartCollection.find({
      userId,
    });
  }
  this.ready();
});
