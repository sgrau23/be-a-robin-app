import { Meteor } from 'meteor/meteor';
import Future from 'fibers/future';
import { check } from 'meteor/check';
import fetch from 'node-fetch';
import { createUser, getCoordinates } from './openid';
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

const deg2rad = (deg) => deg * (Math.PI / 180);

const _getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in kilometers
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in KM
  return d;
};

const calculateDistance = (point1, point2) => _getDistanceFromLatLonInKm(
  point1[1], point1[0], point2[1], point2[0],
);

const getCloserMarket = (markets, user) => {
  let closerMarket;
  let closerDistance = 10 ** 1000;
  markets.forEach((market) => {
    const distance = calculateDistance(
      market.profile.preferences.coordinates.coordinates,
      user.profile.preferences.location.coordinates.coordinates,
    );
    if (distance < closerDistance) {
      closerMarket = market;
      closerDistance = distance;
    }
  });
  return closerMarket;
};

const getOnSalesMarketProducts = (marketName, category) => {
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
      image: product.image,
      expirationDate: product.expirationDate,
      marketName,
    });
  });
  return data;
};

const assignInubaProducts2CloserMarket = (inubaProducts) => ({
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
            intolerances: selectedIntolerances,
            dislikes: selectedDislikes,
          },
        },
      },
    );
  },
  'user.storePreferences': (preferences, _id) => {
    check(preferences, Object);
    check(_id, String);
    if (preferences.address) {
      preferences.coordinates = getCoordinates({
        city: preferences.city, street: preferences.address, postalcode: preferences.postalcode,
      });
    }
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
    // Get current user
    const user = Meteor.users.find({ _id }).fetch()[0];
    // Get iNuba purpose
    const inubaPurpose = getProductProposal(optimizerPreferences);
    const finalPurpose = {};
    const involvedMarkets = [];
    let items = [];
    settings.public.dislikeCategories.forEach((category) => {
      // Check if category exists in purpose
      if (!inubaPurpose.categories.includes(category.key)) return;
      // Get available markets for current category
      const availableMarkets = Meteor.users.find(
        {
          'profile.preferences.categories': parseInt(category.id, 10),
          'profile.preferences.city': { $regex: new RegExp(user.profile.preferences.location.city, 'i') },
        },
      ).fetch();
      // Get closer market
      const closerMarket = getCloserMarket(availableMarkets, user);
      let productsInfo = {};
      // Get products in sales of closer market if it exists
      if (closerMarket) {
        productsInfo = getOnSalesMarketProducts(
          closerMarket.profile.preferences.name, category.id,
        );
      }
      // If there is no products get inuba purpose for current category
      if (Object.keys(productsInfo).length === 0) {
        productsInfo = assignInubaProducts2CloserMarket(
          productsInfo = inubaPurpose.purpose[category.key],
        );
      }
      // Add to final purpose
      // finalPurpose[category.id] = productsInfo;
      items = items.concat(productsInfo.products);
      if (!involvedMarkets.includes(productsInfo.marketName)) involvedMarkets.push(productsInfo.marketName);
    });
    // Store final purpose
    OptimizedPurchaseCollection.update({ _id }, { $set: { products: items, involvedMarkets } }, { upsert: true });
    return { products: items, involvedMarkets };
  },
  'purchaseOptimizer.get': (_id) => {
    check(_id, String);
    const purpose = OptimizedPurchaseCollection.find({ _id }).fetch().pop();
    return purpose;
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
  'location.getAddress': (coordinates, _id) => {
    check(coordinates, Object);
    check(_id, String);
    const future = new Future();
    fetch(
      // `https://geocode.maps.co/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}`,
      `${settings.geocoding.coordinates2address}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&apiKey=${settings.geocoding.apiKey}`,
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
    if (Object.keys(response).length > 0) {
      const { properties } = response.features[0];
      Meteor.users.update(
        { _id },
        {
          $set: {
            'profile.preferences.location': {
              coordinates: {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude],
              },
              completeAddress: properties.formatted,
              address: `${properties.street}, ${properties.housenumber}`,
              city: properties.city,
            },
          },
        },
      );
      return `${properties.street}, ${properties.housenumber}`;
    }
    return undefined;
  },
  'inuba.getIntolerances': () => intolerances,
  'inuba.getProducts': () => products,
  'inuba.getProductsSuperfamilies': () => productsSuperfamilies,
});
