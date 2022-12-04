import { StyleSheet, Text, TextInput, KeyboardAvoidingView, SafeAreaView, View, Button, TouchableOpacity, FlatList } from 'react-native'
import Message from '../components/Message'
import {db} from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, query, collection, orderBy, getDocs } from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export default function Global() {
	const messagesRef = query(collection(db, 'global'), orderBy('timestamp'))
	const [messages] = useCollectionData(messagesRef)
	const [name, setName] = useState('')
	const [state, setState] = useState(false)
	const [uid, setUid] = useState('')

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

	const signIn = () => {
		const auth = getAuth()
		signInWithEmailAndPassword(auth, 'wintersunset95@gmail.com', 'nauatlau1234')
		.then((result) => {
			if (result.user) {
				setName(result.user.displayName!)
				setState(true)
				setUid(result.user.uid!)
			}
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
		<Message  name={item.user} text={item.message} />
	)

	const Header = () => {
		if (state) {
			return (
				<View style={[styles.nav]}>
					<Text style={[styles.whiteText]}>FireChat</Text>
					<Text style={[styles.whiteText]}>{name}</Text>
				</View>
			)
		} else {
			return (
				<View style={[styles.nav]}>
					<Text style={[styles.whiteText]}>FireChat</Text>
					<Text style={[styles.whiteText]}>Username</Text>
					<Button
						title='Login'
						onPress={signIn}
					/>
				</View>
			)
		}
	}

	const InputArea = () => {
		return (
			<KeyboardAvoidingView style={[styles.foot]}>
				<TextInput
					style={[styles.input]}	
					placeholder='Message'
					onSubmitEditing={(event) => send(event.nativeEvent.text)}
				/>
				<TouchableOpacity style={styles.send}>
					<FontAwesomeIcon icon={faPaperPlane} size={30} color='white' />
				</TouchableOpacity>
			</KeyboardAvoidingView>
		)
	}

	return (
		<SafeAreaView style={styles.body}>
			<Header />
			<View style={[styles.main]}>
				<FlatList
					style={styles.list}
					data={messages}
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
		height: 80,
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
	
	send: {
		padding: 10,
	},

	whiteText: {
		color: 'white',
	}
})
