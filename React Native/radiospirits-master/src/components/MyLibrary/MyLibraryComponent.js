import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	Alert
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import * as CONST from '../../utils/Const';
import Validators from '../../utils/Validator';
import scale, { verticalScale } from '../../utils/scale';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import ModalDropdown from 'react-native-modal-dropdown';
import Swipeout from 'react-native-swipeout';
import { getRootNavigation } from '../../AppRoot';
import { BLACK_COLOR, WHITE_COLOR } from '../../utils/Const';
import MiniPlayer from '../Player/MiniPlayer/MiniPlayerContainer';
import RecentlyPlayedCell from './RecentlyPlayedCell';
import commonstyles from '../commonstyles';
import { getIsConnectedStatus } from '../Offline/Offline.js';
import showToast from '../../utils/Toast';
import firebase from 'react-native-firebase';

let _ = require('lodash');
import DeviceInfo from 'react-native-device-info';
let sortedEpisodeArray = [];

export default class MyLibraryComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: 0,
			activeRow: null,
			selectedFilterIndex: '0',
			selectedFilterValue: 'Series Name',
		};
	}

	componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.MY_LIBRARY_TAB_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.MY_LIBRARY_TAB_SCREEN , udid });
	}

	handleIndexChange(index) {
		this.setState({
			selectedIndex: index,
		});
	}

	onSelectFilter(index, value) {
		const {
			selectedFilterIndex,
		} = this.state;
		if (selectedFilterIndex != index) {
			this.setState({
				selectedFilterIndex: index,
				selectedFilterValue: value,
				activeRow: null,
			});
		}
	}

	renderFilterComponent() {
		return (
			<View style={styles.filterContainer}>
				<View style={{ flexDirection: 'row', alignItems: 'center', }}>
					<Text style={styles.fliterText}>Sort By:</Text>
					<View>
						<ModalDropdown
							options={CONST.RECENTLY_PLAYED_OPTION}
							defaultValue={CONST.RECENTLY_PLAYED_OPTION[0]}
							defaultIndex={parseInt(this.state.selectedFilterIndex)}
							showsVerticalScrollIndicator={false}
							style={styles.dropdownStyle}
							dropdownStyle={[styles.dropdownListStyle, { height: scale(37) * 3 }]}
							textStyle={styles.dropdownTextStyle}
							dropdownTextStyle={styles.dropdownListTextStyle}
							onSelect={(index, value) => this.onSelectFilter(index, value)}
						/>
						<Image style={styles.dropdownArrowImage} source={CONST.DROPDOWN_ICON} />
					</View>
				</View>
				<Text style={styles.fliterNoteText}>Swipe to delete an Episode</Text>
			</View>
		);
	}

	renderHeader() {
		return (
			<View style={styles.headerStyle}>
				<Text style={[styles.headerContentStyle, styles.episodeContainer]}>Episode Name</Text>
				<Text style={[styles.headerContentStyle, styles.durationContainer]}>Duration</Text>
			</View>
		);
	}

	renderPremiumEpisode(item) {
		return (
			<TouchableOpacity style={styles.cellStyle}
				onPress={() => { this.playDownloaded(item); }}
			>
				<View style={styles.episodeContainer}>
					<Text style={styles.episodeSeriesTextStyle}>
						{item.series_title}
					</Text>
					<Text style={styles.episodeTextStyle}>
						{item.title}
					</Text>
					<Text style={styles.episodeDateStyle}>
						{Validators.dateFormatter(item.original_air_date)}
					</Text>
				</View>
				<View style={styles.durationContainer}>
					<Text style={styles.durationContentTextStyle}>
						{Validators.timeFormatDescriptive(item.duration)}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	renderWrwEpisode(item, wrwList) {
		wrwList.length = wrwList.length > 2 ? 2 : wrwList.length;
		return (
			<TouchableOpacity style={styles.cellStyle}
				onPress={() => { this.playWRWDownloaded(item); }}
			>
				<View style={styles.episodeContainer}>
					<Text style={styles.episodeSeriesTextStyle}>
						{'When Radio Was for'} {Validators.dateFormatter(item.play_date)}
					</Text>
					{wrwList.map((object, index) => {
						return (
							<Text key={index} style={styles.episodeTextStyle}>
								{object.series_title} {Validators.dateFormatter(object.original_air_date)}
							</Text>
						);
					})}
				</View>
				<View style={styles.durationContainer}>
					<Text style={styles.durationContentTextStyle}>
						{Validators.timeFormatDescriptive(item.duration)}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	_renderDownloadItem({ item, index }) {
		var swipeoutBtns = [
			{
				component: (
					(<TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(255,47,58)', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.deletePopUp(index)}
					>
						<Text style={{ fontSize: scale(13), lineHeight: scale(14.5), color: 'white' }}>
							{'Delete'}
						</Text>
					</TouchableOpacity>)
				),
			}
		];
		let wrwData = item.wrwList ? item.wrwList : null;
		return (
			<View style={{ paddingTop: verticalScale(12) }}>
				<Swipeout
					backgroundColor={'white'}
					autoClose={true}
					right={swipeoutBtns}
					rowID={index}
					close={this.state.activeRow !== index}
					onOpen={() => {
						this.setState({ activeRow: index });
					}}
				>
					{!wrwData ?
						this.renderPremiumEpisode(item) :
						this.renderWrwEpisode(item, wrwData)
					}
				</Swipeout>
				<View style={styles.hLine}>
				</View>
			</View>
		);
	}

	playDownloaded(item) {
		this.props.commonAction.playerType(CONST.PREMIUM_PLAYER);
		this.props.playerCommonAction.changeState(true);
		this.props.playerCommonAction.getPremiumPlayerOfflineAct(item);
	}

	playWRWDownloaded(item) {
		let freeEpisodeList ={ title:Validators.dateFormatter(item.play_date), data:item.wrwList };
		this.props.commonAction.playerType(CONST.FREE_PLAYER);
		this.props.playerCommonAction.freeEpisodeList(freeEpisodeList);
		this.props.playerCommonAction.changeState(true);
		this.props.playerCommonAction.getPremiumPlayerOfflineAct(item);
	}

	deleteEpisode(index) {
		const {
			downloadedEpisode,
		} = this.props;

		let item = downloadedEpisode[index];
		const udid = DeviceInfo.getUniqueID();
		this.setState({ activeRow: null });
		this.props.downloadAction.deleteDownloadEpisodeAct(index);
		firebase.analytics().logEvent('EPISODE_DELETED', { Episode_Id : item.id , Title : item.title , udid });
	}

	deletePopUp(index) {
		const {
			downloadedEpisode,
			playerObject,
		} = this.props;

		let id = sortedEpisodeArray[index].id;
		
		index = downloadedEpisode.findIndex((element) => {
			return element.id == id;
		});

		if (playerObject && downloadedEpisode[index].id === playerObject.id) {
			alert('Already playing audio cannot be deleted');
		}
		else {
			Alert.alert(
				'Are you sure you want to delete this episode.',
				'',
				[
					{
						text: 'CANCEL', onPress: () => { this.setState({ activeRow: null }); }
					},
					{
						text: 'OK', onPress: () => { this.deleteEpisode(index); }
					},
				]
			);
		}
	}

	renderDownloadFlatList(data) {
		let filterArray = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].wrwList) {
				filterArray.push(data[i]);
			}
		}
		data = data.filter((item) =>
			!item.wrwList
		);
		data = data.concat(filterArray);
		return (
			<View style={{ flex: 1 }}>
				{data.length > 0 ?
					<FlatList
						style={{ flex: 1 }}
						data={data}
						renderItem={({ item, index }) => this._renderDownloadItem({ item, index })}
						keyExtractor={item => item.index}
						extraData={this.state}
					/>
					:
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_EPISODES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}

	renderDownloads() {
		const {
			downloadedEpisode
		} = this.props;
		switch (this.state.selectedFilterValue) {
		case 'Air Date':
			sortedEpisodeArray = downloadedEpisode.sort((oldArray, newArray) =>
				new Date(oldArray.original_air_date) - new Date(newArray.original_air_date)
			);
			break;
		case 'Series Name':
			sortedEpisodeArray = _.sortBy(downloadedEpisode, ['series_title', 'original_air_date']);
			break;
		case 'Episode Name':
			sortedEpisodeArray = _.sortBy(downloadedEpisode, ['title', 'original_air_date']);
			break;
		}
		return (
			<View style={{ flex: 1 }}>
				{this.renderFilterComponent()}
				{this.renderHeader()}
				{this.renderDownloadFlatList(sortedEpisodeArray)}
			</View>
		);

	}

	renderRecentlyPlayed() {
		return (
			<RecentlyPlayedCell {...this.props} />
		);
	}

	showPlans() {
		if (!getIsConnectedStatus()) {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
		else {
			getRootNavigation().navigate('Subscriptionscreen');
		}
	}

	renderFreeUserScreen() {
		const {
			heading,
			sub_heading,
			button_text,
		} = this.props.freeUserMyLibrary;

		return (
			<View style={styles.freeUserContainer}>
				<Image style={styles.freeUserImage} source={CONST.HAND_ICON} />
				<View style={styles.freeUserHeadingContainer}>
					<Text numberOfLines={1} style={styles.freeUserHeadingText}>
						{heading}
					</Text>
				</View>
				<View style={styles.freeUserSubHeadingContainer}>
					<Text numberOfLines={2} style={styles.freeUserSubHeadingText}>
						{sub_heading}
					</Text>
				</View>
				<TouchableOpacity style={styles.freeUserButtonContainer}
					onPress={() => this.showPlans()}
				>
					<Text numberOfLines={1} style={styles.freeUserButtonText}>
						{button_text}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	renderPremiumUserScreen() {
		const { selectedIndex } = this.state;
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.segmentedTabContainer}>
					<SegmentedControlTab
						tabsContainerStyle={styles.tabContainerStyle}
						values={['DOWNLOADS', 'RECENTLY PLAYED']}
						selectedIndex={this.state.selectedIndex}
						onTabPress={(index) => this.handleIndexChange(index)}
						tabStyle={{ borderColor: 'rgba(0,0,0,.6)' }}
						activeTabStyle={{ backgroundColor: BLACK_COLOR, }}
						tabTextStyle={styles.tabTextStyle}
						activeTabTextStyle={[styles.tabTextStyle, { color: WHITE_COLOR }]}
						borderRadius={5}
						allowFontScaling={false}
					/>
				</View>
				<View style={{ flex: 1 }}>
					{selectedIndex === 0 && this.renderDownloads()}
					{selectedIndex === 1 && this.renderRecentlyPlayed()}
				</View>
			</View>
		);
	}

	render() {
		const {
			user,
		} = this.props;
		return (
			<SafeAreaView style={styles.container}>
				{(!user || !user.is_paid_user) ?
					this.renderFreeUserScreen()
					:
					this.renderPremiumUserScreen()
				}
				<MiniPlayer {...this.props} />
			</SafeAreaView>
		);
	}
}

MyLibraryComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	user: PropTypes.object,
	freeUserMyLibrary: PropTypes.object,
	downloadAction: PropTypes.object,
	playerObject: PropTypes.object,
	playerCommonAction: PropTypes.object,
	commonAction: PropTypes.object,
	downloadedEpisode: PropTypes.array,
};