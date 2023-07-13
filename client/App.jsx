import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import {
  BrowserRouter as Router, Switch,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Login } from './pages/users/Login';
import { Registration } from './pages/users/Registration';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MarketDashboard } from './pages/market/MarketDashboard';

import { PropsRoute } from './pages/PropsRoute';
// import { Navbar } from './components/Navbar';
// import { MarketFooterNavbar } from './components/MarketFooterNavbar';
// import { CustomerFooterNavbar } from './components/CustomerFooterNavbar';
import { mainTheme } from './styles/theme';

import { Chat } from './components/chat/Chat';
import { PurchaseOptimizer } from './pages/customer/optimizer/PurchaseOptimizer';
import { ProductList } from './pages/customer/markets/ProductsList';
import { ShoppingList } from './components/shopping/ShoppingList';
import { HistoricalShoppingList } from './components/shopping/HistoricalShoppingList';
import { HistoricalShoppingDetails } from './components/shopping/HistoricalShoppingDetails';
import { CustomerPreferences } from './pages/customer/CustomerPreferences';
import { MarketPreferences } from './pages/market/MarketPreferences';

export function App() {
  const { loggedIn, userType } = useTracker(() => {
    const userHandler = Meteor.subscribe('user');
    return {
      loggedIn: (userHandler.ready() && Meteor.user() && !Meteor.loggingIn()),
      userType: (Meteor.user() ? Meteor.user().profile.attributes.userType : undefined),
    };
  }, []);

  return (
    <ThemeProvider theme={mainTheme}>
      <Router>

        {
            loggedIn
              ? (
                <>
                  <Switch>
                    {
                      userType === 'comercio' && (
                        <>
                          <PropsRoute exact path="/" component={MarketDashboard} />
                          <PropsRoute exact path="/historicalOffers" component={MarketDashboard} />

                          <PropsRoute exact path="/marketPreferences" component={MarketPreferences} />

                          {/* <PropsRoute exact path="/offers" component={Offers} />
                          <PropsRoute exact path="/offers/add" component={OffersAdd} />
                          <PropsRoute exact path="/offers/manage" component={OffersManage} />
                          <PropsRoute exact path="/offers/historical" component={OffersHistorical} />

                          <PropsRoute exact path="/lastminute" component={LastMinute} />
                          <PropsRoute exact path="/lastminute/add" component={LastMinuteAdd} />
                          <PropsRoute exact path="/lastminute/manage" component={LastMinuteManage} />
                          <PropsRoute exact path="/lastminute/historical" component={LastMinuteHistorical} /> */}
                        </>
                      )
                    }
                    {
                      userType === 'cliente' && (
                        <>
                          <PropsRoute exact path="/" component={CustomerDashboard} />

                          <PropsRoute exact path="/markets/:id" component={ProductList} />
                          <PropsRoute exact path="/eco/:id" component={ProductList} />
                          <PropsRoute exact path="/supermarkets/:id" component={ProductList} />

                          <PropsRoute exact path="/shoppingList" component={ShoppingList} />
                          <PropsRoute exact path="/historicalShoppingList" component={HistoricalShoppingList} />
                          <PropsRoute exact path="/historicalShoppingList/:id" component={HistoricalShoppingDetails} />

                          <PropsRoute exact path="/customerPreferences" component={CustomerPreferences} />

                          <PropsRoute exact path="/purchaseOptimizer" component={PurchaseOptimizer} />
                        </>
                      )
                    }
                  </Switch>
                  <PropsRoute component={Chat} />
                </>
              )
              : (
                <div className="generalPadding">
                  <Switch>
                    <PropsRoute exact path="/registration" component={Registration} />
                    <PropsRoute exact path="/" component={Login} />
                  </Switch>
                </div>
              )
          }
      </Router>
    </ThemeProvider>
  );
}

