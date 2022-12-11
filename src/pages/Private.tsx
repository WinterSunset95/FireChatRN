import { StyleSheet, View, Text } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../Context'
import { db } from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore'
import Message from '../components/Message'
import InputArea from '../components/Input'
import List from '../components/List'

const Private = (props:any) => {
	const [name, setName, loginstate, setLoginstate, uid, setUid, login, logOut, users, privatechat, setPrivatechat] = useContext(UserContext)
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
		<Message  name={item.user} text={item.message} owned={item.uid == uid ? true : false} picture={item.picture ? item.picture : ''}/>
	)
	useEffect(() => {
		getChat()
	}, [chat])

	return (
	 <View style={{ flex: 1, height: '100%', width: '100%' }}>
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
