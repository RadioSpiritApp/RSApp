/**
 * @author Systango Technologies
 * Date August 8, 2018 
 * Description: Player Tab Screen.
 * 
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'react-native';
import MiniPlayerComponent from './MiniPlayerComponent';
import * as playerCommonAction from '../../../actions/playerCommonAction';
import * as bookmarkAction from '../../../actions/bookmarkAction';
import { bindActionCreators } from 'redux';
import * as CONST from '../../../utils/Const';
import TrackPlayer from 'react-native-track-player';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
let episodeId = -1;

class MiniPlayerContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			renderOnce: true,
			appState: AppState.currentState
		}
	}
	async componentDidMount() {
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange = async (nextAppState) => {
		const {
			playerObject,
			user,
		} = this.props;
		let seekTime = await TrackPlayer.getPosition();
		if (user && user.is_paid_user) {
			if (this.state.appState.match(/inactive|background/) && nextAppState !== 'active') {
				if (seekTime) {
					this.props.bookmarkAction.postSeekTimeAct(user.access_token, playerObject.id, seekTime);
				}
			}
		}
		this.setState({ appState: nextAppState });
	}

	async UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.playerObject !== nextProps.playerObject) {
			const {
				user,
				playerObject,
			} = nextProps;
			const udid = DeviceInfo.getUniqueID();
			firebase.analytics().logEvent('EPISODE_PLAYED', { Episode_Id : playerObject.id , Title : playerObject.title , udid });
			if (nextProps.resetEnable) {
				if (user && user.is_paid_user) {
					let seekTime = await TrackPlayer.getPosition();
					episodeId = episodeId == -1 ? playerObject.id : episodeId;
					if (seekTime) {
						this.props.bookmarkAction.postSeekTimeAct(user.access_token, episodeId, seekTime);
					}
				}
				TrackPlayer.reset();
				TrackPlayer.add(JSON.parse(JSON.stringify(nextProps.playerAudioList)));
				episodeId = playerObject.id;
				if (playerObject.seek_time) {
					TrackPlayer.play();
					TrackPlayer.seekTo(playerObject.seek_time)
				} else {
					TrackPlayer.play();
				}
				this.props.playerCommonAction.updateResetEnable(false);
			}
			this.setCapabilities(nextProps);
		}
	}

	setCapabilities(item) {
		if (item.playerObject && !item.playerObject.isNext && !item.playerObject.isPrev) {
			TrackPlayer.updateOptions({
				capabilities: [
					TrackPlayer.CAPABILITY_PLAY,
					TrackPlayer.CAPABILITY_PAUSE,
				]
			});
		} else {
			if (item.playerObject && item.playerObject.isNext && item.playerObject.isPrev) {
				TrackPlayer.updateOptions({
					capabilities: [
						TrackPlayer.CAPABILITY_PLAY,
						TrackPlayer.CAPABILITY_PAUSE,
						TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
						TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
					]
				});
			} else {
				if (item.playerObject && item.playerObject.isNext) {
					TrackPlayer.updateOptions({
						capabilities: [
							TrackPlayer.CAPABILITY_PLAY,
							TrackPlayer.CAPABILITY_PAUSE,
							TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
						]
					});
				}
				if (item.playerObject && item.playerObject.isPrev) {
					TrackPlayer.updateOptions({
						capabilities: [
							TrackPlayer.CAPABILITY_PLAY,
							TrackPlayer.CAPABILITY_PAUSE,
							TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
						]
					});
				}
			}
		}
	}

	togglePlayback = async () => {
		const currentTrack = await TrackPlayer.getCurrentTrack();
		if (currentTrack == null) {
			TrackPlayer.reset();
			await TrackPlayer.add(this.props.playerAudioList);
			TrackPlayer.play();
		} else {
			if (this.props.isPlay) {
				TrackPlayer.play();
			} else {
				TrackPlayer.pause();
			}
		}
	}

	render() {
		return (
			<MiniPlayerComponent {...this.props} onTogglePlayback={() => this.togglePlayback()} />
		);
	}
}

function mapStateToProps(state) {
	const { commonReducer, playerCommonReducer } = state;
	return {
		freeEpisodeList: playerCommonReducer.freeEpisodeList,
		playerObject: playerCommonReducer.playerObject,
		isPlay: playerCommonReducer.isPlay,
		playerType: commonReducer.playerType,
		playerAudioList: playerCommonReducer.audioList,
		resetEnable: playerCommonReducer.resetEnable,
		bufferState: commonReducer.bufferState,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		bookmarkAction: bindActionCreators(bookmarkAction, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MiniPlayerContainer);