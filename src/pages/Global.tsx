import { StyleSheet, Text, TextInput, KeyboardAvoidingView, SafeAreaView, View, Button, VirtualizedList, FlatList } from 'react-native'
import Message from '../components/Message'
import {db} from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs } from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export default function Global() {
	const messagesRef = query(collection(db, 'global'), orderBy('timestamp'))
	const [messages] = useCollectionData(messagesRef)
	const renderItem = ({ item }:any) => (
		<Message  name={item.user} text={item.message} />
	)
	return (
		<SafeAreaView style={styles.body}>
			<View style={[styles.nav]}>
				<Text style={[styles.whiteText]}>FireChat</Text>
				<Text style={[styles.whiteText]}>Username</Text>
				<Button
					title='Login'
				/>
			</View>
			<View style={[styles.main]}>
				<FlatList
					style={styles.list}
					data={messages}
					renderItem={renderItem}
					keyExtractor={item => item.timestamp.seconds}
				/>
			</View>
			<KeyboardAvoidingView style={[styles.foot]}>
				<TextInput
					style={[styles.input]}	
					placeholder='Message'
				/>
				<FontAwesomeIcon icon={faPaperPlane} size={30} color='white' />
			</KeyboardAvoidingView>
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

	foot: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 80,
		width: '100%',
		backgroundColor: 'black'
	},

	whiteText: {
		color: 'white',
	}
})
