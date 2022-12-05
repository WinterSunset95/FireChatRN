import { useState, useEffect, useContext } from 'react'
import {Alert, StyleSheet, Modal, Button, View, Text, TouchableOpacity, TextInput} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import UserContext from '../../Context'

	const LogIn = (props:any) => {
		return (
			<>
				<TextInput
					placeholder='Username'
					style={[styles.modalInput, {marginBottom: 20}]}
					onChangeText={(event) => {
						props.setEmail(event)
					}}
					defaultValue={props.email}
				/>
				<TextInput
					placeholder='Password'
					style={[styles.modalInput, {marginBottom: 20}]}
					onChangeText={(text) => {
						props.setPassword(text)
					}}
					defaultValue={props.password}
				/>
				<TouchableOpacity
					style={[styles.modalButton]}
					onPress={() => props.signIn()}
				>
					<Text>Login</Text>
				</TouchableOpacity>
			</>
		)
	}

	const CreateNew = (props:any) => {
		return (
			<>
				<TextInput
					placeholder='Username'
					style={[styles.modalInput, {marginBottom: 20}]}
					onChangeText={(event) => {
						props.setUname(event)
					}}
					defaultValue={props.uname}
				/>
				<TextInput
					placeholder='Email'
					style={[styles.modalInput, {marginBottom: 20}]}
					onChangeText={(event) => {
						props.setEmail(event)
					}}
					defaultValue={props.email}
				/>
				<TextInput
					placeholder='Password'
					style={[styles.modalInput, {marginBottom: 20}]}
					onChangeText={(text) => {
						props.setPassword(text)
					}}
					defaultValue={props.password}
				/>
				<TextInput
					placeholder='Confirm'
					style={[styles.modalInput, {marginBottom: 20}]}
					onChangeText={(text) => {
						props.setConfirm(text)
					}}
					defaultValue={props.confirm}
				/>
				<TouchableOpacity
					style={[styles.modalButton]}
					onPress={() => props.userCreate()}
				>
					<Text>Sign Up</Text>
				</TouchableOpacity>
			</>
		)
	}


const LoginForm = (props:any) => {
	const [name, setName, loginstate, setLoginstate, uid, setUid, login, logOut] = useContext(UserContext)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirm, setConfirm] = useState("")
	const [tab, setTab] = useState(true)
	const [uname, setUname] = useState("")
	const signIn = () => {
		const auth = getAuth()
		const mail = email.trim()
		const pass = password.trim()
		signInWithEmailAndPassword(auth, mail, pass)
		.then((result) => {
			if (result.user) {
				setName(result.user.displayName ? result.user.displayName : result.user.email )
				setLoginstate(true)
				setUid(result.user.uid!)
				Alert.alert(
					"Logged in as " + result.user.displayName!
				)
				props.navigation.navigate('Global')
			}
		})
		.catch((error) => {
			props.navigation.navigate('Global')
			console.log(error)
			Alert.alert (
				"Failed to login"
			)
		})
	}

	const userCreate = () => {
		const auth = getAuth()
		const mail = email.trim()
		const pass = password.trim()
		if (pass == confirm.trim()) {
			createUserWithEmailAndPassword(auth, mail, pass)
			.then((result) => {
				if (result.user) {
					setName(result.user.displayName ? result.user.displayName : result.user.email)
					setLoginstate(true)
					setUid(result.user.uid!)
					Alert.alert(
						"Logged in as " + result.user.displayName!
					)
					props.navigation.navigate('Global')
				}
			})
			.catch((error) => {
				props.navigation.navigate('Global')
				console.log(error)
				Alert.alert (
					"Failed to create user"
				)
			})
		} else {
			Alert.alert(
				"Password do not match"
			)
		}
	}

	return (
		<View style={[styles.modal]}>
			<View
				style={[styles.modalContent]}
			>
				<TouchableOpacity
					style={{marginBottom: 20, alignSelf: 'flex-end'}}
					onPress={() => props.navigation.navigate('Global')}
				>
					<FontAwesomeIcon icon={faCircleXmark} size={30} color='black'/>
				</TouchableOpacity>
				<View style={{ 
						flex: 0, 
						flexDirection: 'row', 
						width: '100%' ,
						justifyContent: 'center',
						marginBottom: 20
					}}>
					<TouchableOpacity
						style={tab ? [styles.wFull, styles.active] : [styles.wFull]}
						onPress={() => setTab(true)}
					>
						<Text>Login</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={tab ? [styles.wFull] : [styles.wFull, styles.active]}
						onPress={() => setTab(false)}
					>
						<Text>Sign Up</Text>
					</TouchableOpacity>
				</View>
				{tab ? <LogIn email={email} setEmail={setEmail} password={password} setPassword={setPassword} signIn={signIn} navigation={props.navigation}/> : <CreateNew email={email} setEmail={setEmail} password={password} setPassword={setPassword} confirm={confirm} setConfirm={setConfirm} userCreate={userCreate} navigation={props.navigation} uname={uname} setUname={setUname}/>}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},

	modalButton: {
		alignSelf: 'flex-end',
		width: 100,
		padding: 10,
		borderRadius: 20,
		backgroundColor: 'lightblue',
	},

	modalContent: {
		flex: 0,
		justifyContent: 'center',
		width: 300,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 20,
	},

	modalInput: {
		padding: 10,
	 height: 40,
	 width: '100%',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 20,
		color: 'black',
	},

	wFull: {
		flex: 1,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},

	active: {
		backgroundColor: 'lightblue'
	}
	
})

export default LoginForm
