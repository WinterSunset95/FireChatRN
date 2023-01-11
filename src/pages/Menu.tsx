




import { useState, useEffect, useContext } from 'react'
import { StatusBar, View,  Text, StyleSheet, Button, Alert, Image, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard, SafeAreaView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../Context';
import styles from '../stylesheets/Main';

const Menu = (props:any) => {
	const {loginstate, logOut} = useContext(UserContext)
	return (
		<SafeAreaView style={[styles.menuContainer]}>
			<View style={{padding: 20}}>
				<Text>Other menu items will go here</Text>
			</View>
			<View style={{padding: 20}}>
			<Button title={loginstate ? 'Logout' : 'Login' } onPress={() => loginstate ? logOut() : props.navigation.navigate('Login')}/>
			</View>
		</SafeAreaView>
	)
}

export default Menu
