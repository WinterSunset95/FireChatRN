




import { Alert, Keyboard, Platform, StatusBar, Modal, StyleSheet, Text, TextInput, KeyboardAvoidingView, SafeAreaView, View, Button, TouchableOpacity, FlatList } from 'react-native'
import Message from '../components/Message'
import {db} from '../Firebase'
import { addDoc, collection, orderBy, getDocs, serverTimestamp } from 'firebase/firestore'
import {useState, useEffect, useContext, useRef} from 'react'
import InputArea from '../components/Input'
import List from '../components/List'
import { UserContext } from '../../Context'
import { getDatabase, ref, onValue, onChildAdded, set, push, child, get, update, remove, query, orderByKey } from "firebase/database";
import styles from '../stylesheets/Main'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBackward, faArrowRotateBack } from '@fortawesome/free-solid-svg-icons'

export default function Global(props:any) {
	const database = getDatabase()
	const [messages, setMessages] = useState<any>([])
	const {name, loginstate, uid} = useContext(UserContext) 
	const [currmessage, setCurrmessage] = useState('')

	const login = () => {
		props.navigation.navigate('Login')
	}

//	const chatgpt = async (text:string) => {
//		send(text)
//		const query = text.replace('@chatgpt', '')
//		const res = await fetch('https://firechatbackend.winter95.repl.co/api?message=' + query)
//		let result
//		if (res.ok) {
//			result = await res.text()
//		} else {
//			result = "The server seems to be down. Please contact the administrator"
//		}
//		query != "" && name != "" && uid != "" ? 
//		addDoc(collection(db, 'global'), {
//			user: 'ChatGPT',
//			uid: 'chatgpt@firechat',
//			message: result,
//			reacts: 0,
//			timestamp: new Date(),
//			replies: ''
//		}) : console.log(text)
//	}

	const send = (text:string) => {
		const time = new Date()
		const timestamp = time.toLocaleString('en-US', { day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
		const docRef = ref(database, 'global')
		const newDocRef = push(docRef)
		setCurrmessage("")
		text != "" && name != "" && uid != "" ? 
		set(newDocRef, {
			user: name,
			uid: uid,
			message: text,
			reacts: 0,
			replies: '',
			read: false,
			timestamp: timestamp
		}) : console.log(text)
	}

	const handleSend = async (text: string) => {
		if (text.includes("@chatgpt")) {
			//chatgpt(text)
		} else {
			send(text)
		}
	}

	const renderItem = ({ item }:any) => (
		<Message message={item} owned={item.uid == uid ? true : false} />
	)

	const messagesRef = query(ref(database, 'global/'), orderByKey())
	useEffect(() => {
		const unsubscribe = onValue(messagesRef, (snapshot:any) => {
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
				setMessages(arr.reverse())
			}
		})
		return unsubscribe
	}, [])

	useEffect(() => {
		const message = messages[0]
		if (message && message.uid != uid && message.read == false) {
			update(ref(database, 'global/' + message.currtime), {
				read: true
			})
		}
	}, [messages])

	return (
		<SafeAreaView style={styles.body}>
			<View style={[styles.globalListContainer]}>
				<List styles={styles} messages={messages} renderItem={renderItem}/>
			</View>
			<InputArea currmessage={currmessage} send={handleSend} login={login} loginstate={loginstate} setCurrmessage={setCurrmessage}/>
		</SafeAreaView>
	)
}
