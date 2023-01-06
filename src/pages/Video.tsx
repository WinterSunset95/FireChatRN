





import { useState, useEffect, useRef, useContext } from 'react'
import UserContext from '../../Context'
import {Alert, StyleSheet, Modal, Button, View, Text, TouchableOpacity, TextInput} from 'react-native'
import { Video, AVPlaybackStatus } from 'expo-av'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const LinkPlayer = (props:any) => {
	const {notif} = useContext(UserContext)
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
			props.playvideo(position)
		} else if (!playing && position != null && position != 0) {
			props.pausevideo(position)
		}
	}, [playing])
	useEffect(() => {
		console.log(notif)
	}, [notif])
	return (
		<View style={[styles.player]}>
			<Video
			style={[styles.video]}
			ref={video}
			source={{ uri: props.uri }}
			useNativeControls
			isLooping
			resizeMode="contain"
			onPlaybackStatusUpdate={status => {
				setStatus(() => status)
			}}
			/> 
		</View>
	)
}

const YtPlayer = (props:any) => {
	return (
		<Text>Hello</Text>
	)
}

const Player = (props:any) => {
	const BackBtn = () => {
		return (
			<View style={[styles.back]}>
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
			<BackBtn />
			{
				props.uri.includes('youtube.com') || props.uri.includes('youtu.be') ? <YtPlayer uri={props.uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} /> : <LinkPlayer uri={props.uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} />
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
					props.setView('player')
					props.setvideo()
				}}
			>
				<Text>Link</Text>
			</TouchableOpacity>
		</View>
	)
}

const VideoPlayer = (props:any) => {
	const [view, setView] = useState('selector')
	const [uri, setUri] = useState("https://rr3---sn-gwpa-nia6.googlevideo.com/videoplayback?expire=1673032962&ei=oiC4Y5WsCcWmgQebwobYCA&ip=2a01%3A4f8%3A1c1e%3A5d0c%3A%3A1&id=o-AMRqeJa6yXgcwb_1nuHFCt3JgnCD9KoUbBvGNIVcDRCe&itag=397&source=youtube&requiressl=yes&vprv=1&mime=video%2Fmp4&gir=yes&clen=10104876&dur=128.962&lmt=1639878521826165&keepalive=yes&fexp=24007246&c=ANDROID&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOKR66MuQnCPCGkzlM9rST1PEuPPj27tTJFjUmAfp7yqAiEAzLJp8HXoCSaYg6R6qX9FkxgFLz0argVWXyFDTYTtgPo%3D&redirect_counter=1&rm=sn-4g5erd7e&req_id=d9167751bb0aa3ee&cms_redirect=yes&ipbypass=yes&mh=GJ&mip=2409:4066:e1b:36c6:f470:9a79:cb54:e64f&mm=31&mn=sn-gwpa-nia6&ms=au&mt=1673011080&mv=m&mvi=3&pcm2cms=yes&pl=41&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pcm2cms,pl&lsig=AG3C_xAwRQIgbSIML_Yr75GjWgL-mbQFGIGfG51zo8ie8E5jQ4rpcAYCIQCWBjXyyFiqI5hiDcoAHQlgW5RxV1YATHiLNF9KgJRf6w%3D%3D")
	return (
		<View style={[styles.main]}>
			{view == 'selector' ? <Selector setView={setView} setUri={setUri} setvideo={props.setvideo} /> : <Player uri={uri} playvideo={props.playvideo} pausevideo={props.pausevideo} seekvideo={props.seekvideo} /> }
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		flex: 0.4,
		minHeight: 100,
		backgroundColor: 'black',
	},

	back: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
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

