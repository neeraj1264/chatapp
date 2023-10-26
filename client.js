let socket = io("wss://chatapp-henna-phi.vercel.app");
// let socket = io("http://localhost:3001");
let username;

var audio = new Audio('ring.mp3')

function setUsername() {
  let inputUsername = document.querySelector("#usernameInput").value;
  if (inputUsername) {
    // Capitalize the first character of the username
    username = inputUsername.charAt(0).toUpperCase() + inputUsername.slice(1);
    socket.emit("Set Username", username);
    document.querySelector("#setUsername").style.display = "none";
    document.querySelector(".header-container").style.display = "flex";
    document.querySelector("#chat").style.display = "block";
    document.querySelector("#messages").style.display = "block";
  }
}


document.querySelector("form").addEventListener("submit",function(e){
  e.preventDefault();
  let message = document.querySelector("#messageInput").value;
  // Check if the message is not empty before sending
  if (message.trim() !== '') {
    socket.emit("chat message", { username: username  , message: message });
    document.querySelector("#messageInput").value = "";
  }
  return false;
});

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  const formattedHours = hours % 12 || 12;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}
let currentDate = null;

socket.on("chat message",function(data){
  let messageContainer = document.createElement("div");
  messageContainer.classList.add("message");

  if (data.username === username) {
    messageContainer.classList.add("sent-message");
  } else {
    messageContainer.classList.add("received-message");
    audio.play();
  }

  let usernameDiv = document.createElement("div");
  usernameDiv.classList.add("username");
  let messageContent = document.createElement("div");
  messageContent.classList.add("messageContent");

  // Add the timestamp
  const timestamp = document.createElement("div");
  timestamp.classList.add("timestamp");
  timestamp.textContent = getCurrentTime();
  
  usernameDiv.innerHTML = data.username;
  messageContent.innerHTML = data.message;

  // Check if the date has changed and display it if it's a new day
  const messageDate = new Date().toLocaleDateString();
  if (currentDate !== messageDate) {
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date");
    dateDiv.textContent = messageDate;
    currentDate = messageDate; // Update currentDate
    messages.appendChild(dateDiv);
  }

  messageContainer.appendChild(usernameDiv);
  messageContainer.appendChild(messageContent);
  messageContainer.appendChild(timestamp);

  document.querySelector("#messages").appendChild(messageContainer);
  document.querySelector("#messages").scrollTop =document.querySelector("#messages").scrollHeight ;
});

socket.on("system message", function (message) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  messageContainer.classList.add("system-message");
  messageContainer.innerHTML = message;
  document.querySelector("#messages").appendChild(messageContainer);
});

socket.on("user disconnected", function (username) {
  let messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  messageContainer.classList.add("user-disconnected");

  let messageContent = document.createElement("div");
  messageContent.classList.add("messageContent");
  messageContent.innerHTML = `${username} disconnected`;

  messageContainer.appendChild(messageContent);
  document.querySelector("#messages").appendChild(messageContainer);
  document.querySelector("#messages").scrollTop = document.querySelector("#messages").scrollHeight;
});