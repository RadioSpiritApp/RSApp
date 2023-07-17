/**
 * @author Systango Technologies
 * Date: August 8, 2018 
 * Description: Free Player Screen.
 * 
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FreePlayerComponent from './FreePlayerComponent';
import * as commonAction from '../../../actions/commonAction';
import * as advertisementAction from '../../../actions/advertisementAction';
import * as playerCommonAction from '../../../actions/playerCommonAction';
import * as downloadAction from '../../../actions/downloadAction';
import TrackPlayer from 'react-native-track-player';

class FreePlayerContainer extends Component {

	componentDidMount() {
		this.props.commonAction.startSpinner();
		this.props.advertisementAction.getAdvertisementAct();
	}
	togglePlayback = async () => {
		const currentTrack = await TrackPlayer.getCurrentTrack();
		if (currentTrack == null) {
			TrackPlayer.reset();
			await TrackPlayer.add(this.props.audioList);
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
			<FreePlayerComponent {...this.props} onTogglePlayback={() => this.togglePlayback()} />
		);
	}
}

function mapStateToProps(state) {
	const { playerCommonReducer, advertisementReducer, userDetailsReducer, downloadEpisodeReducer, configurableTextReducer, commonReducer } = state;
	return {
		freeEpisodeList: playerCommonReducer.freeEpisodeList,
		adObject: advertisementReducer.adObject,
		isPlay: playerCommonReducer.isPlay,
		playerObject: playerCommonReducer.playerObject,
		user: userDetailsReducer.user,
		volume: playerCommonReducer.playerVolume,
		downloadedIdArray: downloadEpisodeReducer.idArray,
		downloadLimit: configurableTextReducer.downloadLimit,
		bufferState: commonReducer.bufferState,
	};

}

const mapDispatchToProps = (dispatch) => {
	return {
		commonAction: bindActionCreators(commonAction, dispatch),
		advertisementAction: bindActionCreators(advertisementAction, dispatch),
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
	};
};

FreePlayerContainer.propTypes = {
	navigation: PropTypes.object,
	commonAction: PropTypes.object,
	advertisementAction: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(FreePlayerContainer);