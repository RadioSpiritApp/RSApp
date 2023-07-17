import { StyleSheet, } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import { BLACK_COLOR, WHITE_COLOR, fontFamily, BORDER_COLOR_GREY, TITLEBAR_BACKGROUND_COLOR } from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: WHITE_COLOR,
	},
	topContainer: {
		height: verticalScale(180),
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderColor: BORDER_COLOR_GREY,
	},
	profileContainer: {
		height: scale(130),
		justifyContent: 'center',
		paddingHorizontal: scale(18),
		backgroundColor: TITLEBAR_BACKGROUND_COLOR,
		borderBottomWidth: 1,
		borderColor: BORDER_COLOR_GREY,
	},
	imagePickerImage: {
		height: scale(82),
		width: scale(82),
	},
	imagePickerEditIcon: {
		height: scale(40),
		width: scale(40),
		borderRadius: scale(5),
		position: 'absolute',
		right: scale(20),
	},
	userNameHeading: {
		fontSize: scale(21.5),
		fontFamily: fontFamily.SemiBold,
		color: BLACK_COLOR,
	},
	userEmailHeading: {
		fontSize: scale(13.5),
		marginTop: scale(5),
		fontFamily: fontFamily.Regular,
		color: BLACK_COLOR,
	},
	rsCurrentPlanContainer: {
		flexDirection: 'row',
		height: scale(138),
		borderBottomWidth: 1,
		borderColor: BORDER_COLOR_GREY,
		alignItems: 'center',
		paddingHorizontal: scale(17),
	},
	rvCurrentPlanContainer: {
		height: scale(103),
		borderBottomWidth: 1,
		borderColor: BORDER_COLOR_GREY,
		justifyContent: 'center',
		paddingHorizontal: scale(17),
		backgroundColor: TITLEBAR_BACKGROUND_COLOR,
	},
	userTypeTextDetails: {
		fontFamily: fontFamily.Regular,
		color: BLACK_COLOR,
		justifyContent: 'center',
		fontSize: scale(15),
		lineHeight:scale(18),
	},
	userTypeView: {
		height: scale(64),
		borderBottomWidth: 1,
		borderColor: BORDER_COLOR_GREY,
		justifyContent: 'center',
		paddingHorizontal: scale(17),
	},
	currentPlanHeadingText: {
		color: BLACK_COLOR,
		fontSize: scale(22),
		fontFamily: fontFamily.Bold,
	},
	subscriptionPlanHeadingText: {
		color: BLACK_COLOR,
		fontSize: scale(18),
		fontFamily: fontFamily.SemiBold,
		marginTop: scale(16),
	},
	subscriptionPlanDetail: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		fontFamily: fontFamily.Regular,
		marginTop: scale(10),
		lineHeight:scale(18)
	},
	cancelButtonContainer: {
		height: scale(35),
		width: scale(85),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 2,
		borderWidth: 1,
		borderColor: BORDER_COLOR_GREY,
		marginBottom: scale(5),
	},
	changeButtonContainer: {
		height: scale(35),
		width: scale(85),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: BLACK_COLOR,
		borderRadius: 2,
		borderWidth: 1,
		borderColor: BORDER_COLOR_GREY,
	},
	cancelButtonText: {
		color: BLACK_COLOR,
		fontSize: scale(13),
		fontFamily: fontFamily.Bold,
		lineHeight: scale(22),
	},
	changeButtonText: {
		color: WHITE_COLOR,
		fontSize: scale(13),
		fontFamily: fontFamily.Bold,
		lineHeight: scale(22),
	},
	buttonIcon: {
		height: scale(26),
		width: scale(26),
	},
	buttonContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: BORDER_COLOR_GREY,
		height: verticalScale(56),
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: scale(17),
	},
	buttonText: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		fontFamily: fontFamily.Bold,
		lineHeight: scale(22),
	},
	referenceIdContainer: {
		justifyContent: 'center',
		paddingHorizontal: scale(18),
		marginBottom: scale(20)
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
	retryButtonStyle: {
		fontSize: scale(20),
		textAlign: 'center',
		marginVertical:scale(5),
		marginHorizontal:scale(20)
	}
});