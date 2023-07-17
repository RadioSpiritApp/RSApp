/**
 * @author Systango Technologies
 * Date: Oct 25, 2018 
 * Description: Global No Internet View 
 * 
 */
import React, { Component } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import styles from './style';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
class NoInternetView extends Component {

	constructor(props) {
		super(props);
	}
	render() {
		return (
			<SafeAreaView style={styles.safeAreaView}>
				<View style={styles.viewContainer}>
					<Text style={styles.title}>No Internet Connection</Text>
				</View>
			</SafeAreaView>
		);
	}
}
function mapStateToProps(state) {
	const { commonReducer } = state;
	return {
		isFetching: commonReducer.isFetching
	};
}

NoInternetView.propTypes = {
	isFetching: PropTypes.bool
};

export default connect(mapStateToProps)(NoInternetView);
