// Firebase Admin Configuration for Backend Sync
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// Go to: Project Settings > Service Accounts > Generate New Private Key
// Save it as firebase-service-account.json in the backend directory

let db = null;

const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length === 0) {
      // Option 1: Using service account file (recommended for production)
      // Uncomment and use this if you have the service account JSON file
      /*
      const serviceAccount = require('./firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'live-score-app-568b8'
      });
      */

      // Option 2: Using environment variables (for deployment)
      // Make sure to set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY
      if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          }),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      } else {
        // Option 3: Using application default credentials (for local development)
        console.log('⚠️  No Firebase credentials found. Firebase sync will be disabled.');
        console.log('📖 To enable Firebase sync:');
        console.log('   1. Download service account key from Firebase Console');
        console.log('   2. Save as firebase-service-account.json in backend folder');
        console.log('   3. Uncomment Option 1 in firebaseSync.js');
        return null;
      }

      db = admin.firestore();
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      db = admin.firestore();
    }

    return db;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    console.log('⚠️  Firebase sync will be disabled. App will continue without real-time sync.');
    return null;
  }
};

// Sync match data to Firestore
const syncMatchToFirebase = async (matchData) => {
  try {
    if (!db) {
      db = initializeFirebase();
      if (!db) {
        console.log('⚠️  Skipping Firebase sync - not configured');
        return;
      }
    }

    const matchRef = db.collection('liveMatches').doc(matchData._id.toString());
    
    // Convert mongoose document to plain object and add timestamp
    const matchObject = {
      ...matchData.toObject(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: matchData.createdAt || admin.firestore.FieldValue.serverTimestamp()
    };

    await matchRef.set(matchObject, { merge: true });
    console.log(`✅ Match ${matchData.matchName} synced to Firebase`);
  } catch (error) {
    console.error('❌ Error syncing match to Firebase:', error.message);
    // Don't throw error - let the API continue even if Firebase sync fails
  }
};

// Delete match from Firestore
const deleteMatchFromFirebase = async (matchId) => {
  try {
    if (!db) {
      db = initializeFirebase();
      if (!db) return;
    }

    await db.collection('liveMatches').doc(matchId.toString()).delete();
    console.log(`✅ Match ${matchId} deleted from Firebase`);
  } catch (error) {
    console.error('❌ Error deleting match from Firebase:', error.message);
  }
};

// Sync all matches to Firebase
const syncAllMatchesToFirebase = async (matches) => {
  try {
    if (!db) {
      db = initializeFirebase();
      if (!db) return;
    }

    const batch = db.batch();
    
    matches.forEach((match) => {
      const matchRef = db.collection('liveMatches').doc(match._id.toString());
      const matchObject = {
        ...match.toObject(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      batch.set(matchRef, matchObject, { merge: true });
    });

    await batch.commit();
    console.log(`✅ ${matches.length} matches synced to Firebase`);
  } catch (error) {
    console.error('❌ Error syncing all matches to Firebase:', error.message);
  }
};

module.exports = {
  initializeFirebase,
  syncMatchToFirebase,
  deleteMatchFromFirebase,
  syncAllMatchesToFirebase
};
