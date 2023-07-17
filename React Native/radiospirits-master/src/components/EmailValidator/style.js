import { StyleSheet } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import { BLACK_COLOR, WHITE_COLOR, fontFamily } from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		alignItems: 'center',
	},
	imageStyle: {
		marginTop: verticalScale(105),
		height: scale(95),
		width: scale(95),
		alignSelf: 'center',
	},
	titleHeaderStyle: {
		marginTop: verticalScale(40),
		paddingHorizontal: scale(40),
		color: BLACK_COLOR,
		fontSize: scale(22),
		lineHeight: scale(24.5),
		textAlign: 'center',
		fontFamily: fontFamily.Bold,
	},
	titleContentStyle: {
		marginTop: verticalScale(22),
		paddingHorizontal: scale(70),
		color: BLACK_COLOR,
		fontSize: scale(14.5),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
	},
	buttonBtnStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: scale(26),
		backgroundColor: BLACK_COLOR,
		height: verticalScale(55),
		marginBottom: verticalScale(25),
	},
	buttonTextStyle: {
		color: WHITE_COLOR,
		fontSize: scale(15),
		lineHeight: scale(22),
		textAlign: 'center',
		fontFamily: fontFamily.Bold,
	},
	backIconContainer: {
		paddingLeft: 10,
		paddingVertical: 10,
		width: verticalScale(50),
	},
	emailIconContainer: {
		backgroundColor: WHITE_COLOR,
	}
});