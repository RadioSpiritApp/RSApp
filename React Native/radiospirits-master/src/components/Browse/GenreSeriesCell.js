import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	Image,
	FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import scale from '../../utils/scale';
import * as CONST from '../../utils/Const';
import styles from './style';
import commonstyles from '../commonstyles';

export default class GenreSeriesCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			genreSeriesRefreshing: false,
		};
	}

	componentDidMount() {
		if (this.props.callApi) {
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.resetGenreBrowseData();
			this.props.screenDataAction.getBrowseScreenDataAct(this.props.genreId);
		}
	}

	renderHeaderView() {
		const {
			genreHeading,
			onPressBack,
			navigation,
			initialRoute,
		} = this.props;
		return (
			<View style={[styles.episodeTitleContainer, commonstyles.center, { borderWidth: initialRoute ? 0 : 1 }]} >
				<TouchableOpacity
					onPress={() => onPressBack ? onPressBack() : navigation.goBack()}
					style={{ position: 'absolute', left: scale(15) }}
				>
					<Image
						source={CONST.BACK_ICON}
					/>
				</TouchableOpacity>
				<Text style={styles.genreSeriesTitleText} >
					{genreHeading && genreHeading.toUpperCase()}
				</Text>
			</View>
		);
	}

	renderCommonCenterView(item) {
		const {
			seriesName,
			onPressSeriesItem,
		} = this.props;

		let title = seriesName;
		let containerStyle = styles.listHeadingContainer;
		let textStyle = styles.headingText;
		let isDisabled = true;
		if (item) {
			title = item.item.title;
			containerStyle = styles.listContentStyle;
			textStyle = styles.listTextStyle;
			isDisabled = false;
		}
		return (
			<TouchableOpacity
				disabled={isDisabled}
				onPress={() => onPressSeriesItem(item.item)}
				style={containerStyle}>
				<View style={{ flex: 1, paddingRight: scale(20) }} >
					<Text style={textStyle} >
						{title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	fetchMore() {
		const {
			genreSeriesTotalPages,
			genreSeriesCurrentPage,
		} = this.props;

		if (genreSeriesCurrentPage < genreSeriesTotalPages) {
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.getBrowseScreenDataAct(this.props.genreId, genreSeriesCurrentPage+1);
		}
	}

	renderSeriesList() {
		const {
			genreSeriesList,
		} = this.props;
		let genreSeriesData = genreSeriesList ? genreSeriesList : [];
		return (
			<View style={{ flex: 1 }} >
				<View >
					{this.renderCommonCenterView()}
				</View>
				{genreSeriesData.length > 0 ? <View style={{ flex: 1 }} >
					<FlatList
						data={genreSeriesData}
						extraData={this.state}
						keyExtractor={item => item.id.toString()}
						renderItem={(item) => this.renderCommonCenterView(item)}
						onEndReached={() => this.fetchMore()}
						onEndReachedThreshold={0.2}
					/>
				</View> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_SERIES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}
	
	render() {
		return (
			<View style={{ flex: 1, marginTop: scale(20) }}>
				{this.renderHeaderView()}
				{this.renderSeriesList()}
			</View>
		);
	}
}

GenreSeriesCell.propTypes = {
	commonAction: PropTypes.object,
	screenDataAction: PropTypes.object,
	genreId: PropTypes.number,
	callApi: PropTypes.bool,
	genreHeading: PropTypes.string,
	onPressBack: PropTypes.func,
	navigation: PropTypes.object,
	initialRoute: PropTypes.string,
	seriesName: PropTypes.string,
	onPressSeriesItem: PropTypes.func,
	genreSeriesList: PropTypes.array,
	genreSeriesTotalPages: PropTypes.number,
	genreSeriesCurrentPage: PropTypes.number,
};