/**
 * @author Systango Technologies
 * Date: 
 * Description: Offline Screen.
 * 
 */
import {
	connect
} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonAction from '../../actions/commonAction';
import React, { PureComponent } from 'react';
import { View, Text, NetInfo, StyleSheet, Platform } from 'react-native';
import screen from '@utils/screen';
import TrackPlayer from 'react-native-track-player';
import * as playerCommonAction from '../../actions/playerCommonAction';

let isConnectedStatus = true;

export function getIsConnectedStatus() {
  return isConnectedStatus;
}

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    
    if(!isConnected && this.props.playerObject && !this.props.playerObject.isplayFromDownload){
      TrackPlayer.pause();
      TrackPlayer.stop();
      TrackPlayer.reset();
      this.props.playerCommonAction.emptyPlayerListAct();
    }
    this.setState({ isConnected });
    isConnectedStatus = isConnected;
    this.props.commonAction.internetStatus(isConnected);
  };

  render() {
    const {
      internetStatus,
    } = this.props;
    if (!internetStatus) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: 'blue',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: screen.WIDTH,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 0
  },
  offlineText: { color: '#fff' }
});

function mapStateToProps(state) {
	const { commonReducer, playerCommonReducer } = state;
	return {
    internetStatus : commonReducer.internetStatus,
    playerObject: playerCommonReducer.playerObject,
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
    commonAction: bindActionCreators(commonAction, dispatch),
    playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice);