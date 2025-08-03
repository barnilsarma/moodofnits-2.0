import admin from "firebase-admin";

const initializeFirebase = () => {
  if (!admin.apps.length) {
    console.log("Initializing Firebase...");
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error("Missing Firebase environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase initialized successfully.");
  }
};

const getFirebaseAuth = () => {
  if (!admin.apps.length) {
    initializeFirebase();
  }
  return admin.auth();
};

export { getFirebaseAuth };
