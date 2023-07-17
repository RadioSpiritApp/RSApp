/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: Home Screen.
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HomeComponent from './HomeComponent';
import showToast from '../../utils/Toast';
import * as commonAction from '../../actions/commonAction';
import * as downloadAction from '../../actions/downloadAction';
import * as playerCommonAction from '../../actions/playerCommonAction';
import * as screenDataAction from '../../actions/screenDataAction';
import * as bookmarkAction from '../../actions/bookmarkAction';
import * as signinAction from '../../actions/signinAction';
import resetRoute from '../../utils/resetRoute';
import { getRootNavigation } from '../../AppRoot';
import TrackPlayer from 'react-native-track-player';

class HomeContainer extends Component {
	
	componentDidMount() {
		TrackPlayer.setupPlayer();
		TrackPlayer.updateOptions({
			stopWithApp: true,
			capabilities: [
				TrackPlayer.CAPABILITY_PLAY,
				TrackPlayer.CAPABILITY_PAUSE,
			]
		});
	}
	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			if (!this.props.status && this.props.message !== prevProps.message && this.props.message != '') {
				showToast(this.props.message);
			}
			if (this.props.internetStatus != prevProps.internetStatus) {
				if (!this.props.internetStatus) {
					this.props.navigation.navigate('MYLIBRARY');
				} else {
					resetRoute('TabScreen', getRootNavigation());
				}
			}
		}
	}

	render() {
		return (
			<HomeComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer, homeScreenDataReducer, playerCommonReducer, commonReducer, downloadEpisodeReducer } = state;
	return {
		status: userDetailsReducer.status,
		message: userDetailsReducer.message,
		user: userDetailsReducer.user,
		page_details: homeScreenDataReducer.page_details,
		playerStatus: playerCommonReducer.status,
		playerMessage: playerCommonReducer.message,
		internetStatus: commonReducer.internetStatus,
		playerObject: playerCommonReducer.playerObject,
		downloadIdArray: downloadEpisodeReducer.idArray,
		downloadedEpisode: downloadEpisodeReducer.episodeArray,
		userId: downloadEpisodeReducer.userId,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		commonAction: bindActionCreators(commonAction, dispatch),
		screenDataAction: bindActionCreators(screenDataAction, dispatch),
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		bookmarkAction: bindActionCreators(bookmarkAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
		signinAction: bindActionCreators(signinAction, dispatch),
	};
};

HomeContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	internetStatus: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);