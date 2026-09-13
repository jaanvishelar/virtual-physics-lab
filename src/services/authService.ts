import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile } from '../types';

export interface RegisterStudentData {
  name: string;
  classGrade: string; // e.g. "Class 9", "Class 10", "Class 11", "Class 12"
  division: string;   // e.g. "A", "B", "C"
  email: string;
  password: string;
}

/**
 * Register a new Student.
 * NOTE: All public registrations are strictly set to role: 'student'.
 * Role selection is never permitted on the public registration form.
 */
export async function registerStudent(data: RegisterStudentData): Promise<UserProfile> {
  if (!auth || !db) {
    throw new Error('Firebase is not configured. Please add Firebase credentials to your environment variables.');
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email.trim(),
    data.password
  );

  const firebaseUser = userCredential.user;

  // Update Auth display name
  await updateProfile(firebaseUser, {
    displayName: data.name.trim(),
  });

  const studentProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: data.email.trim().toLowerCase(),
    displayName: data.name.trim(),
    classGrade: data.classGrade.trim(),
    division: data.division.trim().toUpperCase(),
    role: 'student', // Explicitly hardcoded to 'student'
    createdAt: new Date().toISOString(),
  };

  // Save student profile to Firestore
  await setDoc(doc(db, 'users', firebaseUser.uid), studentProfile);

  return studentProfile;
}

/**
 * Helper to ensure Firebase Auth token has propagated to the Firestore client
 */
async function waitForAuthState(user: FirebaseUser): Promise<void> {
  try {
    // 1. Force ID token generation to ensure fresh credentials
    await user.getIdToken();

    // 2. Await authStateReady if supported by Firebase Auth SDK (v9.16+/v10+)
    if (auth && typeof (auth as any).authStateReady === 'function') {
      await (auth as any).authStateReady();
    }

    // 3. Yield to JavaScript event loop to allow Firestore's internal token listener to register the credentials
    await new Promise((resolve) => setTimeout(resolve, 80));
  } catch (err) {
    console.warn('Waiting for auth state token warning:', err);
  }
}

/**
 * Log in an existing user (Student or Teacher)
 */
export async function loginUser(email: string, password: string): Promise<UserProfile> {
  if (!auth || !db) {
    throw new Error('Firebase is not configured. Please add Firebase credentials to your environment variables.');
  }

  // 1. Authenticate with Firebase Authentication
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  const firebaseUser = userCredential.user;

  // 2. Wait until Auth state and token are established before executing Firestore requests
  await waitForAuthState(firebaseUser);

  const userDocRef = doc(db, 'users', firebaseUser.uid);
  let userDocSnap = null;

  // 3. Attempt to fetch profile with retry in case auth propagation takes an additional tick
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      userDocSnap = await getDoc(userDocRef);
      break;
    } catch (err: any) {
      if (
        attempt < 2 &&
        (err?.code === 'permission-denied' ||
          err?.message?.includes('insufficient permissions'))
      ) {
        // Wait and retry once auth token propagation completes
        await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
        continue;
      }
      console.warn('User profile document lookup warning:', err);
      break;
    }
  }

  if (userDocSnap && userDocSnap.exists()) {
    return userDocSnap.data() as UserProfile;
  }

  // 4. Check if this account is provisioned in a separate 'teachers' collection
  try {
    const teacherDocRef = doc(db, 'teachers', firebaseUser.uid);
    const teacherDocSnap = await getDoc(teacherDocRef);
    if (teacherDocSnap.exists()) {
      const teacherData = teacherDocSnap.data();
      const teacherProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: teacherData.displayName || firebaseUser.displayName || 'Teacher',
        role: 'teacher',
        createdAt: teacherData.createdAt || new Date().toISOString(),
      };
      // Cache into users collection for consistent access
      try {
        await setDoc(userDocRef, teacherProfile, { merge: true });
      } catch (cacheErr) {
        console.warn('Could not cache teacher profile in users collection:', cacheErr);
      }
      return teacherProfile;
    }
  } catch (teacherErr) {
    console.warn('Teacher collection check skipped:', teacherErr);
  }

  // 5. Fallback profile if user was created directly in Firebase Auth console
  const fallbackProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || email,
    displayName: firebaseUser.displayName || email.split('@')[0] || 'Student',
    classGrade: 'Class 9',
    division: 'A',
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(userDocRef, fallbackProfile);
  } catch (persistErr) {
    console.warn('Could not persist fallback profile to Firestore:', persistErr);
  }

  return fallbackProfile;
}

/**
 * Update student's class and division in Firestore
 */
export async function updateStudentClassAndDivision(
  uid: string,
  classGrade: string,
  division: string
): Promise<UserProfile> {
  if (!db) {
    throw new Error('Database is not configured');
  }
  const userDocRef = doc(db, 'users', uid);
  const updates = {
    classGrade: classGrade.trim(),
    division: division.trim().toUpperCase(),
  };
  await setDoc(userDocRef, updates, { merge: true });
  const updatedSnap = await getDoc(userDocRef);
  return updatedSnap.data() as UserProfile;
}

/**
 * Log out the current user
 */
export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Fetch a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

/**
 * Fetch all registered students (Teacher access only)
 */
export async function getAllStudents(): Promise<UserProfile[]> {
  if (!db) return [];
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'student'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as UserProfile);
}

/**
 * Subscribe to Auth state changes
 */
export function subscribeToAuth(
  callback: (user: FirebaseUser | null, profile: UserProfile | null) => void
): () => void {
  if (!auth) {
    callback(null, null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const profile = await getUserProfile(firebaseUser.uid);
        callback(firebaseUser, profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        callback(firebaseUser, null);
      }
    } else {
      callback(null, null);
    }
  });
}
