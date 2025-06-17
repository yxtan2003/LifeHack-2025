// app/live-quiz.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LiveQuiz() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(
    null
  );
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  const handlePostQuestion = () => {
    if (question.trim()) {
      setSubmittedQuestion(question);
      setQuestion("");
      setAnswers([]);
    }
  };

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      setAnswers((prev) => [...prev, answer]);
      setAnswer("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Quiz</Text>

      <Button title="Back to Home" onPress={() => router.back()} />

      {!submittedQuestion && (
        <View style={styles.section}>
          <Text style={styles.label}>Post a Question (Teacher)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter question"
            value={question}
            onChangeText={setQuestion}
          />
          <Button title="Post Question" onPress={handlePostQuestion} />
        </View>
      )}

      {submittedQuestion && (
        <View style={styles.section}>
          <Text style={styles.label}>Question:</Text>
          <Text style={styles.question}>{submittedQuestion}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your answer"
            value={answer}
            onChangeText={setAnswer}
          />
          <Button title="Submit Answer" onPress={handleSubmitAnswer} />

          <Text style={styles.label}>Submitted Answers:</Text>
          <FlatList
            data={answers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Text>
                {index + 1}. {item}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  question: { fontSize: 18, marginBottom: 10 },
});
