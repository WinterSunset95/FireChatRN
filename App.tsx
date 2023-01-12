import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Global from './src/pages/Global'
import { UserContext } from './Context'
import LoginForm from './src/pages/LoginForm';
import Private from './src/pages/Private'
import Home from './src/pages/Home'
import Menu from './src/pages/Menu'
import { useState, useEffect, createContext, useContext, createRef } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { db } from './src/Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, collection, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import { getDatabase, ref, onValue, onChildAdded, set, push, child, get, update, remove, query, orderByKey, onChildChanged } from "firebase/database";
import styles from './src/stylesheets/Main';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
})

const Stack = createNativeStackNavigator()

export default function App() {
	const database = getDatabase();
	const [name, setName] = useState('')
	const [loginstate, setLoginstate] = useState(false)
	const [uid, setUid] = useState('')
	const [privatechat, setPrivatechat] = useState('0')
	const [privatechatname, setPrivatechatname] = useState('')
	const [videostat, setVideostat] = useState(false)

	const usersref = collection(db, 'users')
	const [users] = useCollectionData(usersref)

	const collRef = collection(db, 'users')

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

	const HomeScreen = () => {
		return (
			<Home navigation={useNavigation()} />
		)
	}

	const LoginScreen = () => {
		return (
			<LoginForm navigation={useNavigation()} />
		)
	}

	const MenuScreen = () => {
		return (
			<Menu navigation={useNavigation()} />
		)
	}

	const Header = (props:any) => {
		return (
			<View style={[styles.header]}>
				<View style={[styles.headerTextField]}>
					<Image
						style={[styles.headerImage]}
						source={require('./assets/fire_chat_1024.png')}
					/>
					<View>
					<Text style={[styles.headerText]}>{name ? name : ''}</Text>
					<Text>{uid ? uid : ''}</Text>
					</View>
				</View>
				<TouchableOpacity onPress={() => props.navigation.navigate('Menu')}>
					<FontAwesomeIcon icon={faBars} size={30} color="black" />
				</TouchableOpacity>
			</View>
		)
	}

	async function notify(user:any, text:any, group:any) {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: user + ':  ' + group,
				body: text,
				data: { data: 'goes here' },
			},
			trigger: null
		})
	}

	const messagesRef = query(ref(database, 'private'), orderByKey())
	const unsubscribe = onChildChanged(messagesRef, (snapshot) => {
		const arr = []
		const data = snapshot.val()
		if (data != null) {
			const keys = Object.keys(data)
			for (let i=0; i<keys.length; i++) {
				const k = keys[i]
				let toPush = data[k]
				toPush.key = k
				toPush.index = i
				arr.push(toPush)
			}
		}
		const message = arr[arr.length - 1]
		if (message && message.uid != uid && message.read == false) {
			notify(message.user, message.message, 'Private Chat')
		}
	})
	useEffect(() => {
		return unsubscribe
	}, [name, uid, loginstate])

	useEffect(() => {
		const statechange = onAuthStateChanged(getAuth(), async (user) => {
			if (user && user.uid) {
				setName(user.displayName ? user.displayName : user.email! )
				setUid(user.uid)
				setLoginstate(true)
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
		return statechange
	}, [])

  return (
		<UserContext.Provider value={{name, setName, loginstate, setLoginstate, uid, login, logOut, users, privatechat, setPrivatechat, videostat, setVideostat, setPrivatechatname }}>
			<StatusBar style='auto' />
			<SafeAreaView style={{ flex: 1 }}>
				<NavigationContainer independent={true}>
					<Stack.Navigator>
						<Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: () => <Header navigation={useNavigation()} /> }}/>
						<Stack.Screen name="Private" component={Private} options={{ headerTitle: privatechatname }}/>
						<Stack.Screen name="Global" component={Global} />
						<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
						<Stack.Screen name="Menu" component={MenuScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaView>
		</UserContext.Provider>
  );
}

