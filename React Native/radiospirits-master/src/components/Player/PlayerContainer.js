/**
 * @author Systango Technologies
 * Date: Aug 8, 2018 
 * Description: Player Screen.
 * 
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayerComponent from './PlayerComponent';
import * as playerCommonAction from '../../actions/playerCommonAction';
import * as downloadAction from '../../actions/downloadAction';
import * as commonAction from '../../actions/commonAction';
import { bindActionCreators } from 'redux';
import TrackPlayer from 'react-native-track-player';

class PlayerContainer extends Component {

	togglePlayback = async () => {
		if (this.props.isPlay) {
			TrackPlayer.pause();
		} else {
			TrackPlayer.play();
		}
	}
	skipToNext = () => {
		try {
			TrackPlayer.play();
			TrackPlayer.skipToNext()
		} catch (error) {
			console.log('error', error)
		}
	}

	skipToPrevious = () => {
		try {
			TrackPlayer.play();
			TrackPlayer.skipToPrevious();
		} catch (error) {
			console.log('error', error)
		}
	}
	render() {
		return (
			<PlayerComponent {...this.props}
				onNext={() => { this.skipToNext() }}
				onPrevious={() => { this.skipToPrevious() }}
				onTogglePlayback={() => this.togglePlayback()} />
		);
	}
}

function mapStateToProps(state) {
	const { playerCommonReducer, userDetailsReducer, downloadEpisodeReducer, configurableTextReducer, commonReducer } = state;
	return {
		isPlay: playerCommonReducer.isPlay,
		playerAudioList: playerCommonReducer.audioList,
		playerObject: playerCommonReducer.playerObject,
		volume: playerCommonReducer.playerVolume,
		user: userDetailsReducer.user,
		downloadedIdArray: downloadEpisodeReducer.idArray,
		downloadLimit: configurableTextReducer.downloadLimit,
		bufferState: commonReducer.bufferState,
	};

}

const mapDispatchToProps = (dispatch) => {
	return {
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
		commonAction: bindActionCreators(commonAction, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer);