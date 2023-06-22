import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import {
  BrowserRouter as Router, Switch,
} from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Login } from './pages/users/Login';
import { Registration } from './pages/users/Registration';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MarketDashboard } from './pages/market/MarketDashboard';
import { Supermarkets } from './pages/supermarkets/Supermarkets';
import { SupermarketProducts } from './pages/supermarkets/SupermarketProducts';
import { Offers } from './pages/market/offers/Offers';
import { OffersAdd } from './pages/market/offers/OffersAdd';
import { OffersManage } from './pages/market/offers/OffersManage';
import { OffersHistorical } from './pages/market/offers/OffersHistorical';

import { LastMinute } from './pages/market/lastminute/LastMinute';
import { LastMinuteAdd } from './pages/market/lastminute/LastMinuteAdd';
import { LastMinuteManage } from './pages/market/lastminute/LastMinuteManage';
import { LastMinuteHistorical } from './pages/market/lastminute/LastMinuteHistorical';

import { Markets } from './pages/users/Markets';
import { MarketProducts } from './pages/users/MarketProducts';
import { MarketsLastMinute } from './pages/users/MarketsLastMinute';
import { MarketLastMinuteProducts } from './pages/users/MarketLastMinuteProducts';

import { PropsRoute } from './pages/PropsRoute';
import { Navbar } from './components/Navbar';
import { MarketFooterNavbar } from './components/MarketFooterNavbar';
import { CustomerFooterNavbar } from './components/CustomerFooterNavbar';
import { mainTheme } from './styles/theme';

import { Chat } from './components/Chat';
import { PurchaseOptimizer } from './pages/customer/PurchaseOptimizer';
import { ShoppingCart } from './pages/customer/ShoppingCart';

const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
`;

const Body = styled.div`
  margin: 55px;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
`;

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
        <MainContainer>
          {
            loggedIn
              ? (
                <>
                  <PropsRoute component={Navbar} />
                  <div style={{ marginTop: '7%' }}>
                    <Body>
                      <Switch>
                        {
                          userType === 'comercio' && (
                            <>
                              <PropsRoute exact path="/" component={MarketDashboard} />

                              <PropsRoute exact path="/offers" component={Offers} />
                              <PropsRoute exact path="/offers/add" component={OffersAdd} />
                              <PropsRoute exact path="/offers/manage" component={OffersManage} />
                              <PropsRoute exact path="/offers/historical" component={OffersHistorical} />

                              <PropsRoute exact path="/lastminute" component={LastMinute} />
                              <PropsRoute exact path="/lastminute/add" component={LastMinuteAdd} />
                              <PropsRoute exact path="/lastminute/manage" component={LastMinuteManage} />
                              <PropsRoute exact path="/lastminute/historical" component={LastMinuteHistorical} />
                            </>
                          )
                        }
                        {
                          userType === 'cliente' && (
                            <>
                              <PropsRoute exact path="/shoppingCart" component={ShoppingCart} />

                              <PropsRoute exact path="/marketsOffers" component={Markets} />
                              <PropsRoute exact path="/marketsOffers/:id" component={MarketProducts} />

                              <PropsRoute exact path="/marketsLastMinute" component={MarketsLastMinute} />
                              <PropsRoute exact path="/marketsLastMinute/:id" component={MarketLastMinuteProducts} />

                              <PropsRoute exact path="/supermarkets" component={Supermarkets} />
                              <PropsRoute exact path="/supermarkets/:id" component={SupermarketProducts} />

                              <PropsRoute exact path="/purchaseOptimizer" component={PurchaseOptimizer} />

                              <PropsRoute exact path="/" component={CustomerDashboard} />
                            </>
                          )
                        }
                        {/* <PropsRoute component={NotFound} /> */}
                      </Switch>
                    </Body>
                  </div>
                  <PropsRoute component={Chat} />
                  {
                    userType === 'comercio' && (
                      <PropsRoute component={MarketFooterNavbar} />
                    )
                  }
                  {
                    userType === 'cliente' && (
                      <PropsRoute component={CustomerFooterNavbar} />
                    )
                  }

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
        </MainContainer>
      </Router>
    </ThemeProvider>
  );
}

