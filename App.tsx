import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Global from './src/pages/Global'
import UserContext from './Context'
import Header from './src/components/Header';
import LoginForm from './src/components/LoginForm';
import { useState, useEffect, createContext, useContext, createRef } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const Stack = createNativeStackNavigator()

export default function App() {
	const [name, setName] = useState('')
	const [loginstate, setLoginstate] = useState(false)
	const [uid, setUid] = useState('')
	console.log(name, loginstate, uid)

	const checkAuthState = () => {
		const auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setName(user.displayName ? user.displayName : user.email! )
				setLoginstate(true)
				setUid(user.uid!)
			} else {
				setLoginstate(false)
				setUid("")
				setName("")
			}
		})
	}

	const login = () => {
		console.log("Login")
	}

	const logOut = () => {
		const auth = getAuth()
		signOut(auth)
		.then(() => {
			Alert.alert(
				"Loogged out"
			)
		})
	}

	useEffect(() => {
		checkAuthState()
	}, [name])

  return (
		<UserContext.Provider value={[name, setName, loginstate, setLoginstate, uid, setUid, login, logOut]}>
				<StatusBar style="auto" />
				<NavigationContainer >
					<Stack.Navigator>
						<Stack.Screen name="Login" component={LoginForm} options={{headerShown: false}}/>
						<Stack.Screen name="Global" component={Global} options={{ headerTitle: () => <Header title="Global Chat"/>, headerStyle: {backgroundColor: 'black'}, headerBackVisible: false}}/>
					</Stack.Navigator>
				</NavigationContainer>
		</UserContext.Provider>
  );
}

