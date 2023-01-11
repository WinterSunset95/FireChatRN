





import { useState, useEffect, useContext } from 'react'
import { NavigationContainer, NavigationRouteContext, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar, View,  Text, StyleSheet, Button, Alert, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Users from './Users';
import Groups from './Groups';
import LoginForm from './LoginForm';
import { UserContext } from '../../Context';
import styles from '../stylesheets/Main';

const Tab = createMaterialTopTabNavigator()

const Home = (props:any) => {
	const {name, uid, users, setPrivatechat} = useContext(UserContext)
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
	return (
		<View style={[styles.fullFlex]}>
			<View style={[styles.header]}>
				<View style={[styles.headerTextField]}>
					<Image
					style={[styles.headerImage]}
					source={require('../../assets/fire_chat_1024.png')}
					/>
					<Text style={[styles.headerText]}>{name ? name : ''}</Text>
				</View>
				<TouchableOpacity>
					<FontAwesomeIcon icon={faBars} size={30} color="black" />
				</TouchableOpacity>
			</View>
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
