import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Global from './src/pages/Global'
import UserContext from './Context'
import Header from './src/components/Header';
import Users from './src/pages/Users';
import LoginForm from './src/pages/LoginForm';
import Private from './src/pages/Private'
import { useState, useEffect, createContext, useContext, createRef } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { db } from './src/Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'

const Stack = createNativeStackNavigator()

export default function App() {
	const [name, setName] = useState('')
	const [loginstate, setLoginstate] = useState(false)
	const [uid, setUid] = useState('')
	const [privatechat, setPrivatechat] = useState('0')

	const usersref = query(collection(db, 'users'))
	const [users] = useCollectionData(usersref)

	const collRef = collection(db, 'users')

	const ping = async () => {
		const res = await fetch("https://firechatbackend.winter95.repl.co/")
		console.log(await res.json())
	}

	useEffect(() => {
		setInterval(ping, 3600000)
	}, [])

	const checkAuthState = () => {
		const auth = getAuth()
		onAuthStateChanged(auth, async (user) => {
			if (user && user.uid) {
				setName(user.displayName ? user.displayName : user.email! )
				setLoginstate(true)
				setUid(user.uid!)
				const docRef = doc(db, 'users', user.uid!)
				const docSnap = await getDoc(docRef)
				if (docSnap.exists()) {
				} else {
					await setDoc(doc(collRef, user.uid!), {
						"email": user.email!,
						"name": user.displayName!,
						"picture": user.photoURL!,
						"uid": user.uid
					})
				}
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
		<UserContext.Provider value={[name, setName, loginstate, setLoginstate, uid, setUid, login, logOut, users, privatechat, setPrivatechat]}>
				<StatusBar style="auto" />
				<NavigationContainer >
					<Stack.Navigator>
						<Stack.Screen name="Global" component={Global} options={{ headerTitle: () => <Header title="Global Chat" to="Users" navigation={useNavigation()}/>, headerStyle: {backgroundColor: 'black'}, headerBackVisible: false}}/>
						<Stack.Screen name="Login" component={() => <LoginForm navigation={useNavigation()} />} options={{headerShown: false}}/>
						<Stack.Screen name="Users" component={Users} options={{ headerTitle: () => <Header title="User List" to="Global" navigation={useNavigation()}/>, headerStyle: {backgroundColor: 'black'}, headerBackVisible: false}}/>
						<Stack.Screen name="Private" component={Private} options={{ headerTitle: () => <Header title="PrivateChat" to="Users" navigation={useNavigation()}/>, headerStyle: {backgroundColor: 'black'}, headerBackVisible: false}}/>
					</Stack.Navigator>
				</NavigationContainer>
		</UserContext.Provider>
  );
}

