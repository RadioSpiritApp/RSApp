import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image,
	ActivityIndicator,
	WebView,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import * as CONST from '../../utils/Const';

export default class CommonWebViewComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	renderHeaderSection() {
		let { header } = this.props.navigation.state.params;
		return (
			<View style={styles.headerContainer}>
				<TouchableOpacity
					style={styles.backIconContainer}
					onPress={() => this.props.navigation.goBack()}>
					<Image source={CONST.BACK_ICON} />
				</TouchableOpacity>
				<Text style={styles.headerText}>
					{header}
				</Text>
			</View>
		);
	}

	renderBodySection() {
		let { uri } = this.props.navigation.state.params;
		return (
			<View style={styles.bodyContainer}>
				<WebView
					style={styles.bodyStyle}
					source={{uri}}
					showsVerticalScrollIndicator={false}
					renderLoading={()=>{return(<View style={styles.activityIndicatorContainer}><ActivityIndicator size='large' color={CONST.GREY_COLOR}/></View>);}}
					startInLoadingState={true}
				/>
			</View>
		);
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				{this.renderHeaderSection()}
				{this.renderBodySection()}
			</SafeAreaView>
		);
	}
}

CommonWebViewComponent.propTypes = {
	navigation: PropTypes.object,
};