import { StyleSheet, Platform } from 'react-native';
import screen from '@utils/screen';
import scale,{verticalScale} from '../../utils/scale';
import {fontFamily, BLACK_COLOR, WHITE_COLOR, STATUS_BAR_BACKGROUND_COLOR, GREY_COLOR, TITLEBAR_BACKGROUND_COLOR} from '../../utils/Const';

module.exports = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		backgroundColor: STATUS_BAR_BACKGROUND_COLOR
	},
	viewContainer: {
		flex: 1,
		backgroundColor:WHITE_COLOR,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		marginTop: scale(20),
		fontSize: scale(20),
		textAlign: 'center',
		margin: scale(10),
		color: BLACK_COLOR,
	},
	
});