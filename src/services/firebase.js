// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4scYl20xlwUem_yAyNNwtiC6HYK5WVzI",
  authDomain: "music-world-app-a6196.firebaseapp.com",
  projectId: "music-world-app-a6196",
  storageBucket: "music-world-app-a6196.firebasestorage.app",
  messagingSenderId: "451292826496",
  appId: "1:451292826496:web:2479882e05ec176c270f65",
  measurementId: "G-7V636FEC15"
};

// Initialize Firebase
let app;
let analytics;
let db;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  db = getFirestore(app);
  console.log('🎉 Firebase & Firestore connected successfully!');
  console.log('Project: music-world-app-a6196');
} catch (error) {
  console.warn('❌ Firebase initialization failed:', error.message);
}

// Contact form submission
export const submitContactForm = async (formData) => {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    console.log('📝 Submitting contact form to Firestore...');
    
    const docRef = await addDoc(collection(db, 'contacts'), {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      timestamp: new Date(),
      status: 'new'
    });
    
    console.log('✅ Contact form submitted to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('❌ Firestore submission error:', error);
    
    // Fallback to localStorage
    console.log('🔄 Using localStorage fallback...');
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const newSubmission = {
      id: 'local-' + Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'new',
      source: 'localStorage'
    };
    
    submissions.push(newSubmission);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    console.log('✅ Form data saved to localStorage');
    return { success: true, id: newSubmission.id, fallback: true };
  }
};

// Newsletter subscription
export const subscribeToNewsletter = async (email) => {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    console.log('📧 Subscribing to newsletter...');
    
    const docRef = await addDoc(collection(db, 'newsletter'), {
      email: email,
      timestamp: new Date(),
      active: true
    });
    
    console.log('✅ Newsletter subscription added:', docRef.id);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    
    // localStorage fallback
    console.log('🔄 Using localStorage fallback for newsletter...');
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    subscribers.push({
      email: email,
      timestamp: new Date().toISOString(),
      active: true,
      source: 'localStorage'
    });
    
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    return { success: true, fallback: true };
  }
};

// Get all contact submissions
export const getContactSubmissions = async () => {
  try {
    if (!db) {
      console.log('🔄 Firestore not available, using localStorage...');
      return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    }

    console.log('📋 Fetching submissions from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'contacts'));
    const submissions = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ Found ${submissions.length} submissions in Firestore`);
    return submissions;
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
  }
};

export { db, analytics };