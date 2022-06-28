import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Swap from './pages/Swap';
import Header from './components/Header'
import SolWalletProvider from './components/wallet'
import './App.css';

function App() {
  return (
    <>
      <SolWalletProvider>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Swap} />
          </Switch>
        </Router>
      </SolWalletProvider>
    </>
  );
}

export default App;