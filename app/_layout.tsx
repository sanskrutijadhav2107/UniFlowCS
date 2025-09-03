// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }







// app/_layout.jsx
import { Stack } from "expo-router";
import { View, Image, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/images/uniflowcs.png")} // ✅ update path if needed
              style={{ width: 30, height: 30, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#146ED7" }}>
              UniFlow CS
            </Text>
          </View>
        ),
        headerTitleAlign: "center", // ✅ centers logo + name
        headerStyle: { backgroundColor: "#fff" }, // header background
        headerShadowVisible: false, // removes bottom border for a cleaner look
      }}
    />
  );
}
