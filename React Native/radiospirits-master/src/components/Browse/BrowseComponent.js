import React, { Component } from 'react';
import {
	View,
	TextInput,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image,
	FlatList,
	RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import showToast from '../../utils/Toast';
import scale from '../../utils/scale';
import * as CONST from '../../utils/Const';
import EpisodeCell from './EpisodeCell';
import SeriesCell from './SeriesCell';
import GenreSeriesCell from './GenreSeriesCell';
import WhenRadioWasComponent from './WhenRadioWasComponent';
import commonstyles from '../commonstyles';
import MiniPlayer from '../Player/MiniPlayer/MiniPlayerContainer';
import DeviceInfo from 'react-native-device-info';
import NoInternetView from '../Offline/NoInternetView';
import firebase from 'react-native-firebase';
let seriesId;
let seriesHeading;
let seriesImage;
let route;
let genreId;
let genreHeading;
let seriesDescription;

export default class BrowseComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: 1,
			seriesList: [],
			renderEpisodeCell: false,
			renderGenreSeriesCell: false,
			callApi: true,
			searchKeyword: '',
			genreSeriesRefreshing: false,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.reRenderObject && nextProps.reRenderObject !== this.props.reRenderObject) {
			const {
				reRenderObject,
			} = nextProps;
			this.reRenderSelectedTab(reRenderObject);
		}
	}

	componentDidMount() {
		this.props.commonAction.startSpinner();
		this.props.screenDataAction.resetBrowseEpisode();
		this.props.screenDataAction.getBrowseScreenDataAct();
		this.props.screenDataAction.getGenreScreenDataAct();
	}

	reRenderSelectedTab(reRenderObject) {
		const {
			selectedIndex,
			title,
			id,
			image_url,
			artwork,
			series_id,
			series_title,
			series_description
		} = reRenderObject;
		let newSeriesId = '';
		switch (selectedIndex) {
		case 1:
			seriesDescription = series_description;
			seriesHeading = title ? title : series_title;
			newSeriesId = id ? id : series_id;
			if(this.state.renderEpisodeCell && (newSeriesId != seriesId)) {
				const {
					user,
				} = this.props;
				let accessToken = '';
				if (user && user.access_token) {
					accessToken = user.access_token;
				}
				this.props.screenDataAction.resetEpisodeData();
				this.props.commonAction.startSpinner();
				this.props.screenDataAction.getEpisodeScreenDataAct(newSeriesId, accessToken);
			}
			seriesId = newSeriesId;
			seriesImage = image_url ? image_url : artwork;
			this.setState({
				selectedIndex,
				renderGenreSeriesCell: false,
				renderEpisodeCell: true,
			});
			break;
		case 2:
			genreHeading = title;
			genreId = id;
			this.setState({
				selectedIndex,
				renderGenreSeriesCell: true,
				renderEpisodeCell: false,
			});
			break;
		case 3:
			this.setState({
				selectedIndex,
				renderGenreSeriesCell: false,
				renderEpisodeCell: false,
			});
			break;
		}
		this.props.commonAction.reRenderBrowseScreen(null);
	}

	selectedTab(value) {
		this.setState({
			selectedIndex: value,
			renderGenreSeriesCell: false,
			renderEpisodeCell: false,
		});
	}

	seriesCellPressed(item) {
		this.setState({
			renderEpisodeCell: true,
		});
		route = '';
		if(seriesId != item.id){
			const {
				user,
			} = this.props;
			let accessToken = '';
			if (user && user.access_token) {
				accessToken = user.access_token;
			}
			this.props.screenDataAction.resetEpisodeData();
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.getEpisodeScreenDataAct(item.id, accessToken);
		}
		seriesHeading = item.title;
		seriesDescription = item.description;
		seriesId = item.id;
		seriesImage = item.image_url;
	}

	renderListContentSection() {
		const {
			seriesList,
		} = this.props;
		let series = seriesList ? seriesList : [];
		return (
			<SeriesCell
				data={series}
				seriesCellPressed={(item) => this.seriesCellPressed(item)}
				{...this.props}
			/>
		);
	}

	startSearching(searchKeyword) {
		if (searchKeyword == '') {
			showToast('Add keyword to search');
		} else {
			const udid = DeviceInfo.getUniqueID();
			firebase.analytics().logEvent('SEARCHED', { Searched_Keyword : searchKeyword , udid });
			this.props.navigation
				.navigate('SearchScreen', {
					searchKeyword,
					callEpisodePage: (item) => this.seriesCellPressed(item)
				});
			this.setState({
				searchKeyword: '',
			});
		}
	}

	renderSearchBarSection() {
		const {
			selectedIndex,
			searchKeyword
		} = this.state;
		return (
			<View style={styles.topMargin} >
				<View style={styles.searchBox}>
					<View style={styles.searchImageContainer}>
						<Image
							source={CONST.SEARCH_ICON}
						/>
					</View>
					<View style={styles.vLine} />
					<TextInput
						underlineColorAndroid={'transparent'}
						value={searchKeyword}
						placeholder='Search...'
						style={styles.textInput}
						returnKeyType={'search'}
						autoCorrect = {false}
						onChangeText={(text) => this.setState({ searchKeyword: text })}
						onSubmitEditing={() => this.startSearching(searchKeyword)}
					/>
					{searchKeyword !== '' && <View style={styles.crossIconContainer}>
						<TouchableOpacity
							onPress={() => { this.setState({ searchKeyword: '' }); }}
							style={[styles.crossIcon]}>
							<Image source={CONST.CROSS_ICON} />
						</TouchableOpacity>
					</View>}
				</View>
				<View style={{ flexDirection: 'row', marginHorizontal: scale(18), }} >
					<View style={{ justifyContent: 'center', }} >
						<Text style={styles.tagStyle} >
							Browse:
						</Text>
					</View>
					<View style={styles.buttonContainer} >
						<TouchableOpacity
							onPress={() => this.selectedTab(1)}
							style={[styles.tabButtons, selectedIndex === 1 && styles.selectedTab]}
						>
							<Text style={[styles.tabTextStyle, selectedIndex === 1 && styles.selectedTabText]} >
								SERIES
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.selectedTab(2)}
							style={[styles.tabButtons, selectedIndex === 2 && styles.selectedTab]}
						>
							<Text style={[styles.tabTextStyle, selectedIndex === 2 && styles.selectedTabText]} >
								GENRE
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.selectedTab(3)}
							style={[styles.tabButtons, selectedIndex === 3 && styles.selectedTab]}
						>
							<Text style={[styles.tabTextStyle, selectedIndex === 3 && styles.selectedTabText]} >
								WHEN RADIO WAS
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	onPressBackFromEpisode() {
		this.setState({
			renderEpisodeCell: false,
			callApi: route == 'genreScreen' ? false : true,
			renderGenreSeriesCell: route == 'genreScreen' ? true : false,
		});
	}

	renderEpisodeCell() {
		return (
			<EpisodeCell
				seriesHeading={seriesHeading}
				seriesDescription={seriesDescription}
				seriesId={seriesId}
				seriesImage={seriesImage}
				onPressBack={() => this.onPressBackFromEpisode()}
				{...this.props}
			/>
		);
	}

	renderGenreSection() {
		const {
			genres,
		} = this.props;
		return (
			<View style={{ flex: 1 }} >
				<View style={styles.genreHeadingContainer} >
					<Text style={styles.genreMsgtitle} >
						{CONST.GENRE_MSG_TITLE}
					</Text>
				</View>
				{genres && genres.length > 0 ? <View style={{ flex: 1, marginHorizontal: scale(18), marginTop: scale(5) }} >
					<FlatList
						refreshControl={
							<RefreshControl
								refreshing={this.state.genreSeriesRefreshing}
								onRefresh={() => this._onRefreshGenreList()}
							/>
						}
						data={genres}
						extraData={this.state}
						keyExtractor={item => item.id && item.id.toString()}
						renderItem={({ item }) => this.renderGenreList(item)}
					/>
				</View> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_GENRES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}

	_onRefreshGenreList() {
		this.setState({
			genreSeriesRefreshing: true,
		});
		this.props.commonAction.startSpinner();
		this.props.screenDataAction.getGenreScreenDataAct();
		this.setState({
			genreSeriesRefreshing: false,
		});
	}

	renderGenreList(item) {
		return (
			<View >
				<TouchableOpacity
					onPress={() => this.genreItemPressed(item)}
					style={[styles.genreCellStyle]}
				>
					<Text style={[styles.genreCellText]} >
						{item.title}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	genreItemPressed(item) {
		this.setState({
			renderGenreSeriesCell: true,
		});
		genreId = item.id;
		genreHeading = item.title;
	}

	onPressBackFromGenreSeries() {
		this.setState({
			renderGenreSeriesCell: false,
			callApi: true,
		});
	}

	renderGenreSeriesList() {
		return (
			<GenreSeriesCell
				genreHeading={genreHeading}
				genreId={genreId}
				seriesName={'Series Name'}
				onPressBack={() => this.onPressBackFromGenreSeries()}
				onPressSeriesItem={(item) => this.onPressGenreSreiesItem(item)}
				callApi={this.state.callApi}
				{...this.props}
			/>
		);
	}

	onPressGenreSreiesItem(item) {
		route = 'genreScreen';
		seriesId = item.id;
		seriesImage = item.image_url;
		seriesDescription = item.description;
		seriesHeading = item.title;
		this.setState({
			renderEpisodeCell: true,
			renderGenreSeriesCell: false,
		});
	}

	renderRadioWasScreen() {
		return (
			<WhenRadioWasComponent
				{...this.props}
			/>
		);
	}

	render() {
		const {
			selectedIndex,
			renderEpisodeCell,
			renderGenreSeriesCell,
		} = this.state;
		if (this.props.internetStatus) {
			return (
				<SafeAreaView style={styles.container}>
					<View style={{ flex: 1 }} >
						{this.renderSearchBarSection()}
						{(selectedIndex === 1 && !renderEpisodeCell && !renderGenreSeriesCell) && this.renderListContentSection()}
						{(selectedIndex === 2 && !renderGenreSeriesCell && !renderEpisodeCell) && this.renderGenreSection()}
						{!renderEpisodeCell && renderGenreSeriesCell && this.renderGenreSeriesList()}
						{renderEpisodeCell && this.renderEpisodeCell()}
						{!renderEpisodeCell && selectedIndex === 3 && this.renderRadioWasScreen()}
					</View>
					<MiniPlayer {...this.props} />
				</SafeAreaView>
			);
		} else {
			return (
				<NoInternetView />
			);
		}
	}
}


BrowseComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	commonAction: PropTypes.object,
	screenDataAction: PropTypes.object,
	seriesList: PropTypes.array,
	genres: PropTypes.array,
	reRenderObject: PropTypes.object,
	internetStatus: PropTypes.bool,
	user: PropTypes.object,
};