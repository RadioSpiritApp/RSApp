import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	WebView,
	ActivityIndicator
} from 'react-native';
import styles from './style';
import * as CONST from '../../utils/Const';
import MiniPlayer from '../Player/MiniPlayer/MiniPlayerContainer';
import DeviceInfo from 'react-native-device-info';
import NoInternetView from '../Offline/NoInternetView';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';

export default class BonusComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.BONUS_TAB_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.BONUS_TAB_SCREEN , udid });
	}

	renderBodySection() {
		return (
			<View style={styles.bodyContainer}>
				<WebView
					style={styles.bodyStyle}
					source={{uri:CONST.BONUS_URI+'?referenceId='+this.props.referenceId}}
					showsVerticalScrollIndicator={false}
					renderLoading={()=>{return(<View style={styles.activityIndicatorContainer}><ActivityIndicator size='large' color={CONST.GREY_COLOR}/></View>);}}
					startInLoadingState={true}
				/>
			</View>
		);
	}
	render() {
		if(this.props.internetStatus){
			return (
				<SafeAreaView style={styles.container}>
					<View style={{flex:1}}>
						{this.renderBodySection()}
					</View>
					<MiniPlayer {...this.props}/>
				</SafeAreaView>
			);
		}else {
			return (
				<NoInternetView/>
			);
		}	
	}
}

BonusComponent.propTypes = {
	referenceId: PropTypes.string,
	internetStatus: PropTypes.bool,
};