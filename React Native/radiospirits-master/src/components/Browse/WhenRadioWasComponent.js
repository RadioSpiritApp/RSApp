import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
	FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import scale from '../../utils/scale';
import Validators from '../../utils/Validator';
import * as CONST from '../../utils/Const';
import commonstyles from '../commonstyles';
import showToast from '../../utils/Toast';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

export default class WhenRadioWasComponent extends Component {
	constructor(props) {
		super(props);
		this.onEndReachedCalledDuringMomentum=true;
		this.state = {
		};
	}

	componentDidMount() {
		if (!this.props.searchWrwList) {
			this.props.screenDataAction.resetWrwData();
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.getWhenRadioWasEpisodeAct();
		}
	}
	fetchMore() {
		const {
			wrwCurrentPage,
			wrwTotalPages,
			searchWrwList,
		} = this.props;
		if (!searchWrwList && wrwCurrentPage<wrwTotalPages && !this.onEndReachedCalledDuringMomentum) {	
			let lastPlayDate=this.props.wrwEpisodesList[this.props.wrwEpisodesList.length-1].title;
			this.onEndReachedCalledDuringMomentum = true;
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.getWhenRadioWasEpisodeAct(wrwCurrentPage + 1,lastPlayDate);
		}
	}

	renderListSection() {
		const {
			wrwEpisodesList,
			searchWrwList
		} = this.props;
		let sectionListData = searchWrwList ? searchWrwList : (wrwEpisodesList ? wrwEpisodesList : []);
		sectionListData = sectionListData.map((object, index) => {
			return ({ ...object, index });
		});
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.divider} />
				{sectionListData && sectionListData.length > 0 ? <View
					showsVerticalScrollIndicator={false}
					style={{ marginHorizontal: scale(20), flex: 1 }}>
					<FlatList
						style={{ flex: 1 }}
						data={sectionListData}
						renderItem={({ item, index }) => this._renderSection(item, index)}
						keyExtractor={(item, index) => index}
						onEndReached={() => this.fetchMore()}
						onEndReachedThreshold={0.1}
						bounces={false}
						SectionSeparatorComponent={({ leadingItem }) =>
							leadingItem ? (
								<View style={[styles.headerSeparator]}></View>
							) : null
						}
						onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
					/>
				</View> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_EPISODES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}

	_renderSection(section, sectionIndex) {
		return (
			<View style={{
				borderBottomWidth: 0.5,
				borderColor: CONST.BORDER_COLOR_GREY_LIGHT,
			}}>
				<View style={[styles.sectionHeaderStyle]}>
					<Text style={styles.sectionHeaderTextStyle} >
						{'When Radio Was for ' + section.title}
					</Text>
				</View>
				<FlatList
					style={{ flex: 1 }}
					data={section.data}
					renderItem={({ item, index }) => this._renderItem(item, section, index, sectionIndex)}
					keyExtractor={(item, index) => index}
				/>
			</View>
		);
	}

	_renderItem(item, section, index, sectionIndex) {
		let itemLength = section.data.length;
		let hideDivider = index === itemLength - 1;
		return (
			<View style={styles.listBorderStyle} >
				<TouchableOpacity
					onPress={() => this.onPressEpisodeList(item, section, sectionIndex)}
					style={styles.sectionListItemStyle}>
					<Text
						numberOfLines={1}
						style={styles.sectionListItemTextStyle}> {item.series_title} </Text>
					<Text
						numberOfLines={1}
						style={[styles.sectionListItemTextStyle, { color: CONST.GREY_COLOR }]}> {item.title} </Text>
					<Text style={styles.sectionListItemDateTextStyle}>{Validators.dateFormatter(item.original_air_date)} </Text>
				</TouchableOpacity>
				{!hideDivider && <View style={styles.listDivider} />}
			</View>
		);
	}

	onPressEpisodeList(audioDetails, allData, sectionIndex) {
		const {
			playerObject,
			user,
		} = this.props;
		const udid = DeviceInfo.getUniqueID();
		let alreadyPlaying = allData.data.find((item) => {
			return item.id == (playerObject && playerObject.id);
		});
		if (alreadyPlaying) {
			showToast('Already Playing...');
			return;
		}
		firebase.analytics().logEvent('WHEN_RADIO_WAS_EPISODE_PLAYED', { Episode_Id : audioDetails.id , Title : audioDetails.title , udid });
		this.props.commonAction.playerType(CONST.FREE_PLAYER);
		if (!user || (user && !user.is_paid_user)) {
			if (sectionIndex >= 3) {
				this.props.commonAction.showPremiumModal();
			}
			else {
				this.props.playerCommonAction.getPlayerDataAct(audioDetails, udid, allData);
			}
		} else {
			this.props.playerCommonAction.getPremiumPlayerDataAct(audioDetails, udid, user.access_token, allData);
		}
	}

	render() {
		return (
			<SafeAreaView style={[styles.container]}>
				{this.renderListSection()}
			</SafeAreaView>
		);
	}
}


WhenRadioWasComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	commonAction: PropTypes.object,
	screenDataAction: PropTypes.object,
	playerCommonAction: PropTypes.object,
	searchWrwList: PropTypes.object,
	wrwEpisodesList: PropTypes.array,
	user: PropTypes.object,
	playerObject: PropTypes.object,
	wrwCurrentPage: PropTypes.number,
	wrwTotalPages: PropTypes.number,
};