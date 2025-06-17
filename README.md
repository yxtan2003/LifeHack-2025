# StudyHack – Real-Time Interactive Quiz Platform

**Team Name**: LyfeHackers  
**Team ID**: 21

**Team Members**:

- Tan Yi Xun
- Ong Kwan Kiat Kenneth
- Leng Cheng Song, Bryan

**Problem Statement**:  
Theme 2 – Problem Statement 2: _"How can we enhance virtual learning environments to better support engagement, interactivity, and feedback for students and teachers?"_

## 🧠 Introduction

The shift to remote education, accelerated by the global pandemic, has exposed critical gaps in existing virtual classroom platforms. Many tools lack interactivity, immediate feedback, and real-time engagement — all essential elements for effective learning.

A 2023 OECD report highlighted that **42% of educators** find current digital tools inadequate for fostering interactive learning experiences. Additionally, students report difficulty staying motivated and involved due to the passive nature of many online platforms.

**StudyHack** addresses these shortcomings by offering a real-time mobile quiz and engagement platform designed to bridge the gap between traditional classrooms and virtual learning.

## 📱 Solution Overview

**StudyHack** is a mobile-first quiz and assessment app that facilitates **live interaction** between teachers and students. It turns passive content consumption into dynamic, engaging learning.

### Core Capabilities:

- **Live Quizzes**: Teachers post real-time questions; students respond instantly.
- **Instant Feedback & Analytics**: Students get immediate grading and performance insights; teachers see class-wide trends.
- **Gamified Interaction**: Multiple-choice, polls, and peer-reviewed answers increase student engagement.
- **Lightweight Design**: Optimized for low-bandwidth environments and mobile accessibility.
- **Cross-Platform**: Compatible with both Android and iOS devices via React Native.

## ✨ Key Features

| Feature                   | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Live Quizzes**          | Teachers create quizzes in real-time; students answer instantly via mobile.     |
| **Performance Analytics** | View individual and group-level performance immediately after each quiz.        |
| **Peer Feedback**         | Optional feature for students to review and rate answers anonymously.           |
| **Teacher Dashboard**     | Manage quizzes, track attendance, monitor engagement and scores.                |
| **Secure Authentication** | Role-based login for students and teachers with encrypted data access.          |
| **Multilingual Support**  | Localized UI with future-ready language pack integration.                       |
| **Virtual Pet**           | Students can upgrade and evolve their virtual pet by gaining points from class. |
| **Notifications**         | Increases student engagement                                                    |
| **Leaderboard system**    | Students can view each other's points                                           |

## 🧰 Technical Stack

| Component          | Technology                              |
| ------------------ | --------------------------------------- |
| **Frontend**       | React Native (with Expo Router)         |
| **Backend**        | Firebase (Auth, Firestore, Storage)     |
| **Authentication** | Firebase Auth (email & OAuth)           |
| **Real-time Sync** | Firestore + Cloud Functions             |
| **UI Library**     | NativeBase / ShadCN-inspired components |
| **Navigation**     | `expo-router`                           |
| **Hosting**        | Firebase                                |

## 🔒 Security & Privacy

- **Encrypted Connections**: All data transmitted over HTTPS.
- **Role-Based Access Control**: Teacher and student roles enforce access restrictions.
- **Data Privacy**: Personal data is stored securely and used only for educational functionality.
- **Anonymous Participation**: Peer review and polling features protect student identities where needed.

## 🌍 Accessibility & Inclusion

- Mobile-first UI design with large touch targets and readable fonts.
- Minimal dependencies for optimal performance on older or low-spec devices.
- Multilingual support in progress, with a localization framework in place.

## 📈 Future Enhancements

- **Offline Mode**: Cache quizzes for low-connectivity scenarios.
- **Leaderboard & Rewards**: Add gamified points and rankings.
- **Question Bank**: Save and reuse frequently asked questions.
- **Parent/Guardian Access**: Read-only dashboard for guardians.
- **Screen Reader Support**: Full accessibility compliance for visually impaired users.

## 🧪 How to Run Locally

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the Expo project**:

   ```bash
   npx expo start
   ```

3. **View on mobile**:
   Download Expo Go on your Android/iOS device.
   Scan the QR code in the terminal or browser.
