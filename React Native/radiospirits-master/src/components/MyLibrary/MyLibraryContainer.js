/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: MyLibrary Screen.
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
import MyLibraryComponent from './MyLibraryComponent';
import * as commonAction from '../../actions/commonAction';
import * as playerCommonAction from '../../actions/playerCommonAction';
import * as downloadAction from '../../actions/downloadAction';
import * as recentlyPlayedAction from '../../actions/recentlyPlayedAction';

class MyLibraryContainer extends Component {

	static navigationOptions = {
		title: 'MY LIBRARY',
	};

	render() {
		return (
			<MyLibraryComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer, configurableTextReducer, downloadEpisodeReducer, playerCommonReducer, recentlyPlayedReducer } = state;
	return {
		status: userDetailsReducer.status,
		message: userDetailsReducer.message,
		user: userDetailsReducer.user,
		freeUserMyLibrary: configurableTextReducer.freeUserMyLibrary,
		downloadedEpisode: downloadEpisodeReducer.episodeArray,
		playerObject: playerCommonReducer.playerObject,
		episodeList: recentlyPlayedReducer.episodeList,
		episodeTotalPage: recentlyPlayedReducer.episodeTotalPage,
		episodeCurrentPage: recentlyPlayedReducer.episodeCurrentPage,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		commonAction: bindActionCreators(commonAction, dispatch),
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
		recentlyPlayedAction: bindActionCreators(recentlyPlayedAction, dispatch),
	};
};

MyLibraryContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLibraryContainer);