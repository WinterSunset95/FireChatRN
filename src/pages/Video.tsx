



import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { db } from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { query, collection, orderBy } from 'firebase/firestore'
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
	const vidRef = query(collection(db, docName), orderBy('timestamp'))
	const vid = useCollectionData(vidRef)[0]
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
	useEffect(() => {
		if (vid && vid.length > 1) {
			const data = vid[vid.length - 1]
		}
	}, [vid])
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
	const {uid, privatechat} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = "video" + userArr[0] + userArr[1]
	const vidRef = query(collection(db, docName), orderBy('timestamp'))
	const vid = useCollectionData(vidRef)[0]
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
	const docName = "video" + userArr[0] + userArr[1]
	const vidRef = query(collection(db, docName), orderBy('timestamp'))
	const vid = useCollectionData(vidRef)[0]
	const [data, setData] = useState(null)
	useEffect(() => {
		if (vid && vid.length > 0) {
			setData(vid[vid.length - 1])
		}
	}, [vid])
	const BackBtn = (props:any) => {
		return (
			<View style={[styles.back]}>
				<View>
					<Text style={[styles.notif]}>
					{data ?
					data.action == 'set'  ? 'Video set by ' + data.name
					: data.action == 'play' ? 'Video playing'
					: data.action == 'pause' ? 'Video paused at ' + data.seek + " by " + data.name
					: null
					: null}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => props.setView('selector')}
				>
					<FontAwesomeIcon icon={faCircleXmark} size={30} color='white' />
				</TouchableOpacity>
			</View>
		)
	}
	return (
		<>
			<BackBtn setView={props.setView} />
			{
				props.uri.includes('youtube.com') || props.uri.includes('youtu.be') ? <YtPlayer uri={props.uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} setView={props.setView} /> : <LinkPlayer uri={props.uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} setView={props.setView} />
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
	const {uid, privatechat} = useContext(UserContext)
	let userArr = [uid, privatechat]
	userArr = userArr.sort()
	const docName = "video" + userArr[0] + userArr[1]
	const vidRef = query(collection(db, docName), orderBy('timestamp'))
	const vid = useCollectionData(vidRef)[0]
	const [view, setView] = useState('selector')
	const [uri, setUri] = useState("https://rr3---sn-gwpa-nia6.googlevideo.com/videoplayback?expire=1673032962&ei=oiC4Y5WsCcWmgQebwobYCA&ip=2a01%3A4f8%3A1c1e%3A5d0c%3A%3A1&id=o-AMRqeJa6yXgcwb_1nuHFCt3JgnCD9KoUbBvGNIVcDRCe&itag=397&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=10104876&dur=128.962&lmt=1639878521826165&keepalive=yes&fexp=24007246&c=ANDROID&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOKR66MuQnCPCGkzlM9rST1PEuPPj27tTJFjUmAfp7yqAiEAzLJp8HXoCSaYg6R6qX9FkxgFLz0argVWXyFDTYTtgPo%3D&redirect_counter=1&rm=sn-4g5erd7e&req_id=d9167751bb0aa3ee&cms_redirect=yes&ipbypass=yes&mh=GJ&mip=2409:4066:e1b:36c6:f470:9a79:cb54:e64f&mm=31&mn=sn-gwpa-nia6&ms=au&mt=1673011080&mv=m&mvi=3&pcm2cms=yes&pl=41&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl&lsig=AG3C_xAwRQIgbSIML_Yr75GjWgL-mbQFGIGfG51zo8ie8E5jQ4rpcAYCIQCWBjXyyFiqI5hiDcoAHQlgW5RxV1YATHiLNF9KgJRf6w%3D%3D")
	useEffect(() => {
		console.log('update')
		if (vid && vid.length > 0) {
			const data = vid[vid.length -1]
			if (data.uid != uid && data.action == 'set') {
				console.log('video set')
				setUri(data.uri)
				setView('player')
				props.setVideostat(true)
			}
		}
	}, [vid])
	return (
		<View style={[styles.main]}>
			{view == 'selector' ? <Selector setView={setView} setUri={setUri} setvideo={props.setvideo} /> : <Player setView={setView} uri={uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} /> }
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

