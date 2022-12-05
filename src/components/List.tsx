import { FlatList, StyleSheet } from "react-native";

const List = (props:any) => {
	return (
		<FlatList
			style={props.styles.list}
			inverted={true}
			data={props.messages?.sort((a:any, b:any) => b.timestamp.seconds - a.timestamp.seconds)}
			renderItem={props.renderItem}
			keyExtractor={item => item.timestamp.seconds}
		/>
	)
}

export default List
