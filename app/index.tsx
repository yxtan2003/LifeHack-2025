// app/index.tsx
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Interactive Learning App</Text>
      <Button
        title="Go to Live Quiz"
        onPress={() => router.push("./live-quiz")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
