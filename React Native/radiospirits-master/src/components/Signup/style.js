import { StyleSheet, Platform } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import { BLACK_COLOR, WHITE_COLOR, fontFamily, ICON_BG } from '../../utils/Const';
module.exports = StyleSheet.create({
	container: {
		flex: 1,
	},
	//start CSS
	logoContainer: {
		marginTop: verticalScale(40),
	},
	titleText: {
		color: BLACK_COLOR,
		fontSize: scale(22),
		lineHeight: scale(24.5),
		textAlign: 'center',
		fontFamily: fontFamily.Bold,
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
		fontSize: scale(15),
		lineHeight: scale(22),
		textAlign: 'center',
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
	subscriberContainer: {
		marginTop: verticalScale(15),
		flexDirection: 'row', 
		justifyContent: 'center',
	},
	subTitle: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		lineHeight: scale(18),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
	},
	semiBoldTxt: {
		fontFamily: fontFamily.SemiBold,
	},
	gImageContainer: {
		backgroundColor: '#e84c3d',
		height: verticalScale(40),
		width: verticalScale(45),
	},
	skipText: {
		color: 'rgba(0, 0, 0, 0.6)',
		fontSize: scale(12),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
		textDecorationLine: 'underline',
		marginBottom: verticalScale(4),
		padding: 5,
		width: verticalScale(60)
	},
	gplusIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: verticalScale(40),
		width: verticalScale(45),
	},
	gplusText: {
		color: WHITE_COLOR,
		fontSize: scale(18),
		textAlign: 'center',
		fontFamily: fontFamily.Medium,
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
	accountHeading: {
		marginTop: verticalScale(47),
		alignItems: 'center',
	},
	orText: {
		color: 'rgb(156, 156, 156)',
		fontSize: scale(12),
		textAlign: 'center',
		marginTop: verticalScale(20),
		fontFamily: fontFamily.Regular,
		paddingHorizontal: 4,
	},
	dashedLine: {
		borderColor: BLACK_COLOR,
		alignSelf: 'center',
		marginTop: verticalScale(20),
		borderBottomWidth: 1,
		width: scale(16),
		opacity:0.1,
	},
	rvLogin: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		textAlign: 'center',
		marginTop: verticalScale(15),
		fontFamily: fontFamily.Bold,
	},
	footerContainer: {
		marginTop: Platform.OS == 'android' ? verticalScale(35) : verticalScale(20),
		paddingHorizontal: scale(70),
	},
	termsAndCondition: {
		color: BLACK_COLOR,
		fontSize: scale(13),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
		lineHeight: scale(18),
	},
	linkText: {
		textDecorationLine: 'underline',
	},
	freeTrialTxt: {
		color: BLACK_COLOR,
		fontSize: scale(13),
		paddingHorizontal:scale(100),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
	},
	freeTrialContainer: {
		marginTop:scale(15),
		marginBottom:scale(-5),
	},
	skipContainer: {
		justifyContent: 'flex-end',
		marginTop: scale(10),
	}
});