// app/teacher/index.tsx
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

type Question = {
  text: string;
  options: string[];
  correctAnswer: string;
  pointsCorrect: number;
  pointsWrong: number;
};

export default function TeacherDashboard() {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    pointsCorrect: 1,
    pointsWrong: 0
  }]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      pointsCorrect: 1,
      pointsWrong: 0
    }]);
  };

  const removeLastQuestion = () => {
    if (questions.length > 1) {
      setQuestions(questions.slice(0, -1));
    }
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const validateQuiz = () => {
    if (!quizTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a quiz title');
      return false;
    }

    for (const question of questions) {
      if (!question.text.trim()) {
        Alert.alert('Validation Error', 'All questions must have text');
        return false;
      }

      if (question.options.some(opt => !opt.trim())) {
        Alert.alert('Validation Error', 'All options must be filled');
        return false;
      }

      if (!question.correctAnswer) {
        Alert.alert('Validation Error', 'Please mark the correct answer for each question');
        return false;
      }
    }

    return true;
  };

  const publishQuiz = async () => {
    if (!validateQuiz()) return;

    setLoading(true);
    try {
      const quizRef = await addDoc(collection(db, 'quizzes'), {
        title: quizTitle,
        teacherName: auth.currentUser?.email?.split('@')[0] || 'Teacher',
        createdAt: serverTimestamp(),
        questionCount: questions.length
      });

      await Promise.all(questions.map(question => 
        addDoc(collection(db, `quizzes/${quizRef.id}/questions`), question)
      ));

      Alert.alert('Success', 'Quiz published successfully!');
      resetForm();
    } catch (error) {
      console.error('Error publishing quiz:', error);
      Alert.alert('Error', 'Failed to publish quiz');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuestions([{
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      pointsCorrect: 1,
      pointsWrong: 0
    }]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create New Quiz</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Quiz Title"
          value={quizTitle}
          onChangeText={setQuizTitle}
        />
        
        {questions.map((question, qIndex) => (
          <View key={qIndex} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Question {qIndex + 1}</Text>
              {questions.length > 1 && (
                <TouchableOpacity 
                  onPress={() => removeLastQuestion()}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Question Text"
              value={question.text}
              onChangeText={(text) => {
                const updated = [...questions];
                updated[qIndex].text = text;
                setQuestions(updated);
              }}
            />
            
            {question.options.map((option, oIndex) => (
              <View key={oIndex} style={styles.optionRow}>
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChangeText={(text) => handleOptionChange(qIndex, oIndex, text)}
                />
                <TouchableOpacity
                  style={[
                    styles.correctButton,
                    question.correctAnswer === option && styles.correctButtonActive
                  ]}
                  onPress={() => {
                    const updated = [...questions];
                    updated[qIndex].correctAnswer = option;
                    setQuestions(updated);
                  }}
                >
                  <Text style={styles.checkmark}>✓</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={styles.pointsContainer}>
              <View style={styles.pointsInputContainer}>
                <Text style={styles.pointsLabel}>Points if correct:</Text>
                <TextInput
                  style={styles.pointsInput}
                  keyboardType="numeric"
                  value={String(question.pointsCorrect)}
                  onChangeText={(text) => {
                    const updated = [...questions];
                    updated[qIndex].pointsCorrect = Math.max(0, parseInt(text) || 0);
                    setQuestions(updated);
                  }}
                />
              </View>
              
              <View style={styles.pointsInputContainer}>
                <Text style={styles.pointsLabel}>Points if wrong:</Text>
                <TextInput
                  style={styles.pointsInput}
                  keyboardType="numeric"
                  value={String(question.pointsWrong)}
                  onChangeText={(text) => {
                    const updated = [...questions];
                    updated[qIndex].pointsWrong = Math.max(0, parseInt(text) || 0);
                    setQuestions(updated);
                  }}
                />
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addQuestion}
          >
            <Text style={styles.buttonText}>Add Question ({questions.length})</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.publishButton, loading && styles.disabledButton]}
            onPress={publishQuiz}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Publishing...' : 'Publish Quiz'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FF8A65',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  logoutText: {
    color: '#FF8A65',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5D4037',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D7CCC8',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  questionCard: {
    borderWidth: 1,
    borderColor: '#FFAB91',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5D4037',
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: '#E53935',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  correctButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderRadius: 8,
  },
  correctButtonActive: {
    backgroundColor: '#81C784',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pointsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    marginRight: 5,
    color: '#5D4037',
  },
  pointsInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    backgroundColor: '#64B5F6',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  publishButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#81C784',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});