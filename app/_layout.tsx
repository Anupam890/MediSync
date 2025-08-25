import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

function RootLayoutAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={"pk_test_b3V0Z29pbmctYmx1ZWpheS05MS5jbGVyay5hY2NvdW50cy5kZXYk"}
    >
      <StatusBar barStyle={"dark-content"}/>
      <RootLayoutAuth />
    </ClerkProvider>
  );
}
