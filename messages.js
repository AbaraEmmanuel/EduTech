// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBnzUWyfIDIlKtNsjlwHhA3JhR5LHhb9qU",
    authDomain: "edtech-tutors.firebaseapp.com",
    projectId: "edtech-tutors",
    storageBucket: "edtech-tutors.firebasestorage.app",
    messagingSenderId: "87645108821",
    appId: "1:87645108821:web:ff6957f6cb738dc2bcf2dc",
    measurementId: "G-GTXDL1WX0L"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentChatId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadChatList();
  } else {
    window.location.href = "tutors-sign_in.html";
  }
});

function loadChatList() {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("tutorId", "==", currentUser.uid), orderBy("lastMessageTime", "desc"));

  onSnapshot(q, (snapshot) => {
    const chatList = document.getElementById("chat-list");
    chatList.innerHTML = "";

    if (snapshot.empty) {
      chatList.innerHTML = "<p>No chats yet.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const chatDiv = document.createElement("div");
      chatDiv.className = "chat-item";
      chatDiv.innerHTML = `
        <strong>${data.studentName || "Student"}</strong>
        ${data.unreadCount ? `<span class="unread-badge">${data.unreadCount}</span>` : ""}
        <p>${data.lastMessage || ""}</p>
      `;
      chatDiv.onclick = () => openChat(doc.id, data.studentName);
      chatList.appendChild(chatDiv);
    });
  });
}

function openChat(chatId, name) {
  currentChatId = chatId;
  document.getElementById("chat-list-container").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
  document.getElementById("chat-title").innerText = name;

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp"));

  onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById("chat-messages");
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isMe = data.senderId === currentUser.uid;
      chatBox.innerHTML += `
        <div class="message ${isMe ? 'sent' : 'received'}">
          <strong>${isMe ? 'You' : data.senderName}:</strong> ${data.text}
        </div>
      `;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// Back button
document.getElementById("backBtn").onclick = () => {
  document.getElementById("chat-container").style.display = "none";
  document.getElementById("chat-list-container").style.display = "block";
};

// Send message
document.getElementById("sendBtn").onclick = async () => {
  const messageInput = document.getElementById("messageText");
  const messageText = messageInput.value.trim();
  if (messageText === "" || !currentChatId) return;

  await addDoc(collection(db, "chats", currentChatId, "messages"), {
    senderId: currentUser.uid,
    senderName: currentUser.displayName || "Tutor",
    text: messageText,
    timestamp: new Date()
  });

  messageInput.value = "";
};

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve saved theme from localStorage and apply it
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;

    // Update the toggle button icon based on the saved theme
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.textContent = savedTheme === 'dark-mode' ? '\u263D' : '\u2600'; // Unicode for moon and sun

    // Toggle theme and save preference to localStorage
    modeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.replace('light-mode', 'dark-mode');
            modeToggle.textContent = '\u263D'; // Unicode for crescent moon
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.replace('dark-mode', 'light-mode');
            modeToggle.textContent = '\u2600'; // Unicode for sun
            localStorage.setItem('theme', 'light-mode');
        }
    });
});
