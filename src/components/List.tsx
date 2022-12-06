import { FlatList, StyleSheet } from "react-native";

const List = (props:any) => {
	return (
		<FlatList
			style={styles.list}
			inverted={true}
			data={props.messages?.sort((a:any, b:any) => b.timestamp.seconds - a.timestamp.seconds)}
			renderItem={props.renderItem}
			keyExtractor={item => item.timestamp.seconds}
		/>
	)
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		padding: 20,
		paddingTop: 0,
		paddingBottom: 20,
		backgroundColor: '#999'
	},

})

export default List
