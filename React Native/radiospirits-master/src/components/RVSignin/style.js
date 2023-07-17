import { StyleSheet, Platform } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import { BLACK_COLOR, WHITE_COLOR, fontFamily, ICON_BG } from '../../utils/Const';
module.exports = StyleSheet.create({
	container: {
		flex: 1,
	},
	titleText: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		textAlign: 'center',
		paddingHorizontal: Platform.OS == 'ios' ? scale(57) : scale(50),
		fontFamily: fontFamily.Regular,
		lineHeight: scale(22.5),
	},
	emailIconContainer: {
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#d0d0d0',
		justifyContent: 'center',
		alignItems: 'center',
		height: verticalScale(55.5),
		width: verticalScale(55),
		backgroundColor: ICON_BG,
	},
	subsContainer: {
		height: verticalScale(55),
		backgroundColor: BLACK_COLOR,
		justifyContent: 'center',
		marginTop: verticalScale(22),
	},
	subsText: {
		color: WHITE_COLOR,
		fontSize: scale(16),
		textAlign: 'center',
		lineHeight: scale(22),
		fontFamily: fontFamily.Bold,
	},
	emailInput: {
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: verticalScale(55),
		borderColor: '#d0d0d0',
		fontSize: scale(14),
		textAlign: 'left',
		padding: verticalScale(10),
		paddingRight: verticalScale(30),
		fontFamily: fontFamily.Regular,
	},
	subTitle: {
		color: BLACK_COLOR,
		fontSize: scale(12),
		textAlign: 'center',
		marginTop: verticalScale(20),
	},
	crossIconContainer: {
		backgroundColor: 'transparent',
		height: verticalScale(55),
		position: 'absolute',
		right: 0,
		top: 0
	},
	crossIcon: {
		padding: 10,
		height: verticalScale(55),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	backIconContainer: {
		marginTop: scale(15),
		marginBottom: scale(10),
		paddingLeft: scale(10),
		paddingVertical: scale(10),
		width: verticalScale(50),
	},
	logoContainer: {
		marginTop: scale(5),
	},
	boldText: {
		fontFamily: fontFamily.Bold,
	},
	semiBoldText: {
		fontFamily: fontFamily.Bold,
	},
	accountHeading: {
		marginTop: verticalScale(65),
		alignItems: 'center',
	},
	signInContainers: {
		marginTop: verticalScale(22),
		paddingHorizontal: scale(26)
	},
	textPadding: {
		paddingHorizontal: Platform.OS == 'ios' ? scale(32) : scale(25),
	},
	bottomText: {
		color: BLACK_COLOR,
		fontSize: scale(12),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
		marginBottom: verticalScale(13),
		lineHeight: scale(18),
	},
	forgetRVContainer: {
		marginTop: verticalScale(22),
		alignItems: 'center',
	},
	forgotText: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
		lineHeight: scale(21),
	}
});