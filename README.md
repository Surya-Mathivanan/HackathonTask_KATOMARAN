# Todo Task Management Mobile App

A cross-platform mobile application built with React Native and Firebase for efficient task management. This app provides a clean, modern interface similar to Google Tasks with comprehensive features for organizing and tracking your daily tasks.

---

## 📱 Features

### ✅ Authentication
- **Google Sign-In**: Secure and seamless authentication powered by Firebase Auth, enabling one-tap login.
- **Error Handling**: Clear, descriptive error messages to guide users through login issues and failures.
- **Auto Sign-Out**: Simple and secure logout functionality to end sessions easily.

### ✅ Task Management (CRUD Operations)
- **Create Tasks**: Effortlessly add new tasks with fields like title, description, due date, and priority level.
- **Read Tasks**: Instantly view and sync tasks with real-time updates from Firestore.
- **Update Tasks**: Modify task details completely, including all fields, for full control over edits.
- **Delete Tasks**: Safely remove tasks using a confirmation dialog to avoid accidental deletions.
- **Mark Complete**: Change task status with a single tap to track completed and pending tasks.
- **Priority Levels**: Assign Low, Medium, or High priority with intuitive color coding for easy identification.

### ✅ User Interface
- **Cross-Platform**: Designed to work smoothly on both Android and iOS devices with a consistent experience.
- **Tab Navigation**: Organize and filter tasks efficiently using tabs like All, Completed, and Pending.
- **Search Functionality**: Real-time, dynamic search to filter tasks by title or description effortlessly.
- **Floating Action Button**: Easily accessible FAB to add new tasks from anywhere in the app.
- **Pull-to-Refresh**: Instantly refresh your task list with a simple downward swipe gesture.
- **Swipe-to-Delete**: Clean and intuitive swipe gesture for quickly deleting tasks.
- **Empty States**: Thoughtfully designed empty screens for different filter views to guide user experience.
- **Smooth Animations**: Subtle fade-in animations enhance the overall user interaction and feel.

### ✅ Extra Features
- **Firebase Integration**: Backed by Firestore for fast, secure, and real-time cloud data syncing.
- **Offline Support**: Tasks are cached locally using AsyncStorage, allowing full offline access.
- **Crash Reporting**: Integrated Firebase Crashlytics to monitor and resolve unexpected crashes.
- **Responsive Design**: Adaptive layout that provides a seamless experience across screen sizes and devices.

---

## 🔧 Tech Stack

- **React Native (Expo)**
- **Firebase Authentication**
- **Cloud Firestore**
- **AsyncStorage**
- **React Navigation**
- **Crashlytics**
- **Lottie / Reanimated / Icons**

---

## 📱 Screenshots

<img width="1366" height="695" alt="Image" src="https://github.com/user-attachments/assets/fac3a376-d18d-4732-ba2a-4d7b8952dcec" />

<img width="1366" height="697" alt="Image" src="https://github.com/user-attachments/assets/28ccaa6e-c080-4858-b064-e9e06c9f9454" />

<img width="1366" height="698" alt="Image" src="https://github.com/user-attachments/assets/cf5f4e8e-9d1a-4e74-88e2-7b560dee5696" />

<img width="1366" height="698" alt="Image" src="https://github.com/user-attachments/assets/59417a01-25b7-480e-bbfe-1f92715efb79" />

---

## 🏗️ Architecture

The app follows a modular architecture with clear separation of concerns:

```
todoapp/
├── .git/                        # Git version control folder
├── .expo/                       # Expo local data
├── .vercel/                     # Vercel deployment config (if used)
├── .vscode/                     # VSCode editor settings
├── android/                     # Android native project (if ejected)
├── app/                         # Expo Router app directory (routes, layouts)
│   ├── _layout.tsx
│   ├── AppWrapper.js
│   ├── index.js
│   ├── login.js
│   ├── sign-up.js
│   ├── task-list.js
│   └── ... (other route files)
├── assets/                      # Images, fonts, icons, etc.
├── components/                  # Reusable React Native components
│   ├── TaskListScreen.js
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── DateTimePickerWeb.js
│   └── ... (other UI components)
├── constants/                   # App-wide constants and styles
│   ├── Colors.ts
│   ├── GlobalStyles.ts
│   └── GoogleAuth.js
├── context/                     # React Contexts for state management
│   ├── AuthContext.js
│   └── ... (other contexts)
├── firebase/                    # Firebase config and utilities
│   └── config.js
├── hooks/                       # Custom React hooks
├── services/                    # Business logic, API, and storage services
│   ├── TaskService.js
│   └── ... (other services)
├── scripts/                     # Utility scripts (if any)
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # NPM lockfile
├── app.json                     # Expo app configuration
├── eas.json                     # EAS build configuration
├── tsconfig.json                # TypeScript config (if using TS)
├── eslint.config.js             # ESLint config
├── expo-env.d.ts                # Expo TypeScript env types
├── README.md                    # Project documentation
├── .gitignore                   # Git ignore rules
```

### Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   React Native  │    │   Local Storage │
│   (Auth & DB)   │◄──►│   Application   │◄──►│   (AsyncStorage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Context API   │
                    │  (State Mgmt)   │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Components    │
                    │   & Screens     │
                    └─────────────────┘
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Surya-Mathivanan/HackathonTask_KATOMARAN
   cd todoapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Enable Google Sign-In in Authentication > Sign-in method
   - Replace the placeholder Firebase config in `App.js` with your actual config
   - Download and configure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

4. **Google Sign-In Setup**
   - Get your Web Client ID from Firebase Console
   - Replace the placeholder in `src/context/AuthContext.js`

5. **Run the application**
   ```bash
   # Start the Expo development server
   npm start
   # or
   expo start

   # Run on specific platform
   npm run android  # For Android
   npm run ios      # For iOS
   ```

### Firebase Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📦 APK Download

 - APK Link : [https://expo.dev/accounts/surya-mathivanan/projects/todoapp/builds/c1733006-13f7-42ea-bc48-6d20cfabbdf3]
 - Download Drive Link : [https://drive.google.com/file/d/1s3O_mGvpi-Gf1REzdLbX8XGNrOx2AHAy/view?usp=sharing]

## 🎥 Demo Video

**Loom Video**: *[https://www.loom.com/share/21e945456ae44a70984fd68747a7af61?sid=164e84da-55df-4b8d-8b91-47ed55e4d0c6]*

https://streamable.com/rtn4k5

The demo video covers:
- App overview and navigation
- Authentication flow
- Task creation and management
- Search and filtering functionality
- Offline capabilities demonstration

## 🧪 Testing

The app has been tested on:
- Android devices (various screen sizes)
- iOS devices (iPhone and iPad)
- Different network conditions (online/offline)

## 🔧 Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Firebase**: Backend services (Auth, Firestore, Crashlytics)
- **React Navigation**: Navigation library
- **React Context API**: State management
- **AsyncStorage**: Local data persistence
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch gestures

## 📝 Best Practices Implemented

- **Modular Code Structure**: Clear separation of concerns
- **Error Handling**: Comprehensive error handling throughout the app
- **Performance Optimization**: Efficient re-renders and memory usage
- **Accessibility**: Screen reader support and proper labeling
- **Security**: Proper Firebase security rules and data validation
- **Code Quality**: Consistent coding style and documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Footer**: This project is a part of a hackathon run by https://www.katomaran.com
```


