import { StyleSheet, View, Text, Button, TouchableOpacity, Image, Alert } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../Context'

const Users = (props:any) => {
	const {uid, users, setPrivatechat} = useContext(UserContext)
	return (
		<View style={[styles.main]}>
			{
				users ? users.map((user:any) => {
					return (
						<TouchableOpacity key={user.uid} style={[styles.user]} onPress={() => {
							if (uid != user.uid) {
								props.navigation.navigate('Private')
								setPrivatechat(user.uid)
							} else {
								Alert.alert('YOU CANNOT CHAT WITH YOURSELF MF')
							}
							}}>
							<Image style={[styles.pic]} source={{ uri: user.picture != null ? user.picture : 'https://avatars.dicebear.com/api/bottts/' + user.name + '.png' }} />
							<Text>{user.name}</Text>
						</TouchableOpacity>
					)
				}) : null
			}
		</View>
	)
}

export default Users

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
