// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyBMAZdqFhpEHLBkh9CiwgimEyyy5vIzpWI",
	authDomain: "fir-chat-7b237.firebaseapp.com",
	databaseURL: "https://fir-chat-7b237-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "fir-chat-7b237",
	storageBucket: "fir-chat-7b237.appspot.com",
	messagingSenderId: "871132674840",
	appId: "1:871132674840:web:2ae2287e32d902bcc2bc6d"
};

//const firebaseConfig = {
//  apiKey: "AIzaSyDSXDrhFMMb2cMR7b4s8T0asLnBZfZzpZo",
//  authDomain: "portfolio-6c5b9.firebaseapp.com",
//  databaseURL: "https://portfolio-6c5b9-default-rtdb.asia-southeast1.firebasedatabase.app",
//  projectId: "portfolio-6c5b9",
//  storageBucket: "portfolio-6c5b9.appspot.com",
//  messagingSenderId: "1017848547449",
//  appId: "1:1017848547449:web:2f46be01ed0154bc6deca8",
//  measurementId: "G-CY59RZCLBM"
//};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app) 
