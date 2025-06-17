// app/student/index.tsx
import { useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../firebaseConfig';

type Quiz = {
  id: string;
  title: string;
  teacherName: string;
};

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  pointsCorrect: number;
  pointsWrong: number;
};

type UserData = {
  name: string;
  totalScore: number;
};

export default function StudentDashboard() {
  const [teacherName, setTeacherName] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  // Load student data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser?.email) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          setUserData({
            name: userDoc.data().name || 'Student',
            totalScore: userDoc.data().totalScore || 0
          });
        }
      }
    };
    fetchUserData();
  }, []);

  const searchQuizzes = async () => {
    try {
      const q = query(
        collection(db, 'quizzes'), 
        where('teacherName', '>=', teacherName),
        where('teacherName', '<=', teacherName + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      setQuizzes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
    } catch (error) {
      Alert.alert('Error', 'Failed to search quizzes');
    }
  };

  const startQuiz = async (quiz: Quiz) => {
    try {
      const querySnapshot = await getDocs(collection(db, `quizzes/${quiz.id}/questions`));
      const loadedQuestions = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Question));
      
      // Shuffle questions
      setQuestions(loadedQuestions.sort(() => Math.random() - 0.5));
      setSelectedQuiz(quiz);
      setScore(0);
      setCurrentQuestionIndex(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to load quiz');
    }
  };

  const handleAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const pointsChange = isCorrect ? currentQuestion.pointsCorrect : -currentQuestion.pointsWrong;
    
    setScore(prev => prev + pointsChange);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      await updateStudentScore(score + pointsChange);
      showQuizResults(score + pointsChange);
    }
  };

  const updateStudentScore = async (finalScore: number) => {
    if (!auth.currentUser?.email) return;
    
    try {
      await setDoc(doc(db, 'users', auth.currentUser.email), {
        totalScore: finalScore,
        lastActive: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const showQuizResults = (finalScore: number) => {
    Alert.alert(
      'Quiz Completed', 
      `Your score: ${finalScore}\n${getPerformanceMessage(finalScore)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedQuiz(null);
            // Refresh user data to show updated score
            if (auth.currentUser?.email) {
              getDoc(doc(db, 'users', auth.currentUser.email)).then(doc => {
                if (doc.exists()) {
                  setUserData({
                    name: doc.data().name || 'Student',
                    totalScore: doc.data().totalScore || 0
                  });
                }
              });
            }
          }
        }
      ]
    );
  };

  const getPerformanceMessage = (score: number) => {
    if (questions.length === 0) return '';
    const percentage = score / questions.reduce((sum, q) => sum + q.pointsCorrect, 0);
    if (percentage > 0.8) return 'Excellent work!';
    if (percentage > 0.5) return 'Good job!';
    return 'Keep practicing!';
  };

  return (
    <View style={styles.container}>
      {/* Student Info Header */}
      {userData && (
        <View style={styles.userHeader}>
          <Text style={styles.userName}>Hello, {userData.name}!</Text>
          <Text style={styles.userScore}>Total Score: {userData.totalScore}</Text>
        </View>
      )}

      {!selectedQuiz ? (
        <>
          <Text style={styles.title}>Find Teacher's Quiz</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter teacher's name"
            value={teacherName}
            onChangeText={setTeacherName}
          />
          <TouchableOpacity style={styles.button} onPress={searchQuizzes}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          {quizzes.length > 0 && (
            <ScrollView style={styles.quizList}>
              {quizzes.map(quiz => (
                <TouchableOpacity 
                  key={quiz.id} 
                  style={styles.quizItem}
                  onPress={() => startQuiz(quiz)}
                >
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizTeacher}>By: {quiz.teacherName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </>
      ) : (
        <>
          <Text style={styles.title}>{selectedQuiz.title}</Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex]?.text}
          </Text>
          
          <ScrollView style={styles.optionsContainer}>
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption
                ]}
                onPress={() => setSelectedAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Current Quiz Score: {score}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              !selectedAnswer && styles.disabledButton
            ]}
            onPress={handleAnswer}
            disabled={!selectedAnswer}
          >
            <Text style={styles.submitButtonText}>
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF6E4',
  },
  userHeader: {
    backgroundColor: '#F79471',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userScore: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4E342E',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#F79471',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quizList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  quizItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  quizTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  quizTeacher: {
    color: '#666',
    fontSize: 14,
  },
  questionCounter: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
    maxHeight: 300,
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#64B5F6',
  },
  optionText: {
    fontSize: 16,
  },
  scoreContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  submitButton: {
    backgroundColor: '#F79471',
    padding: 15,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});