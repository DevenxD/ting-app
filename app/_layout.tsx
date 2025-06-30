import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { PaperProvider, MD3DarkTheme as DefaultTheme } from 'react-native-paper'

const RootLayout = () => {
	return (
		<PaperProvider theme={DefaultTheme}>
			<Stack />
		</PaperProvider>
	)
}

export default RootLayout

const styles = StyleSheet.create({})
