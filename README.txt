SIGNALWISE

Signalwise is a learning and knowledge-management platform designed to help users learn cybersecurity and other educational topics through structured lessons, quizzes, and progress tracking.

The platform provides a simple learning environment where administrators can create, manage, and publish educational topics and quizzes, while learners can access published content, test their understanding, and track their learning progress.

## Features

* **User Authentication** — Secure account registration and login using Firebase Authentication, including Google Sign-In.
* **Learning Topics** — Learners can browse and study published educational topics.
* **Quizzes** — Each topic can include quizzes that allow learners to test their understanding and receive scores based on their answers.
* **Progress Tracking** — Learner quiz results and learning progress are stored and associated with their account.
* **Notifications** — Users receive notifications when new learning topics are added or published.
* **Admin Dashboard** — Administrators can create, edit, publish, and delete learning topics and quizzes.
* **Content Management** — Educational content, quizzes, tips, and notices are managed through the application's database.
* **Firebase Integration** — Firebase is used for authentication, cloud data storage, and application hosting.
* **Responsive Interface** — The application is designed to provide a consistent experience across different screen sizes.

## Technology Stack

**Frontend**

* React
* TypeScript
* Vite

**Backend / Cloud Services**

* Firebase Authentication
* Cloud Firestore
* Firebase Hosting

**Development**

* Node.js
* npm

## How It Works

Signalwise separates the learning experience into two main areas: **administration** and **learning**.

Administrators manage the educational content by creating topics and quizzes. Once a topic is published, it becomes available to learners and an automatic notification can be generated to inform users about the new content.

Learners can then open the published topic, study the material, complete its quiz, and receive a result. Their quiz results and progress are stored in Firestore and can be viewed through their profile.

## Purpose

The goal of Signalwise is to provide a straightforward platform for delivering educational content while combining learning materials, assessments, notifications, and progress tracking in one application.

1. npm install firebase
2. Copy .env.local.example to .env.local and fill in Firebase Web App config.
3. Deploy firestore.rules in Firebase Console -> Firestore Database -> Rules.
4. Create the first admin account in Firebase Authentication.
5. Copy that user's UID. In Firestore create users/{UID} with:
   name: Signalwise Admin
   email: your-admin-email
   role: admin
6. Start the app: npm run dev
7. Sign in as admin -> Admin -> Quizzes -> Import starter content.
8. The app will then read/write lessons, tips, quizzes, notices and userProgress from Firestore.
