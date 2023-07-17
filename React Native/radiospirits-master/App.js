/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux'
import configureStore from './src/configureStore';
import Orientation from 'react-native-orientation';
import AppRoot from './src/AppRoot'
import Spinner from '@components/Spinner'
import OfflineNotice from './src/components/Offline/Offline';
import { STATUS_BAR_BACKGROUND_COLOR } from './src/utils/Const';

class App extends Component<{}> {

  constructor(props) {
    super(props);
    if (Text.defaultProps == null){
      Text.defaultProps = {};
      TextInput.defaultProps = {};
    } 
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = { allowFontScaling: false };
    this.state = {
      store: configureStore(() => {
      }).store
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }
  /**
   * A loading indicator to show any process is under progress and UI can be blocked during that duration.
   */
  spinner() {
    return (
      <Spinner />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated={false}
          hidden={false}
          barStyle='dark-content'
          backgroundColor={STATUS_BAR_BACKGROUND_COLOR}
        />
        <Provider store={this.state.store}>
          <View style={styles.container}>
            <AppRoot />
            {this.spinner()}
            <OfflineNotice />
          </View>
        </Provider>
      </View>
    );
  }
}

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
