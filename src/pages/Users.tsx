import { StyleSheet, View, Text, Button } from 'react-native'

const Users = (props:any) => {
	return (
		<View>
			<Text>This is the users page</Text>
			<Button
				title="Global"
				onPress={() => props.navigation.navigate('Global')}
			/>
		</View>
	)
}

export default Users
