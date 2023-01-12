





import { useEffect, useContext, useState } from 'react'
import { getDatabase, ref, onValue, onChildAdded, set, push, child, get, update, remove, query, orderByKey, onChildChanged } from "firebase/database";
import { View } from 'react-native'
import { UserContext } from '../../Context';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
})

const Notification = (props:any) => {
	const database = getDatabase();
	const {uid, privatechat} = useContext(UserContext)
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

	function checknotif(message:any) {
		console.log('test: ' + props.privatechat)
		console.log('uid: ' + message.uid)
		if (message && message.uid != uid && privatechat != uid && message.read == false) {
			console.log('test1: ' + props.privatechat)
			console.log('uid1: ' + message.uid)
			notify(message.user, message.message, 'Private Chat')
		}
	}
	
	const messagesRef = query(ref(database, 'private'), orderByKey())
	useEffect(() => {
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
			checknotif(message)
		})
		return unsubscribe
	}, [])
	return (
		<View>
		</View>
	)
}

export default Notification
