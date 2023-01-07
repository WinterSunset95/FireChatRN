import { StyleSheet, View, Text } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../Context'
import { db } from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import Message from '../components/Message'
import InputArea from '../components/Input'
import { VideoPlayer, LinkPlayer } from './Video'
import List from '../components/List'

const Private = () => {
	const {name, loginstate, uid, login, privatechat, videostat, notif, setNotif} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = userArr[0] + userArr[1]
	const messagesRef = query(collection(db, docName), orderBy('timestamp'))
	const messages = useCollectionData(messagesRef)[0]
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
		} else {
			console.log('user does not exist')
		}
	}

	const setvideo = (text:any) => {
		send(name + ' linked a video: ' + text, 'notification', 'set', null)
	}

	const pausevideo = (time:any) => {
		console.log("Video paused at: " + time)
		send(name + ' paused the video at ' + time, 'notification', 'pause', time)
	}

	const playvideo = (time:any) => {
		console.log("Video playing at: " + time)
		send(name + ' played the video at ' + time, 'notification', 'play', time)
	}

	const seekvideo = () => {
		console.log("seekvideo")
	}

	const send = (text:string, type:any, action:any, seek:any) => {
		text != "" && name != "" && uid != "" ? 
		addDoc(collection(db, docName), {
			type: type,
			effects: {
				action: action,
				seek: seek,
			},
			user: name,
			uid: uid,
			message: text,
			reacts: 0,
			timestamp: new Date(),
			replies: ''
		}) : console.log(text)
		setCurrmessage("")
	}

	const handleSend = (text:any) => {
		send(text, 'message', null, null)
	}

	const renderItem = ({ item }:any) => (
		<Message name={item.user} text={item.message} owned={item.uid == uid ? true : false} picture={item.picture ? item.picture : ''}/>
	)

	useEffect(() => {
		let type = typeof messages
		if (type == 'object' && messages != undefined && messages.length > 0) {
			if (uid == messages[0].uid) {
				setNotif({
					uri: messages[0].message.split('video:')[1],
					action: messages[0].effects.action,
					seek: messages[0].effects.seek,
				})
			}
		}
	}, [messages])

	useEffect(() => {
		getChat()
	}, [chat])

	return (
	 <View style={{ flex: 1, height: '100%', width: '100%' }}>
		{videostat ? <VideoPlayer setvideo={setvideo} playvideo={playvideo} pausevideo={pausevideo} seekvideo={seekvideo} /> : null}
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

})

export default Private
