





import { useState, useEffect, useContext } from 'react'
import { NavigationContainer, NavigationRouteContext, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar, View,  Text, StyleSheet, Button, Alert, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Users from './Users';
import Groups from './Groups';
import { UserContext } from '../../Context';
import styles from '../stylesheets/Main';

const Tab = createMaterialTopTabNavigator()

const Home = (props:any) => {
	const {setScreen} = useContext(UserContext)
	const UsersTab = () => {
		return (
			<Users navigation={props.navigation}/>
		)
	}
	const GroupsTab = () => {
		return (
			<Groups navigation={props.navigation}/>
		)
	}

	useEffect(() => {
		const unsubscribe = props.navigation.addListener('focus', (x:any) => {
			console.log(x)
			setScreen('home')
		});
		return unsubscribe;
	}, [props.navigation])

	return (
		<View style={[styles.fullFlex]}>
			<NavigationContainer independent={true}>
				<Tab.Navigator>
					<Tab.Screen name='Users' component={UsersTab} />
					<Tab.Screen name='Groups' component={GroupsTab} />
				</Tab.Navigator>
			</NavigationContainer>
		</View>
	)
}

export default Home
