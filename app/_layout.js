import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="restaurantList" options={{ headerShown: false }} />
      <Stack.Screen name="profilePage" options={{ headerShown: false }} />
    </Stack>
  );
}
