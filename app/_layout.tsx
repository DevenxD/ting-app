import { Stack } from "expo-router";
import { PaperProvider, Surface } from "react-native-paper";
import { ThemeProvider, useThemeContext } from "../contexts/ThemeContext";
import "../global.css";
import { StyleSheet } from "react-native";
import DynamicStatusbar from "../components/DynamicStatusbar";
import { SafeAreaView } from "react-native-safe-area-context";

const InnerLayout = () => {
  const { theme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <DynamicStatusbar />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </PaperProvider>
  );
};

const RootLayout = () => (
  <ThemeProvider>
    <InnerLayout />
  </ThemeProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootLayout;
