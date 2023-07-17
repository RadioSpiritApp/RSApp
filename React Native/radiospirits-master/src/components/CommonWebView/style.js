import { StyleSheet, Platform } from 'react-native';
import screen from '@utils/screen';
import scale , {verticalScale} from '../../utils/scale';
import * as CONST from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: CONST.WHITE_COLOR,
	},
	headerContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: CONST.BORDER_COLOR_GREY,
		justifyContent: 'center',
		alignItems:'center',
	},
	backIconContainer: {
		position: 'absolute',
		left:scale(10),
		paddingRight:scale(50),
		paddingVertical: verticalScale(14),
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
	},
	activityIndicatorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems:'center',
	}
});