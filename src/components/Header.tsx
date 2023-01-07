


import { useContext } from "react"
import { UserContext } from '../../Context'
import { View, Button, Text, StyleSheet } from 'react-native'

const Header = (props :any) => {
	const {loginstate, logOut} = useContext(UserContext)
	return (
		<View style={[styles.nav]}>
			<Button
				title={props.to}
				onPress={() => props.navigation.navigate(props.to)}
			/>
			<Text style={[styles.whiteText]}>{props.title}</Text>
			{loginstate ? 
				<Button
					title='Logout'
					onPress={logOut}
				/> :
				<Button
					title='Login'
					onPress={() => props.navigation.navigate('Login')}
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
