import { Keyboard, Platform, StatusBar, Modal, StyleSheet, Text, TextInput, KeyboardAvoidingView, SafeAreaView, View, Button, TouchableOpacity, FlatList } from 'react-native'
import Message from '../components/Message'
import {db} from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, query, collection, orderBy, getDocs } from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

export default function Global() {
	const messagesRef = query(collection(db, 'global'), orderBy('timestamp'))
	const [messages] = useCollectionData(messagesRef)
	const [name, setName] = useState('')
	const [state, setState] = useState(false)
	const [uid, setUid] = useState('')
	const [currmessage, setCurrmessage] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [modal, setModal] = useState(false)

	const checkAuthState = () => {
		const auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setName(user.displayName!)
				setState(true)
				setUid(user.uid!)
			} else {
				setState(false)
			}
		})
	}

	const login = () => {
		setModal(true)
	}

	const signIn = () => {
		const auth = getAuth()
		const mail = email.trim()
		const pass = password.trim()
		console.log(mail, pass)
		signInWithEmailAndPassword(auth, mail, pass)
		.then((result) => {
			if (result.user) {
				setName(result.user.displayName!)
				setState(true)
				setUid(result.user.uid!)
			}
		})
		.catch((error) => {
			console.log(error)
		})
	}

	const logOut = () => {
		const auth = getAuth()
		signOut(auth)
		.then(() => {
			console.log('logged out')
		})
	}

	const send = (text:string) => {
		text != "" ? 
		addDoc(collection(db, 'global'), {
			user: name,
			uid: uid,
            message: text,
			reacts: 0,
			timestamp: new Date(),
			replies: ''
		}) : console.log(text)
	}

	useEffect(() => {
		checkAuthState()
	}, [name])

	const renderItem = ({ item }:any) => (
		<Message  name={item.user} text={item.message} owned={item.uid == uid ? true : false} />
	)

	const Header = () => {
		if (state) {
			return (
				<View style={[styles.nav]}>
					<Text style={[styles.whiteText]}>FireChat</Text>
					<Text style={[styles.whiteText]}>{name}</Text>
					<Button
						title='Logout'
						onPress={logOut}
					/>
				</View>
			)
		} else {
			return (
				<View style={[styles.nav]}>
					<Text style={[styles.whiteText]}>FireChat</Text>
					<Text style={[styles.whiteText]}>Username</Text>
					<Button
						title='Login'
						onPress={login}
					/>
				</View>
			)
		}
	}

	const InputArea = () => {
		if (state) {
			return (
				<KeyboardAvoidingView style={[styles.foot]}
				>
					<TextInput
						placeholder='Message'
						style={[styles.input]}	
						onChangeText={(text) => {
							console.log(text)
						}}
						defaultValue={currmessage}
						autoFocus={true}
						blurOnSubmit={false}
						onSubmitEditing={(event) => {
							send(event.nativeEvent.text)
						}}
					/>
					<TouchableOpacity style={styles.send} onPress={() => send(currmessage)}>
						<FontAwesomeIcon icon={faPaperPlane} size={30} color='white' />
					</TouchableOpacity>
				</KeyboardAvoidingView>
			)
		} else {
			return (
				<KeyboardAvoidingView style={[styles.foot]}>
					<Button
						title='Login to send message'
						onPress={login}
					/>
				</KeyboardAvoidingView>
			)
		}
	}

	return (
		<SafeAreaView style={styles.body}>
			<StatusBar barStyle='light-content' />
			<Header />
			<View style={[styles.main]}>
				<Modal
					animationType='fade'
					transparent={true}
					visible={modal}
				>
					<View style={[styles.modal]}>
						<View
							style={[styles.modalContent]}
						>
							<TouchableOpacity
								style={{marginBottom: 20, alignSelf: 'flex-end'}}
								onPress={() => setModal(false)}
							>
								<FontAwesomeIcon icon={faCircleXmark} size={30} color='black'/>
							</TouchableOpacity>
							<TextInput
								placeholder='Username'
								style={[styles.modalInput, {marginBottom: 20}]}
								onChangeText={(event) => {
									setEmail(event)
								}}
								defaultValue={email}
							/>
							<TextInput
								placeholder='Password'
								style={[styles.modalInput, {marginBottom: 20}]}
								onChangeText={(text) => {
									setPassword(text)
								}}
								defaultValue={password}
							/>
							<TouchableOpacity
								style={[styles.modalButton]}
								onPress={() => signIn()}
							>
								<Text>Login</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<FlatList
					style={styles.list}
					inverted
					data={messages?.reverse()}
					renderItem={renderItem}
					keyExtractor={item => item.timestamp.seconds}
				/>
			</View>
			<InputArea />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({

	nav: {
		backgroundColor: 'black',
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		width: '100%',
		height: 100,
		padding: 20,
	},

	blackText: {
		color: 'black',
	},

	body: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: '100%',
	},

	foot: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 80,
		width: '100%',
		backgroundColor: 'black'
	},

	input: {
		backgroundColor: 'white',
		height: 40,
		width: '80%',
		borderRadius: 20,
		padding: 10,
	},

	list: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		padding: 20,
		paddingTop: 0,
		paddingBottom: 20,
	},

	main: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		width: '100%',
	},

	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},

	modalButton: {
		alignSelf: 'flex-end',
		width: 100,
		padding: 10,
		borderRadius: 20,
		backgroundColor: 'lightblue',
	},

	modalContent: {
		flex: 0,
		justifyContent: 'center',
		width: 300,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 20,
	},

	modalInput: {
		padding: 10,
        height: 40,
        width: '100%',
		borderWidth: 1,
		borderColor: 'black',
        borderRadius: 20,
		color: 'black',
	},
	
	send: {
		padding: 10,
	},

	whiteText: {
		color: 'white',
	}
})
