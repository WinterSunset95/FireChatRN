import { StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput, Button } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import {UserContext} from '../../Context'

const InputArea = (props:any) => {
	const {videostat, setVideostat} = useContext(UserContext)
	if (props.loginstate) {
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
					onPress={props.login}
				/>
			</KeyboardAvoidingView>
		)
	}
}

const styles = StyleSheet.create({
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

export default InputArea
