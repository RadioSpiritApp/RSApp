import { StyleSheet, Platform } from 'react-native';
import screen from '@utils/screen';
import scale , { verticalScale } from '../../utils/scale';
import {fontFamily, fontWeight , BLACK_COLOR, WHITE_COLOR} from '../../utils/Const';
import * as CONST from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: WHITE_COLOR,
	},
	title: {
		marginTop: scale(20),
		fontSize: scale(20),
		textAlign: 'center',
		margin: scale(10),
		color: BLACK_COLOR,
	},
	headerContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: CONST.BORDER_COLOR_GREY,
		justifyContent: 'center',
		alignItems:'center',
	},
	headerText: {
		marginVertical: verticalScale(16),
		textAlign: 'center',
		fontSize: scale(16),
		fontFamily: CONST.fontFamily.Black,
		color: CONST.BLACK_COLOR,
	},
	bodyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems:'center',
	},
	bodyStyle: {
		width:screen.WIDTH,
		backgroundColor: 'transparent',
	},
	activityIndicatorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems:'center',
	}
});