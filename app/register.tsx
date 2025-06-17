import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  const checkNameAvailability = async (name: string) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", "==", name.trim()));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking name:", error);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Error", "Name is required for all users");
      return;
    }

    setLoading(true);
    setNameError("");

    try {
      // Check if name is available
      const isNameAvailable = await checkNameAvailability(name);
      if (!isNameAvailable) {
        setNameError("This name is already taken");
        return;
      }

      // Check if email exists
      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        Alert.alert("Error", "This email is already registered");
        return;
      }

      // Create auth account
      await createUserWithEmailAndPassword(auth, email, password);

      // Store user data in Firestore
      await setDoc(doc(db, "users", email), {
        email,
        name: name.trim(),
        isTeacher,
        createdAt: new Date(),
        lastActive: new Date()
      });

      Alert.alert("Success", `Registered as ${isTeacher ? "teacher" : "student"}!`);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Registration error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Role Selection */}
      <View style={styles.roleToggle}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            styles.leftButton,
            !isTeacher && styles.roleButtonActive
          ]}
          onPress={() => setIsTeacher(false)}
        >
          <Text style={!isTeacher ? styles.roleButtonTextActive : styles.roleButtonText}>
            Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            styles.rightButton,
            isTeacher && styles.roleButtonActive
          ]}
          onPress={() => setIsTeacher(true)}
        >
          <Text style={isTeacher ? styles.roleButtonTextActive : styles.roleButtonText}>
            Teacher
          </Text>
        </TouchableOpacity>
      </View>

      {/* Name Input */}
      <View style={styles.nameContainer}>
        <TextInput
          style={[
            styles.input,
            nameError ? styles.inputError : null
          ]}
          placeholder="Choose your unique name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError("");
          }}
        />
        {nameError ? (
          <Text style={styles.errorText}>{nameError}</Text>
        ) : (
          <Text style={styles.nameHelpText}>
            This name will be visible to {isTeacher ? "students" : "teachers"}
          </Text>
        )}
      </View>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Register Button */}
      <TouchableOpacity 
        style={[
          styles.registerButton, 
          loading && styles.registerButtonDisabled
        ]} 
        onPress={handleRegister}
        disabled={loading || !!nameError}
      >
        <Text style={styles.registerButtonText}>
          {loading ? "Registering..." : `Register as ${isTeacher ? "Teacher" : "Student"}`}
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.backToLoginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6E4",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#4E342E",
  },
  roleToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F79471",
    overflow: "hidden",
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  leftButton: {
    borderRightWidth: 0,
  },
  rightButton: {
    borderLeftWidth: 0,
  },
  roleButtonActive: {
    backgroundColor: "#F79471",
  },
  roleButtonText: {
    color: "#F79471",
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  nameContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
  },
  nameHelpText: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: "#F79471",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  backToLoginText: {
    color: "#555",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});