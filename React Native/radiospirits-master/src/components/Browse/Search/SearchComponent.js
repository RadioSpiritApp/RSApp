import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '.././style';
import scale from '../../../utils/scale';
import * as CONST from '../../../utils/Const';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import SearchEpisodeCell from './SearchEpisodeCell';
import SeriesCell from '../SeriesCell';
import WhenRadioWasComponent from '../WhenRadioWasComponent';
import MiniPlayer from '../../Player/MiniPlayer/MiniPlayerContainer';
let searchKeyword;

export default class SearchComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: 0,
			page: 1,
		};
	}

	componentDidMount() {
		let accessToken = '';
		let sortBy = 'series_title';
		const {
			user,
		} = this.props;
		if (user && user.access_token) {
			accessToken = user.access_token;
		}
		searchKeyword = this.props.navigation.state.params.searchKeyword;
		this.props.commonAction.startSpinner();
		this.props.searchDataAction.resetSearchSeries();
		this.props.searchDataAction.resetSearchEpisode();
		this.props.searchDataAction.resetSearchWhenRadioWasEpisode();
		this.props.searchDataAction.searchSeriesAct(searchKeyword, this.state.page, sortBy, accessToken);
	}

	onPressBack() {
		this.props.navigation.goBack();
	}

	renderHeader() {
		return (
			<View style={styles.searchHeader} >
				<View style={styles.headingContainer} >
					<Text style={styles.searchHeaderText} >
						Search results for “{searchKeyword}”
					</Text>
					<TouchableOpacity
						onPress={() => this.onPressBack()}
						style={{ position: 'absolute', left: scale(10) }}
					>
						<Image
							source={CONST.BACK_ICON}
						/>
					</TouchableOpacity>
				</View>
				<SegmentedControlTab
					tabsContainerStyle={styles.tabsContainerStyle}
					tabStyle={styles.segmentedTabStyle}
					values={['SERIES', 'EPISODE', 'WHEN RADIO WAS']}
					selectedIndex={this.state.selectedIndex}
					onTabPress={(index) => this.handleIndexChange(index)}
					tabTextStyle={styles.segmentedInactiveTabTextStyle}
					activeTabTextStyle={styles.segmentedTabTextStyle}
					activeTabStyle={styles.segmentedActiveTabStyle}
					borderRadius={5}
					allowFontScaling={false}
				/>
			</View>
		);
	}

	handleIndexChange(index) {
		this.setState({
			selectedIndex: index,
		});
	}

	callEpisodePage(item) {
		this.props.navigation.state.params.callEpisodePage(item);
		this.props.navigation.goBack();
	}

	renderSeriesCell() {
		const {
			searchSeriesList
		} = this.props;
		const data = searchSeriesList ? searchSeriesList : [];
		return (
			<SeriesCell
				data={data}
				callEpisodePage={(item) => this.callEpisodePage(item)}
				fetchSeries
				searchKeyword={searchKeyword}
				{...this.props}
			/>
		);
	}

	renderEpisodeCell() {
		const {
			searchEpisodeList
		} = this.props;
		const searchedEpisodeData = searchEpisodeList ? searchEpisodeList : [];
		return (
			<SearchEpisodeCell
				searchedEpisodeData={searchedEpisodeData}
				searchKeyword={searchKeyword}
				{...this.props}
			/>
		);
	}

	renderWhenRadioWas() {
		const {
			searchWrwList,
		} = this.props;
		const searchedWrwEpisodeData = searchWrwList ? searchWrwList : [];
		return (
			<WhenRadioWasComponent
				searchWrwList={searchedWrwEpisodeData}
				{...this.props}
			/>
		);
	}

	render() {
		const {
			selectedIndex,
		} = this.state;
		return (
			<SafeAreaView style={styles.container}>
				{this.renderHeader()}
				{selectedIndex == 0 && this.renderSeriesCell()}
				{selectedIndex == 1 && this.renderEpisodeCell()}
				{selectedIndex == 2 && this.renderWhenRadioWas()}
				<MiniPlayer {...this.props} />
			</SafeAreaView>
		);
	}

}

SearchComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	commonAction: PropTypes.object,
	searchDataAction: PropTypes.object,
	searchSeriesList: PropTypes.array,
	searchEpisodeList: PropTypes.array,
	searchWrwList: PropTypes.array,
	user: PropTypes.object,
};