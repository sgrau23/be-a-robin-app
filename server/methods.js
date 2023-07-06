import { Meteor } from 'meteor/meteor';
import Future from 'fibers/future';
import { check } from 'meteor/check';
import fetch from 'node-fetch';
import { createUser } from './openid';
import {
  MarketsOfferProductsTemporalCollection,
  MarketsOfferProductsCollection, MarketsHistoricalOfferProductsCollection,
  MarketsLastMinuteProductsTemporalCollection,
  MarketsLastMinuteProductsCollection, MarketsHistoricalLastMinuteProductsCollection,
  ChatConversationsCollection, ChatConversationsMessagesCollection,
  OptimizedPurchaseCollection, ShoppingCartCollection,
  HistoricalShoppingCartCollection,
} from '../imports/db/collections';
import {
  getProductProposal, intolerances, products, productsSuperfamilies,
} from './inuba';

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

const getCloserMarket = (markets, userId) => markets[0];

const getOnSalesMarketProducts = (marketName, optimizerPreferences, category) => {
  const result = MarketsOfferProductsCollection.find({
    marketName,
    category_id: category,
  }).fetch();
  if (result.length === 0) return {};
  const data = { products: [], marketName };
  result.forEach((product) => {
    data.products.push({
      name: product.name,
      price: product.price,
    });
  });
  return data;
};

const assignInubaProducts2CloserMarket = (inubaProducts, userId) => ({
  products: inubaProducts,
  marketName: 'Sin mercado',
});

