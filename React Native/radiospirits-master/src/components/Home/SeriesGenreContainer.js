/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: Series Genre Screen.
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import SeriesGenreComponent from './SeriesGenreComponent';
import { bindActionCreators } from 'redux';
import * as screenDataAction from '../../actions/screenDataAction';
import * as playerCommonAction from '../../actions/playerCommonAction';
import * as commonAction from '../../actions/commonAction';
import * as downloadAction from '../../actions/downloadAction';
import * as CONST from '../../utils/Const';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

class SeriesGenreContainer extends Component {
	componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.SEARCH_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.SEARCH_SCREEN , udid });
	}
	render() {
		return (
			<SeriesGenreComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { browseScreenDataReducer, userDetailsReducer, downloadEpisodeReducer, configurableTextReducer, commonReducer } = state;
	return {
		status: browseScreenDataReducer.status,
		episodesList: browseScreenDataReducer.episodes_details,
		genreSeriesList: browseScreenDataReducer.genre_series_details,
		genres: browseScreenDataReducer.genres,
		user: userDetailsReducer.user,
		downloadIdArray: downloadEpisodeReducer.idArray,
		downloadLimit: configurableTextReducer.downloadLimit,
		internetStatus: commonReducer.internetStatus,
		genreSeriesTotalPages: browseScreenDataReducer.genreSeriesTotalPages,
		genreSeriesCurrentPage: browseScreenDataReducer.genreSeriesCurrentPage,
		episodeCurrentPage: browseScreenDataReducer.episodeCurrentPage,
		episodeTotalPages: browseScreenDataReducer.episodeTotalPages
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		commonAction: bindActionCreators(commonAction, dispatch),
		screenDataAction: bindActionCreators(screenDataAction, dispatch),
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
	};
};

SeriesGenreContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(SeriesGenreContainer);