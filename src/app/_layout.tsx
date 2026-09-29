import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "GameTrack",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-game"
        options={{
          title: "Add Game",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="collection"
        options={{
          title: "My Collection",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

