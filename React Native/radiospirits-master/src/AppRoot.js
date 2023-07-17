/**
 * @author 
 * Aug 06, 2018
 * Root Navigator For App
 * 
 */
import { Image, Easing, Animated } from 'react-native';
import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import * as CONST from './utils/Const';
import SplashScreen from './components/SplashScreen';
import SignupContainer from './components/Signup/SignupContianer';
import HomeContainer from './components/Home/HomeContainer';
import SeriesGenreContainer from './components/Home/SeriesGenreContainer';
import BrowseContainer from './components/Browse/BrowseContainer';
import SearchContainer from './components/Browse/Search/SearchContainer';
import MyLibraryContainer from './components/MyLibrary/MyLibraryContainer';
import BonusContainer from './components/Bonus/BonusContainer';
import SettingsContainer from './components/Settings/SettingsContainer';
import RVSigninContainer from './components/RVSignin/RVSigninContainer';
import SubsContainer from './components/Subscription/SubsContainer';
import EmailValidatorContainer from './components/EmailValidator/EmailValidatorContainer';
import PlayerContainer from './components/Player/PlayerContainer';
import FreePlayerContainer from './components/Player/FreePlayer/FreePlayerContainer';
import CommonWebViewContainer from './components/CommonWebView/CommonWebViewContainer';
import scale from './utils/scale';

const navigationOptions = {
	headerStyle: {
		backgroundColor: '#f4511e',
		height: 50,
		justifyContent: 'center',
		elevation: 0,
	},
	headerTitleStyle: {
		justifyContent: 'flex-end',
		fontWeight: 'bold',
	},
	headerTintColor: '#FFFFFF',
};

const BrowseStack = createStackNavigator({
	BrowseScreen: { screen: BrowseContainer, navigationOptions: { header: null } },
	SearchScreen: { screen: SearchContainer, navigationOptions: { header: null } },
});
const HomeStack = createStackNavigator({
	HomeScreen: { screen: HomeContainer, navigationOptions: { header: null } },
	SeriesGenreScreen: { screen: SeriesGenreContainer, navigationOptions: { header: null } },
});
const BottomTabNavigator = createBottomTabNavigator(
	{
		HOME: HomeStack,
		BROWSE: BrowseStack,
		MYLIBRARY: MyLibraryContainer,
		BONUS: BonusContainer,
		SETTINGS: SettingsContainer,
	},
	{
		navigationOptions: ({ navigation }) => ({
			// eslint-disable-next-line react/display-name
			tabBarIcon: ({ focused }) => {
				const { routeName } = navigation.state;
				let disabled = {opacity: 1};
				let iconSource;
				switch (routeName) {
				case 'HOME' :
					iconSource = focused ? CONST.HOME_ACTIVE : CONST.HOME_INACTIVE;
					break;
				case 'BROWSE' :
					iconSource = focused ? CONST.BROWSE_ACTIVE : CONST.BROWSE_INACTIVE;
					break;
				case 'MYLIBRARY' :
					iconSource = focused ? CONST.MY_LIBRARY_ACTIVE : CONST.MY_LIBRARY_INACTIVE;
					disabled = {opacity: 1};
					break;
				case 'BONUS' :
					iconSource = focused ? CONST.BONUS_ACTIVE : CONST.BONUS_INACTIVE;
					break;
				case 'SETTINGS' :
					iconSource = focused ? CONST.SETTINGS_ACTIVE : CONST.SETTINGS_INACTIVE;
					break;
				}
				// You can return any component that you like here! We usually use an
				// icon component from react-native-vector-icons
				return <Image style={disabled} source={iconSource} />;
			},
		}),
		tabBarOptions: {
			activeTintColor: CONST.ACTIVE_TAB_COLOR, //'tomato',
			inactiveTintColor: CONST.BLACK_COLOR, //'gray',
			labelStyle: {
				fontSize: scale(9),
				fontFamily: CONST.fontFamily.Bold,
			},
			style: {
				backgroundColor: 'rgb(253, 249, 249)',
			},
			allowFontScaling: false,
		},
		animationEnabled: false,
		swipeEnabled: false,
	}
);

const screenTransition = {
	transitionSpec: {
		duration: 500,
		easing: Easing.out(Easing.poly(4)),
		timing: Animated.timing,
	},
	screenInterpolator: sceneProps => {
		const { layout, position, scene } = sceneProps;
		const { index } = scene;

		const height = layout.initHeight;
		const translateY = position.interpolate({
			inputRange: [index - 1, index, index + 1],
			outputRange: [height, 0, 0],
		});

		const opacity = position.interpolate({
			inputRange: [index - 1, index - 0.99, index],
			outputRange: [0, 1, 1],
		});
		
		const modalTransition =  { opacity, transform: [{ translateY }] };
		const normalTransition =  { opacity, transform: [{ translateX: translateY }] };

		if ((typeof scene.route.params !== 'undefined') && (typeof scene.route.params.isModal !== 'undefined') && scene.route.params.isModal) {
			return modalTransition;
		}
		return normalTransition;
	},
};


export default AppRoot = createStackNavigator({
	SplashScreen: { screen: SplashScreen, navigationOptions: { header: null } },
	SignupScreen: { screen: SignupContainer, navigationOptions: { header: null } },
	RVSigninScreen: { screen: RVSigninContainer, navigationOptions: { header: null } },
	TabScreen: { screen: ({ navigation }) => <BottomTabNavigator screenProps={{ rootNavigation: navigation }} />, navigationOptions: { header: null } },
	Subscriptionscreen: { screen: SubsContainer, navigationOptions: { header: null } },
	EmailValidatorScreen: { screen: EmailValidatorContainer, navigationOptions: { header: null } },
	PlayerScreen: { screen: PlayerContainer, navigationOptions: { header: null } },
	FreePlayerScreen: { screen: FreePlayerContainer, navigationOptions: { header: null } },
	CommonWebViewScreen: { screen : CommonWebViewContainer, navigationOptions: { header: null } },
}, {
	headerMode: 'screen',
	transitionConfig: () => (screenTransition)
}, {
	navigationOptions
});	

export function setRootNavigation(navigation){
	this.rootNavigation = navigation;
}

export function getRootNavigation(){
	return this.rootNavigation;
}
