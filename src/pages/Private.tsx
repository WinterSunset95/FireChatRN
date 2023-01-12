import { StyleSheet, View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, Button } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { UserContext, PrivateChatContext } from '../../Context'
import { db } from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, collection, orderBy, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getDatabase, ref, onValue, onChildAdded, set, push, child, get, update, remove, query, orderByKey } from "firebase/database";
import Message from '../components/Message'
import { VideoPlayer, LinkPlayer } from './Video'
import List from '../components/List'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons'

	const InputArea = (props:any) => {
		const {videostat, setVideostat, login, loginstate} = useContext(UserContext)
		if (loginstate) {
			return (
				<KeyboardAvoidingView style={[styles.foot]}
				>
					<TouchableOpacity style={styles.send} onPress={() => setVideostat(!videostat)}>
						<FontAwesomeIcon icon={faVideo} size={30} color='white' />
					</TouchableOpacity>
					<TextInput
						placeholder='Message'
						style={[styles.input]}	
						onChangeText={(text) => {
							props.setCurrmessage(text)
						}}
						defaultValue={props.currmessage}
						value={props.currmessage}
						autoFocus={true}
						blurOnSubmit={false}
						onSubmitEditing={(event) => {
							props.send(event.nativeEvent.text)
						}}
						onImageChange={(image) => console.log(image)}
					/>
					<TouchableOpacity style={styles.send} onPress={() => props.send(props.currmessage)}>
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

const Private = () => {
	const database = getDatabase();
	const {name, loginstate, uid, login, privatechat, videostat, setVideostat, setScreen} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = userArr[0] + userArr[1]
	const [messages, setMessages] = useState<any>([])
	const [chat, setChat] = useState({
		email: '',
		name: '',
		picture: '',
		uid: ''
	})
	const [currmessage, setCurrmessage] = useState('')
	const getChat = async () => {
		const docRef = doc(db, 'users', privatechat)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			setChat({
				email: docSnap.data().email,
				name: docSnap.data().name,
				picture: docSnap.data().picture,
				uid: docSnap.data().uid
			})
			console.log('user found')
		} else {
			console.log('user does not exist')
		}
	}

	const setvideo = (text:any) => {
		vidUpdate(text, 'set', null)
	}

	const pausevideo = (text:any, time:any) => {
		console.log("Video paused at: " + time)
		vidUpdate(text, 'pause', time)
	}

	const playvideo = (text:any, time:any) => {
		console.log("Video playing at: " + time)
		vidUpdate(text, 'play', time)
	}

	const killvideo = (text:any) => {
		vidUpdate(text, 'kill', null)
	}

	const seekvideo = () => {
		console.log("seekvideo")
	}

	const vidUpdate = (text:any, action:any, seek:any) => {
		const time = new Date()
		const timestamp = time.toLocaleString('en-US', { day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
		const docRef = ref(database, 'videos/' + docName)
		const newDocRef = push(docRef)
		set(newDocRef, {
			user: name,
			uid: uid,
			action: action,
			seek: seek,
			uri: text,
			timestamp: timestamp,
		})
	}

	const send = (text:string) => {
		const time = new Date()
		const timestamp = time.toLocaleString('en-US', { day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
		const docRef = ref(database, 'private/' + docName)
		const newDocRef = push(docRef)
		setCurrmessage("")
		text != "" && name != "" && uid != "" ? 
		set(newDocRef, {
			user: name,
			uid: uid,
			timestamp: timestamp,
			message: text,
			reacts: 0,
			replies: '',
			read: false,
		}) :
		setCurrmessage("")
	}

	const handleSend = (text:any) => {
		send(text)
	}

	const renderItem = ({ item }:any) => (
		<Message message={item} owned={item.uid == uid ? true : false} />
	)

	const messagesRef = query(ref(database, 'private/' + docName), orderByKey())
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
		getChat()
	}, [])

	useEffect(() => {
		const message = messages[0]
		if (message && message.uid != uid && message.read == false) {
			for (let i=0; i<messages.length; i++){
				update(ref(database, 'private/' + docName + '/' + messages[i].key), {
					read: true
				})
			}
		}
	}, [messages])

	return (
	 <View style={{ flex: 1, height: '100%', width: '100%' }}>
		{videostat ? <VideoPlayer setvideo={setvideo} playvideo={playvideo} pausevideo={pausevideo} killvideo={killvideo} seekvideo={seekvideo} setVideostat={setVideostat}/> : null}
		<View style={styles.main}>
			<List styles={styles} messages={messages} renderItem={renderItem}/>
		</View>
		<InputArea currmessage={currmessage} send={handleSend} login={login} loginstate={loginstate} setCurrmessage={setCurrmessage}/>
	</View>
	)
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		width: '100%',
	},
	input: {
		backgroundColor: 'white',
		height: 40,
		width: '80%',
		borderRadius: 20,
		padding: 10,
	},

	send: {
		padding: 10,
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
})

export default Private
