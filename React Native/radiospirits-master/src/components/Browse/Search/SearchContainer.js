/**
 * @author Systango Technologies 
 * Date: Aug 2, 2018
 * Description: Search Screen !
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import SearchComponent from './SearchComponent';
import { bindActionCreators } from 'redux';
import * as screenDataAction from '../../../actions/screenDataAction';
import * as searchDataAction from '../../../actions/searchAction';
import * as playerCommonAction from '../../../actions/playerCommonAction';
import * as commonAction from '../../../actions/commonAction';
import * as downloadAction from '../../../actions/downloadAction';

class SearchContainer extends Component {

	render() {
		return (
			<SearchComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { searchReducer, userDetailsReducer, downloadEpisodeReducer, configurableTextReducer, playerCommonReducer } = state;
	return {
		searchSeriesList: searchReducer.searchSeriesList,
		searchEpisodeList: searchReducer.searchEpisodeList,
		searchWrwList: searchReducer.searchWrwList,
		searchSeriesCurrentPage: searchReducer.searchSeriesCurrentPage,
		searchEpisodeCurrentPages: searchReducer.searchEpisodeCurrentPages,
		searchEpisodeTotalPages: searchReducer.searchEpisodeTotalPages,
		searchSeriesTotalPages: searchReducer.searchSeriesTotalPages,
		user: userDetailsReducer.user,
		downloadIdArray: downloadEpisodeReducer.idArray,
		downloadLimit: configurableTextReducer.downloadLimit,
		playerObject: playerCommonReducer.playerObject,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		commonAction: bindActionCreators(commonAction, dispatch),
		screenDataAction: bindActionCreators(screenDataAction, dispatch),
		searchDataAction: bindActionCreators(searchDataAction, dispatch),
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
	};
};

SearchContainer.propTypes = {

};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);