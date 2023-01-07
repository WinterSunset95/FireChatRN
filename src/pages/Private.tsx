import { StyleSheet, View, Text } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { UserContext, PrivateChatContext } from '../../Context'
import { db } from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import Message from '../components/Message'
import InputArea from '../components/Input'
import { VideoPlayer, LinkPlayer } from './Video'
import List from '../components/List'

const Private = () => {
	const {name, loginstate, uid, login, privatechat, videostat, setVideostat, notif, setNotif} = useContext(UserContext)
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

	const seekvideo = () => {
		console.log("seekvideo")
	}

	const vidUpdate = (text:any, action:any, seek:any) => {
		addDoc(collection(db, "video" + docName), {
			user: name,
			uid: uid,
			action: action,
			seek: seek,
			uri: text,
			timestamp: new Date(),
		})
	}

	const send = (text:string) => {
		text != "" && name != "" && uid != "" ? 
		addDoc(collection(db, docName), {
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
		send(text)
	}

	const renderItem = ({ item }:any) => (
		<Message name={item.user} text={item.message} owned={item.uid == uid ? true : false} picture={item.picture ? item.picture : ''}/>
	)

	useEffect(() => {
		getChat()
	}, [chat])

	return (
	 <View style={{ flex: 1, height: '100%', width: '100%' }}>
		{videostat ? <VideoPlayer setvideo={setvideo} playvideo={playvideo} pausevideo={pausevideo} seekvideo={seekvideo} setVideostat={setVideostat}/> : null}
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