Meteor.methods({
  'users.createUser': async (userData, userTypeData) => {
    check(userData, Object);
    check(userTypeData, Object);
    // User creation
    const result = await createUser(userData, userTypeData);
    return result;
  },
  'products.categories': () => {
    const categories = {};
    settings.public.dislikeCategories.forEach((category) => {
      categories[category.id] = category.name;
    });
    return categories;
  },
  'products.createOffer': (productData, marketId) => {
    check(productData, Object);
    check(marketId, String);
    // Parse date and add market id
    productData.marketName = marketId;
    if (productData.image === undefined) productData.image = settings.data.blank_image;
    MarketsOfferProductsCollection.insert({
      ...productData,
    });
  },
  // 'products.submitOffers': (offers) => {
  //   check(offers, Array);
  //   // Store offers and remove from temporal collection
  //   offers.forEach((element) => {
  //     MarketsOfferProductsCollection.insert({
  //       ...element.offer,
  //     });
  //     removeTemporalOffer(element.offer._id);
  //   });
  // },
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
  'products.removeHistoricalOffer': (offer) => {
    check(offer, Object);
    removeHistoricalOffer(offer._id);
  },
  'products.updateOffer': (offer, _id) => {
    check(offer, Object);
    check(_id, String);
    MarketsOfferProductsCollection.update(
      { _id }, { $set: offer },
    );
  },
  'products.createLastMinute': (productData, marketId) => {
    check(productData, Object);
    check(marketId, String);
    // Parse date and add market id
    productData.marketName = marketId;
    if (productData.image === undefined) productData.image = settings.data.blank_image;
    MarketsLastMinuteProductsCollection.insert({
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
  'products.removeHistoricalLastMinute': (lastminute) => {
    check(lastminute, Object);
    removeHistoricalLastMinute(lastminute._id);
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
  'purchaseOptimizer.storePreferences': (diet, selectedDislikes, selectedIntolerances, _id) => {
    check(diet, Number);
    check(selectedDislikes, Array);
    check(selectedIntolerances, Array);
    check(_id, String);
    Meteor.users.update(
      { _id },
      {
        $set: {
          'profile.preferences.optimizerData': {
            diet,
            selectedIntolerances,
            selectedDislikes,
          },
        },
      },
    );
  },
  'user.storePreferences': (preferences, _id) => {
    check(preferences, Object);
    check(_id, String);
    Meteor.users.update(
      { _id },
      {
        $set: {
          'profile.preferences': {
            ...preferences,
          },
        },
      },
    );
    return true;
  },
  'purchaseOptimizer.optimize': (optimizerPreferences, _id) => {
    check(optimizerPreferences, Object);
    check(_id, String);
    // Get iNuba purpose
    const inubaPurpose = getProductProposal(optimizerPreferences);
    const finalPurpose = {};
    const involvedMarkets = [];
    settings.public.dislikeCategories.forEach((category) => {
      // Get available markets for current category
      const availableMarkets = Meteor.users.find(
        { 'profile.attributes.marketCategories': { $regex: new RegExp(`.*${category.id}.*`) } },
      ).fetch();
      // Get closer market
      const closerMarket = getCloserMarket(availableMarkets, _id);
      let productsInfo = {};
      // Get products in sales of closer market if it exists
      if (closerMarket) {
        productsInfo = getOnSalesMarketProducts(
          closerMarket.profile.attributes.marketName, optimizerPreferences, category.id,
        );
      }
      // If there is no products get inuba purpose for current category
      if (Object.keys(productsInfo).length === 0) {
        productsInfo = assignInubaProducts2CloserMarket(
          productsInfo = inubaPurpose[category.id],
          _id,
        );
      }
      // Add to final purpose
      finalPurpose[category.id] = productsInfo;
      if (!involvedMarkets.includes(productsInfo.marketName)) involvedMarkets.push(productsInfo.marketName);
    });
    // Store final purpose
    OptimizedPurchaseCollection.update({ _id }, { $set: { purpose: finalPurpose, involvedMarkets } }, { upsert: true });
    return { purpose: finalPurpose, involvedMarkets };
  },
  'purchaseOptimizer.get': (_id) => {
    check(_id, String);
    const purpose = OptimizedPurchaseCollection.find({ _id }).fetch();
    if (purpose.length > 0) return purpose[0];
    return {};
  },
  'shoppingCart.addProduct': (product, quantity, userId, marketName) => {
    check(product, Object);
    check(quantity, Number);
    check(userId, String);
    check(marketName, String);
    // Assign quantity
    product.qty = quantity;
    ShoppingCartCollection.update(
      {
        userId,
        marketName,
        name: product.name,
      },
      { $set: { product } },
      { upsert: true },
    );
  },
  'shoppingCart.getAll': (userId) => {
    check(userId, String);
    return ShoppingCartCollection.find({ userId }).fetch();
  },
  'shoppingCart.changeStatus': (userId, product, disabled) => {
    check(product, Object);
    check(userId, String);
    check(disabled, Boolean);
    return ShoppingCartCollection.update(
      {
        userId,
        marketName: product.marketName,
        name: product.name,
      },
      {
        $set: { 'product.disabled': disabled },
      },
    );
  },
  'shoppingCart.deleteUserProducts': (userId) => {
    check(userId, String);
    const p = ShoppingCartCollection.find({ userId }).fetch();
    // Move to the historical collection
    HistoricalShoppingCartCollection.insert(
      {
        userId,
        products: p,
        timestamp: new Date(),
      },
    );
    // Remove from the actual collection
    ShoppingCartCollection.remove({ userId });
  },
  'shoppingCart.getallHistorical': (userId) => {
    check(userId, String);
    return HistoricalShoppingCartCollection.find({ userId }).fetch();
  },
  'shoppingCart.getHistoricalList': (_id) => {
    check(_id, String);
    return HistoricalShoppingCartCollection.find({ _id }).fetch();
  },
  'location.getAddress': (coordinates) => {
    check(coordinates, Object);
    const future = new Future();
    fetch(
      `https://geocode.maps.co/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}`,
      {
        method: 'get',
        // headers,
      },
    )
      .then((data) => data.json())
      .then((r) => future.return(r))
      .catch((error) => { console.error(error); future.return(); });
    const response = future.wait();
    // Return fomatted address
    if (response.address) {
      return `${response.address.road},${(response.address.house_number ? response.address.house_number : response.address.city)}`;
    }
    return undefined;
  },
  'inuba.getIntolerances': () => intolerances,
  'inuba.getProducts': () => products,
  'inuba.getProductsSuperfamilies': () => productsSuperfamilies,
});
