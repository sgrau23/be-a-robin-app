export const SupermarketsCollection = new Mongo.Collection('supermarkets');
export const SupermarketProductsCollection = new Mongo.Collection('supermarketProducts');
export const ProductCategoriesCollection = new Mongo.Collection('productCategories');
// OFFERS DB
export const MarketsOfferProductsTemporalCollection = new Mongo.Collection('marketsOfferProductsTemporal');
export const MarketsOfferProductsCollection = new Mongo.Collection('marketsOfferProducts');
export const MarketsHistoricalOfferProductsCollection = new Mongo.Collection('marketsHistoricalOfferProducts');
// LAST MINUTE DB
export const MarketsLastMinuteProductsTemporalCollection = new Mongo.Collection('marketsLastMinuteProductsTemporal');
export const MarketsLastMinuteProductsCollection = new Mongo.Collection('marketsLastMinuteProducts');
export const MarketsHistoricalLastMinuteProductsCollection = new Mongo.Collection('marketsHistoricalLastMinuteProducts');
// CHAT CONVERSATIONS DB
export const ChatConversationsCollection = new Mongo.Collection('chatConversations');
export const ChatConversationsMessagesCollection = new Mongo.Collection('chatConversationsMessages');
// OPTIMIZED PURCHASES
export const OptimizedPurchaseCollection = new Mongo.Collection('optimizedPurchase');
// SHOPPING CART
export const ShoppingCartCollection = new Mongo.Collection('shoppingCart');
// USERS TEMPORAL PROFILE PHOTO
export const UsersTemporalPhotoCollection = new Mongo.Collection('usersTemporalPhoto');
