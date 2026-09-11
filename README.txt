SIGNALWISE FIREBASE MIGRATION

Copy these files into the matching locations in your Signalwise project.

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
