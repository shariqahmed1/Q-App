import React from 'react';
import {AppNavigator} from './navigation/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './Redux/Store/Store';
import {persistor} from './Redux/Store/Store';
import { PersistGate } from 'redux-persist/integration/react'

export default class App extends React.Component {
  render() {
    console.disableYellowBox = true;
      return (
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AppNavigator />
              </PersistGate>
          </Provider>
      );
  }
}
