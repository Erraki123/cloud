// ============================================
// app.js – Todo List connectée à Firebase
// TP Cloud Computing – Architecture Serverless
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Configuration Firebase (remplace par tes vraies valeurs)
const firebaseConfig = {
  apiKey: "AIzaSyAdhkEcQ1BwIu4LDE2SGJrbmbuh5Tcodqg",
  authDomain: "tp-cloud-m1-ef8aa.firebaseapp.com",
  projectId: "tp-cloud-m1-ef8aa",
  storageBucket: "tp-cloud-m1-ef8aa.firebasestorage.app",
  messagingSenderId: "195691546502",
  appId: "1:195691546502:web:08eec55178da7781148e07"
};

// 🔥 Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Référence à la collection "tasks"
const tasksRef = collection(db, "tasks");

// ✅ Ajouter une tâche
window.addTask = async function () {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  try {
    await addDoc(tasksRef, {
      text: text,
      createdAt: serverTimestamp()
    });
    input.value = "";
  } catch (error) {
    console.error("Erreur ajout:", error);
  }
};

// ⌨️ Ajouter avec la touche Entrée
document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") window.addTask();
});

// 🗑️ Supprimer une tâche
window.deleteTask = async function (id) {
  try {
    await deleteDoc(doc(db, "tasks", id));
  } catch (error) {
    console.error("Erreur suppression:", error);
  }
};

// 📡 Lecture en temps réel (onSnapshot)
const q = query(tasksRef, orderBy("createdAt", "asc"));

onSnapshot(q, (snapshot) => {
  const list = document.getElementById("taskList");
  const status = document.getElementById("status");

  list.innerHTML = "";

  if (snapshot.empty) {
    status.textContent = "✅ Connecté à Firebase – Aucune tâche pour l'instant.";
    return;
  }

  status.textContent = `✅ Connecté à Firebase – ${snapshot.size} tâche(s) en temps réel`;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${data.text}</span>
      <button class="delete-btn" onclick="deleteTask('${docSnap.id}')">🗑️</button>
    `;
    list.appendChild(li);
  });
});