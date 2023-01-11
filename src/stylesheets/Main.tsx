




import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
	fullFlex: {
		flex: 1,
	},
	header: {
		flex: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	headerTextField: {
		flex: 0,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	headerImage: {
		width: 30,
		height: 30,
		borderRadius: 1000,
		marginRight: 5,
	}
})
export default styles
