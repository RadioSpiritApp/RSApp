import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	FlatList,
	RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import scale from '../../utils/scale';
import * as CONST from '../../utils/Const';
import commonstyles from '../commonstyles';

export default class SeriesCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageNo: 1,
			seriesRefreshing: false,
		};
	}

	seriesCellPressed(item) {
		if (this.props.callEpisodePage) {
			this.props.callEpisodePage(item);
		} else {
			this.props.seriesCellPressed(item);
		}
	}

	renderCommonCenterView(item) {
		let title = 'Series Name';
		let genre = 'Genre';
		let containerStyle = styles.listHeadingContainer;
		let textStyle = styles.headingText;
		let isDisabled = true;
		if (item) {
			title = item.title;
			let genreLength = item.genres.length;
			genre = item.genres.map((object, index) => {
				if (index == genreLength - 1) {
					return object.title;
				}
				return object.title + ', ';
			});
			containerStyle = styles.listContentStyle;
			textStyle = styles.listTextStyle;
			isDisabled = false;
		}
		return (
			<TouchableOpacity
				disabled={isDisabled}
				style={containerStyle}
				onPress={() => { this.seriesCellPressed(item); }}
			>
				<View style={{ flex: 0.7, marginRight: scale(20) }} >
					<Text
						numberOfLines={2}
						style={textStyle} >
						{title}
					</Text>
				</View>
				<View style={{ flex: 0.3, }} >
					<Text
						numberOfLines={3}
						style={textStyle}>
						{genre}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	renderSeriesCellSection() {
		const {
			data,
		} = this.props;
		return (
			<View style={{ flex: 1 }} >
				<View >
					{this.renderCommonCenterView()}
				</View>
				{data.length > 0 ? <View style={{ flex: 1 }} >
					<FlatList
						refreshControl={
							<RefreshControl
								refreshing={this.state.seriesRefreshing}
								onRefresh={() => this._onRefreshGenreList()}
							/>
						}
						style={{ flex: 1 }}
						data={data}
						extraData={this.state}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => this.renderCommonCenterView(item)}
						onEndReached={() => this.fetchMore()}
						onEndReachedThreshold={0.2}
					/>
				</View> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_SERIES_AVAILABLE}
					</Text>}
			</View>
		);
	}

	_onRefreshGenreList() {
		this.setState({
			seriesRefreshing: true,
		});
		this.props.commonAction.startSpinner();
		this.props.screenDataAction.resetBrowseEpisode();
		this.props.screenDataAction.getBrowseScreenDataAct();
		this.setState({
			seriesRefreshing: false,
		});
	}

	fetchMore() {
		const {
			seriesCurrentPage,
			seriesTotalPages,
			searchSeriesTotalPages,
			searchSeriesCurrentPage,
			fetchSeries,
			searchKeyword
		} = this.props;
		if (fetchSeries) {
			if (searchSeriesCurrentPage < searchSeriesTotalPages) {
				this.props.commonAction.startSpinner();
				this.props.searchDataAction.searchSeriesAct(searchKeyword, searchSeriesCurrentPage + 1);
			}
		}
		else if (seriesCurrentPage < seriesTotalPages) {
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.getBrowseScreenDataAct('', seriesCurrentPage + 1);
		}
	}

	render() {
		return (
			<View style={{ marginTop: scale(20), flex: 1 }} >
				{this.renderSeriesCellSection()}
			</View>
		);
	}

}

SeriesCell.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	commonAction: PropTypes.object,
	screenDataAction: PropTypes.object,
	searchDataAction: PropTypes.object,
	data: PropTypes.array,
	seriesCurrentPage: PropTypes.number,
	seriesTotalPages: PropTypes.number,
	searchSeriesTotalPages: PropTypes.number,
	searchSeriesCurrentPage: PropTypes.number,
	fetchSeries: PropTypes.bool,
	searchKeyword: PropTypes.string,
	callEpisodePage: PropTypes.func,
	seriesCellPressed: PropTypes.func,
};
