import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext'

const InnerLayout = () => {
	const { theme } = useThemeContext()
	return (
		<PaperProvider theme={theme}>
			<SafeAreaView style={styles.container}>
				<Stack screenOptions={{ headerShown: false }} />
			</SafeAreaView>
		</PaperProvider>
	)
}

const RootLayout = () => (
	<ThemeProvider>
		<InnerLayout />
	</ThemeProvider>
)

export default RootLayout

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
