


import { useContext } from "react"
import UserContext from '../../Context'
import { View, Button, Text, StyleSheet } from 'react-native'

const Header = (props :any) => {
	const [name, setName, loginstate, setLoginstate, uid, setUid, login, logOut] = useContext(UserContext)
	return (
		<View style={[styles.nav]}>
			<Text style={[styles.whiteText]}>FireChat</Text>
			<Text style={[styles.whiteText]}>{props.title}</Text>
			{loginstate ? 
				<Button
					title='Logout'
					onPress={logOut}
				/> :
				<Button
					title='Login'
					onPress={login}
				/>
			}
		</View>
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
		paddingRight: 60,
	},

	whiteText: {
		color: 'white',
	}
})

export default Header
