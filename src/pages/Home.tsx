





import { useState, useEffect, useContext } from 'react'
import { NavigationContainer, NavigationRouteContext, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View,  Text, StyleSheet, Button, Alert, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import Users from './Users';
import Groups from './Groups';

const Tab = createMaterialTopTabNavigator()

const Home = (props:any) => {
	return (
		<NavigationContainer independent={true}>
			<Tab.Navigator>
				<Tab.Screen name='Users' component={() => <Users navigation={props.navigation} />} />
				<Tab.Screen name='Groups' component={Groups} />
			</Tab.Navigator>
		</NavigationContainer>
	)
}

export default Home
