import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="restaurantList" options={{ headerShown: false }} />
      <Stack.Screen name="profilePage" options={{ headerShown: false }} />
      <Stack.Screen name="signInPage" options={{ headerShown: false }} />
      <Stack.Screen name="registrationPage" options={{ headerShown: false }} />
      <Stack.Screen name="addRestaurant" options={{ headerShown: false }} />
      <Stack.Screen name="restaurants/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="reviews/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
