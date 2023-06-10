import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ContactEmergency } from '@mui/icons-material';
import { createUser } from './openid';
import {
  ProductCategoriesCollection, MarketsOfferProductsTemporalCollection,
  MarketsOfferProductsCollection, MarketsHistoricalOfferProductsCollection,
  MarketsLastMinuteProductsTemporalCollection,
  MarketsLastMinuteProductsCollection, MarketsHistoricalLastMinuteProductsCollection,
  ChatConversationsCollection, ChatConversationsMessagesCollection,
} from '../imports/db/collections';

const { settings } = Meteor;

// Offers
const removeTemporalOffer = (_id) => {
  MarketsOfferProductsTemporalCollection.remove({ _id });
};

const removeOffer = (_id) => {
  MarketsOfferProductsCollection.remove({ _id });
};

const removeHistoricalOffer = (_id) => {
  MarketsHistoricalOfferProductsCollection.remove({ _id });
};

// Last minute
const removeTemporalLastMinute = (_id) => {
  MarketsLastMinuteProductsTemporalCollection.remove({ _id });
};

const removeLastMinute = (_id) => {
  MarketsLastMinuteProductsCollection.remove({ _id });
};

const removeHistoricalLastMinute = (_id) => {
  MarketsHistoricalLastMinuteProductsCollection.remove({ _id });
};

Meteor.methods({
  'users.createUser': async (userData, userCommonData, userTypeData) => {
    check(userData, Object);
    check(userCommonData, Object);
    check(userTypeData, Object);
    // User creation
    const result = await createUser(userData, userCommonData, userTypeData);
    if (result.status === 400) throw new Meteor.Error(result.message);
    return true;
  },
  'products.categories': () => ProductCategoriesCollection.find().fetch().map((category) => category.category_name),
  'products.createTemporalOffer': (productData, marketId) => {
    check(productData, Object);
    check(marketId, String);
    // Parse date and add market id
    productData.marketName = marketId;
    if (productData.image === undefined) productData.image = settings.data.blank_image;
    MarketsOfferProductsTemporalCollection.insert({
      ...productData,
    });
  },
  'products.submitOffers': (offers) => {
    check(offers, Array);
    // Store offers and remove from temporal collection
    offers.forEach((element) => {
      MarketsOfferProductsCollection.insert({
        ...element.offer,
      });
      removeTemporalOffer(element.offer._id);
    });
  },
  'products.extendOffer': (offer, _id) => {
    check(offer, Object);
    check(_id, String);
    // Store offers and remove from temporal collection
    MarketsOfferProductsCollection.insert({
      ...offer,
    });
    removeHistoricalOffer(_id);
  },
  'products.removeTemporalOffer': (offer) => {
    check(offer, Object);
    removeTemporalOffer(offer._id);
  },
  'products.removeOffer': (offer) => {
    check(offer, Object);
    MarketsHistoricalOfferProductsCollection.insert({
      ...offer,
    });
    removeOffer(offer._id);
  },
  'products.updateOffer': (offer, _id) => {
    check(offer, Object);
    check(_id, String);
    MarketsOfferProductsCollection.update(
      { _id }, { $set: offer },
    );
  },

  'products.createTemporalLastMinute': (productData, marketId) => {
    check(productData, Object);
    check(marketId, String);
    // Parse date and add market id
    productData.marketName = marketId;
    if (productData.image === undefined) productData.image = settings.data.blank_image;
    MarketsLastMinuteProductsTemporalCollection.insert({
      ...productData,
    });
  },
  'products.submitLastMinutes': (offers) => {
    check(offers, Array);
    // Store offers and remove from temporal collection
    offers.forEach((element) => {
      MarketsLastMinuteProductsCollection.insert({
        ...element.lastminute,
      });
      removeTemporalLastMinute(element.lastminute._id);
    });
  },
  'products.extendLastMinute': (lastminute, _id) => {
    check(lastminute, Object);
    check(_id, String);
    // Store offers and remove from temporal collection
    MarketsLastMinuteProductsCollection.insert({
      ...lastminute,
    });
    removeHistoricalLastMinute(_id);
  },
  'products.removeTemporalLastMinute': (lastminute) => {
    check(lastminute, Object);
    removeTemporalLastMinute(lastminute._id);
  },
  'products.removeLastMinute': (lastminute) => {
    check(lastminute, Object);
    MarketsHistoricalLastMinuteProductsCollection.insert({
      ...lastminute,
    });
    removeLastMinute(lastminute._id);
  },
  'products.updateLastMinute': (lastminute, _id) => {
    check(lastminute, Object);
    check(_id, String);
    MarketsLastMinuteProductsCollection.update(
      { _id }, { $set: lastminute },
    );
  },
  'lastMinute.getTotalProducts': () => MarketsLastMinuteProductsCollection.countDocuments(),
  'lastMinute.getMarketsInfo': async (markets) => {
    check(markets, Array);
    const marketsProducts = {};
    await Promise.all(markets.map(async (element) => {
      const totalProducts = await MarketsLastMinuteProductsCollection.countDocuments({
        marketName: element.profile.attributes.marketName,
      });
      marketsProducts[element.profile.attributes.marketName] = {
        totalProducts,
        logo: element.photo,
        contentText: element.profile.given_name,
        route: `/marketsLastMinute/${element.profile.attributes.marketName}`,
        notifications: totalProducts,
        key: element.profile.attributes.marketName,
      };
    }));
    return marketsProducts;
  },
  'markets.getAll': () => Meteor.users.find({ 'profile.attributes.userType': 'comercio' }).fetch(),
  'chat.createConversation': (conversation) => {
    check(conversation, Object);
    // Add new attribtues
    const timestamp = parseInt(new Date().getTime() / 1000, 10);
    conversation.createdTime = timestamp;
    conversation.senderId = Meteor.user()._id;
    conversation.senderName = Meteor.user().profile.attributes.name;
    const receiverInfo = conversation.destinataryName.split('_');
    conversation.receiverId = receiverInfo[1];
    conversation.receiverName = receiverInfo[0];
    const { message } = conversation;
    // Remove unnecessary attributes
    delete conversation.message;
    delete conversation.destinataryName;
    ChatConversationsCollection.insert({ ...conversation }, (error, docInserted) => {
      ChatConversationsMessagesCollection.insert({
        chatId: docInserted,
        message,
        senderId: Meteor.user()._id,
        receiverId: receiverInfo[1],
        read: false,
        createdTime: timestamp,
      });
    });
  },
  'chat.submitMessage': (conversation, message) => {
    check(conversation, Object);
    check(message, String);
    const timestamp = parseInt(new Date().getTime() / 1000, 10);
    ChatConversationsMessagesCollection.insert({
      chatId: conversation._id,
      message,
      timestamp,
      read: false,
      senderId: Meteor.user()._id,
      receiverId: (conversation.receiverId !== Meteor.user()._id ? conversation.receiverId : conversation.senderId),
    });
  },
  'chat.readConversationMessages': (chatId, receiverId) => {
    check(chatId, String);
    check(receiverId, String);
    ChatConversationsMessagesCollection.update(
      {
        chatId,
        receiverId,
      },
      {
        $set: {
          read: true,
        },
      },
      { multi: true },
    );
  },
});
