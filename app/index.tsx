import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../AuthContext";
import { auth } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Simple toggle function for teacher/student
  const toggleRole = () => setIsTeacher((prev) => !prev);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // redirect based on role toggle
      router.replace(isTeacher ? "/teacher" : "/student");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      >
      <Image
        source={require("../assets/images/QuizMon.jpg")}
        style={styles.avatar}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>Login</Text>

      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButton,
            !isTeacher && styles.toggleActive,
          ]}
          onPress={() => setIsTeacher(false)}
        >
          <Text style={[styles.toggleText, !isTeacher && styles.toggleTextActive]}>
            Student
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.toggleButton,
            isTeacher && styles.toggleActive,
          ]}
          onPress={() => setIsTeacher(true)}
        >
          <Text style={[styles.toggleText, isTeacher && styles.toggleTextActive]}>
            Staff
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>
          <Text style={{fontSize: 18}}>🌐 </Text> Sign in with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>
          <Text style={{fontSize: 18}}> </Text> Sign in with Apple
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.cantSignInText}>Can't sign in?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3D7",
    paddingHorizontal: 30,
  },
  contentContainer: {  // Add this new style
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20, // Add some vertical padding
  },
  avatar: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#4E342E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  toggleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F79471",
    borderRadius: 30,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 36,
  },
  toggleActive: {
    backgroundColor: "#F79471",
  },
  toggleText: {
    color: "#F79471",
    fontWeight: "600",
    fontSize: 16,
  },
  toggleTextActive: {
    color: "#FFF",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: "#F79471",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D3D3D3",
  },
  orText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#999",
  },
  socialButton: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 15,
    alignItems: "center",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  cantSignInText: {
    marginTop: 12,
    color: "#555",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
