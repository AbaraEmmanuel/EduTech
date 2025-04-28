import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBnzUWyfIDIlKtNsjlwHhA3JhR5LHhb9qU",
    authDomain: "edtech-tutors.firebaseapp.com",
    projectId: "edtech-tutors",
    storageBucket: "edtech-tutors.appspot.com",
    messagingSenderId: "87645108821",
    appId: "1:87645108821:web:ff6957f6cb738dc2bcf2dc",
    measurementId: "G-GTXDL1WX0L"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Assume currentUser (tutor) is already authenticated and available
const currentUser = {
  uid: "IPErXUGI30QnZoSDxhgvYo1g6kr2" // Replace with actual tutor UID logic
};

console.log("[AUTH] Tutor UID:", currentUser.uid);

async function loadChats() {
  console.log("[DEBUG] Firestore Inspection");
  const chatsSnapshot = await getDocs(collection(db, "chats"));
  console.log("[DEBUG] Total chats:", chatsSnapshot.size);

  let chatCount = 0;

  chatsSnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    console.log("[DEBUG] Chat:", docSnap.id);
    console.log("[DEBUG] Data:", data);

    if (data.sender === currentUser.uid || data.receiver === currentUser.uid) {
      console.log("[LOAD] Found chat with tutor:", docSnap.id);
      chatCount++;

      const chatList = document.getElementById("chat-list");
      const chatItem = document.createElement("div");
      chatItem.className = "chat-item";
      chatItem.innerHTML = `
        <p><strong>Chat ID:</strong> ${docSnap.id}</p>
        <p><strong>Last Message:</strong> ${data.lastMessage}</p>
        <a href="http://localhost:8000/tutor_chat.html?userId=${data.sender === currentUser.uid ? data.receiver : data.sender}&userName=Student" target="_blank">Open Chat</a>
        <p><strong>Sender:</strong> ${data.sender}</p>
        <p><strong>Receiver:</strong> ${data.receiver}</p> 
      `;
      chatList.appendChild(chatItem);
    }
  });

  if (chatCount === 0) {
    showNoChatsUI();
  }
}

function showNoChatsUI() {
  const chatList = document.getElementById("chat-list");
  chatList.innerHTML = `
    <div class="empty-state">
      <p>No chats yet.</p>
      <p>Students will appear here when they message you.</p>
      <p>Test chat: 
        <a href="http://localhost:8000/chat.html?tutorId=${currentUser.uid}&tutorName=Tutor" target="_blank">
          Start a test chat
        </a>
      </p>
      <button onclick="loadChats()" class="debug-btn">Debug Firestore</button>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", loadChats);
document.addEventListener("DOMContentLoaded", () => {
  const chatList = document.getElementById("chat-list");
  chatList.innerHTML = ""; // Clear the chat list on load
});
// Function to show notification