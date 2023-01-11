
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, Alert } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../Context'

const Groups = (props:any) => {
	const {uid, users, setPrivatechat} = useContext(UserContext)
	return (
		<View style={[styles.main]}>
			<TouchableOpacity style={styles.user}
			onPress={() => {
				props.navigation.navigate('Global')
			}}
			>
				<Image style={[styles.pic]} source={{ uri: 'https://avatars.dicebear.com/api/bottts/globalchat.png' }} />
				<Text>Global Chat</Text>
			</TouchableOpacity>
		</View>
	)
}

export default Groups

const styles = StyleSheet.create({
	main: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		padding: 15,
	},

	user: {
		marginBottom: 10,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	pic: {
		width: 50,
		height: 50,
		borderRadius: 1000,
		marginRight: 5,
		borderWidth: 1,
		borderColor: 'black'
	},

})
