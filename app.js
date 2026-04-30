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

const firebaseConfig = {
  apiKey: "AIzaSyAdhkEcQ1BwIu4LDE2SGJrbmbuh5Tcodqg",
  authDomain: "tp-cloud-m1-ef8aa.firebaseapp.com",
  projectId: "tp-cloud-m1-ef8aa",
  storageBucket: "tp-cloud-m1-ef8aa.firebasestorage.app",
  messagingSenderId: "195691546502",
  appId: "1:195691546502:web:08eec55178da7781148e07"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const inscritsRef = collection(db, "inscrits");

// ✅ Soumettre le formulaire
window.submitForm = async function () {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const ville = document.getElementById("ville").value.trim();
  const msg = document.getElementById("msg");

  if (!nom || !prenom || !ville) {
    msg.style.color = "#e53935";
    msg.textContent = "⚠️ Veuillez remplir tous les champs.";
    return;
  }

  try {
    await addDoc(inscritsRef, { nom, prenom, ville, createdAt: serverTimestamp() });
    document.getElementById("nom").value = "";
    document.getElementById("prenom").value = "";
    document.getElementById("ville").value = "";
    msg.style.color = "#2e7d32";
    msg.textContent = "✅ Inscription enregistrée !";
    setTimeout(() => msg.textContent = "", 3000);
  } catch (e) {
    msg.style.color = "#e53935";
    msg.textContent = "❌ Erreur: " + e.message;
  }
};

// 🗑️ Supprimer
window.deleteEntry = async function (id) {
  await deleteDoc(doc(db, "inscrits", id));
};

// 📡 Lecture temps réel
const q = query(inscritsRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  const liste = document.getElementById("liste");
  const status = document.getElementById("status");
  liste.innerHTML = "";

  if (snapshot.empty) {
    status.textContent = "✅ Connecté – Aucune inscription pour l'instant.";
    return;
  }

  status.textContent = `✅ Connecté – ${snapshot.size} inscription(s) en temps réel`;

  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="name">👤 ${d.nom} ${d.prenom}</div>
        <div class="ville">📍 ${d.ville}</div>
      </div>
      <button class="del" onclick="deleteEntry('${docSnap.id}')">🗑️</button>
    `;
    liste.appendChild(card);
  });
});