import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw2qCHvjgVhPu_P1HMz7djimyc5SgPyzA",
  authDomain: "sabor-premium-269e3.firebaseapp.com",
  projectId: "sabor-premium-269e3",
  storageBucket: "sabor-premium-269e3.firebasestorage.app",
  messagingSenderId: "985475813617",
  appId: "1:985475813617:web:cc12e658c231eb5f90d950"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveReview(review) {

  await addDoc(
    collection(db, "reviews"),
    {
      ...review,
      createdAt: serverTimestamp()
    }
  );

}

export async function saveReservation(reservation) {

  await addDoc(
    collection(db, "reservations"),
    {
      ...reservation,
      createdAt: serverTimestamp()
    }
  );

}

export function listenReviews(callback) {

  const q = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    const reviews = [];

    snapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });

    callback(reviews);

  });

}

export function listenReservations(callback) {

  const q = query(
    collection(db, "reservations"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    const reservations = [];

    snapshot.forEach(doc => {
      reservations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    callback(reservations);

  });

}

export async function deleteReview(id) {
  await deleteDoc(doc(db, "reviews", id));
}

export async function deleteReservation(id) {
  await deleteDoc(doc(db, "reservations", id));
}