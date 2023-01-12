import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Global from './src/pages/Global'
import { UserContext } from './Context'
import LoginForm from './src/pages/LoginForm';
import Private from './src/pages/Private'
import Home from './src/pages/Home'
import Menu from './src/pages/Menu'
import Notification from './src/components/Notification';
import { useState, useEffect, createContext, useContext, createRef, useRef } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { db } from './src/Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, collection, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import styles from './src/stylesheets/Main';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Stack = createNativeStackNavigator()

export default function App() {
	const [name, setName] = useState('')
	const [loginstate, setLoginstate] = useState(false)
	const [uid, setUid] = useState('')
	const [privatechat, setPrivatechat] = useState('0')
	const [privatechatname, setPrivatechatname] = useState('')
	const [videostat, setVideostat] = useState(false)
	const [screen, setScreen] = useState('home')

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
	useEffect(() => {
		console.log(screen)
	}, [screen])

  return (
		<UserContext.Provider value={{name, setName, loginstate, setLoginstate, uid, login, logOut, users, privatechat, setPrivatechat, videostat, setVideostat, setPrivatechatname, screen, setScreen }}>
			<StatusBar style='auto' />
			{uid != '' && screen != 'private' ? <Notification privatechat={privatechat} /> : null}
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

