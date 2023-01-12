



import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { db } from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getDatabase, ref, onValue, onChildAdded, set, push, child, get, update, remove, query, orderByKey } from "firebase/database";
import { UserContext, PrivateChatContext } from '../../Context'
import {Alert, StyleSheet, Modal, Button, View, Text, TouchableOpacity, TextInput} from 'react-native'
import { Video, AVPlaybackStatus } from 'expo-av'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import YoutubePlayer from 'react-native-youtube-iframe'

const LinkPlayer = (props:any) => {
	const {uid, privatechat} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = "video" + userArr[0] + userArr[1]
	const [vid, setVid] = useState<any>([])
	const video = useRef(null)
	const [status, setStatus] = useState({})
	const [playing, setPlaying] = useState(false)
	const [position, setPosition] = useState(null)
	useEffect(() => {
		playing != status.isPlaying ? setPlaying(status.isPlaying) : null
		position != status.positionMillis ? setPosition(status.positionMillis) : null
	}, [status])
	useEffect(() => {
		if (playing) {
			props.playvideo(props.uri, position)
		} else if (!playing && position != null && position != 0) {
			props.pausevideo(props.uri, position)
		}
	}, [playing])
	return (
		<View style={[styles.player]}>
			<Video
			style={[styles.video]}
			ref={video}
			source={{ uri: props.uri }}
			useNativeControls
			resizeMode="contain"
			progressUpdateIntervalMillis={1000}
			onPlaybackStatusUpdate={status => {
				setStatus(() => status)
			}}
			/> 
		</View>
	)
}

const YtPlayer = (props:any) => {
	const vid = props.vid
	const database = getDatabase();
	const {uid, privatechat} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = "video" + userArr[0] + userArr[1]
	const video = useRef(null)
	const [position, setPosition] = useState(0)
	let link = props.uri
	if (link.includes('watch?v=')) {
		link = link.split('watch?v=')[1]
	} else if (link.includes('youtu.be/')) {
		link = link.split('youtu.be/')[1]
	} else if (link.includes('embed/')) {
		link = link.split('embed/')[1]
	} else {
		link = link
	}
	const onChangeState = async (state:any) => {
		let time = await video.current.getCurrentTime()
		if (state == 'playing') {
			props.playvideo(props.uri, time)
			console.log(video)
		} else if (state == 'paused') {
			props.pausevideo(props.uri, time)
		}
	}
	useEffect(() => {
		if (vid && vid.length > 0) {
			const data = vid[vid.length -1]
			if (data.uid != uid && data.action == 'play') {
				if (position != data.seek) {
					setPosition(data.seek)
					video.current.seekTo(data.seek)
				}
			}
		}
	}, [vid])
	return (
		<View style={[styles.player]}>
			<YoutubePlayer
			ref={video}
			height={300}
			videoId={link}
			play={false}
			onChangeState={(state) => onChangeState(state)}
			/>
		</View>
	)
}

const Player = (props:any) => {
	const {uid, privatechat} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const [data, setData] = useState(null)
	useEffect(() => {
		if (props.vid && props.vid.length > 0) {
			setData(props.vid[props.vid.length - 1])
		}
	}, [props.vid])
	const BackBtn = () => {
		return (
			<View style={[styles.back]}>
				<View>
					<Text style={[styles.notif]}>
					{data ?
					data.action == 'set'  ? 'Video set by ' + data.user
					: data.action == 'play' ? 'Video playing'
					: data.action == 'pause' ? 'Video paused at ' + data.seek + " by " + data.user
					: data.action == 'kill' ? 'Video killed'
					: null
					: null}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						props.killvideo(props.uri)
						props.setView('selector')
					}}
				>
					<FontAwesomeIcon icon={faCircleXmark} size={30} color='white' />
				</TouchableOpacity>
			</View>
		)
	}
	return (
		<>
			<BackBtn />
			{
				props.uri.includes('youtube.com') || props.uri.includes('youtu.be') ? <YtPlayer uri={props.uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} setView={props.setView} vid={props.vid} /> : <LinkPlayer uri={props.uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} setView={props.setView} />
			}
		</>
	)
}

const Selector = (props:any) => {
	const [text, setText] = useState('')
	return (
		<View style={[styles.main]}>
			<TextInput 
				style={[styles.textInput]}
				onChangeText={(text) => setText(text)}
			/>
			<TouchableOpacity style={[styles.selectorButton]}
				onPress={() => {
					props.setUri(text)
					text != '' ? props.setView('player') : null
					text != '' ? props.setvideo(text) : null
				}}
			>
				<Text>Play</Text>
			</TouchableOpacity>
		</View>
	)
}

const VideoPlayer = (props:any) => {
	const database = getDatabase()
	const {uid, privatechat} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = userArr[0] + userArr[1]
	const [vid, setVid] = useState<any>([])
	const [view, setView] = useState('selector')
	const [uri, setUri] = useState("")
	const vidRef = query(ref(database, 'videos/' + docName), orderByKey())
	useEffect(() => {
		const unsubscribe = onValue(vidRef, (snapshot) => {
			const arr = []
			const data = snapshot.val()
			if (data != null) {
				const keys = Object.keys(data)
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i]
					let toPush = data[k]
					toPush.key = k
					toPush.index = i
					arr.push(toPush)
				}
			setVid(arr)
			}
		})
		return unsubscribe
	}, [])
	useEffect(() => {
		console.log('update')
		if (vid && vid.length > 0) {
			const data = vid[vid.length -1]
			if (data.uid != uid && data.action == 'set') {
				console.log('video set')
				setView('player')
				props.setVideostat(true)
			} else if (data.action == 'kill') {
				setUri('')
				setView('selector')
			}
			if (data.uri != uri) {
				setUri(data.uri)
			}
		}
	}, [vid])
	useEffect(() => {
		uri != '' ? setView('player') : null
	}, [uri])
	return (
		<View style={[styles.main]}>
			{view == 'selector' ? <Selector 
				setView={setView} 
				setUri={setUri}
				setvideo={props.setvideo} /> : <Player setView={setView} uri={uri} playvideo={props.playvideo} pausevideo={props.pausevideo} killvideo={props.killvideo} seekvideo={props.seekvideo} vid={vid} /> }
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		flex: 0.15,
		minHeight: 300,
		backgroundColor: 'black',
	},

	notif: {
		color: 'white'
	},

	back: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 5
	},

	player: {
		flex: 1,
	},

	textInput: {
		backgroundColor: 'white',
		padding: 10,
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 20,
		margin: 10,
	},

	selectorButton: {
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 10,
		margin: 10,
		width: 100,
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	
	video: {
		flex: 1,
		width: '100%',
		height: '100%',
	}
})

export {
	VideoPlayer,
	LinkPlayer
}

