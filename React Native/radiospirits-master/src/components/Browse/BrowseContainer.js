/**
 * @author Systango Technologies 
 * Date: Aug 2, 2018
 * Description: Browse Screen !
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import BrowseComponent from './BrowseComponent';
import { bindActionCreators } from 'redux';
import * as screenDataAction from '../../actions/screenDataAction';
import * as commonAction from '../../actions/commonAction';
import * as playerCommonAction from '../../actions/playerCommonAction';
import * as downloadAction from '../../actions/downloadAction';


class BrowseContainer extends Component {
	render() {
		return (
			<BrowseComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { browseScreenDataReducer, userDetailsReducer, downloadEpisodeReducer, configurableTextReducer, playerCommonReducer, commonReducer } = state;
	return {
		status: browseScreenDataReducer.status,
		message: browseScreenDataReducer.message,
		seriesList: browseScreenDataReducer.series_details,
		episodesList: browseScreenDataReducer.episodes_details,
		genreSeriesList: browseScreenDataReducer.genre_series_details,
		genres: browseScreenDataReducer.genres,
		wrwEpisodesList: browseScreenDataReducer.wrwEpisodesList,
		seriesTotalPages: browseScreenDataReducer.seriesTotalPages,
		seriesCurrentPage: browseScreenDataReducer.seriesCurrentPage,
		user: userDetailsReducer.user,
		reRenderObject: browseScreenDataReducer.reRenderObject,
		downloadIdArray: downloadEpisodeReducer.idArray,
		downloadLimit: configurableTextReducer.downloadLimit,
		playerObject: playerCommonReducer.playerObject,
		internetStatus: commonReducer.internetStatus,
		genreSeriesTotalPages: browseScreenDataReducer.genreSeriesTotalPages,
		genreSeriesCurrentPage: browseScreenDataReducer.genreSeriesCurrentPage,
		wrwCurrentPage: browseScreenDataReducer.wrwCurrentPage,
		wrwTotalPages: browseScreenDataReducer.wrwTotalPages,
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

BrowseContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	internetStatus: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseContainer);