let currentUser;
const socket = io();

socket.emit("newUser", {});

const chatIcon = document.querySelector(".chat-icon");
const chatContainer = document.querySelector(".chat-container");
const minimizeButton = document.querySelector(".minimize-button");
const sendMessage = document.querySelector(".send-button");
const message = document.getElementById("message");
const chatMessages = document.querySelector(".chat-messages");
const actions = document.getElementById("actions");

chatIcon.addEventListener("click", () => {
  chatContainer.style.display = "block";
  chatIcon.style.display = "none";
  socket.emit("chat:open");
});

minimizeButton.addEventListener("click", () => {
  chatContainer.style.display = "none";
  chatIcon.style.display = "block";
});

sendMessage.addEventListener("click", () => {
  socket.emit("chat:message", {
    message: message.value,
  });
  message.value = "";
});

socket.on("currentUser", (user) => {
  if (!currentUser) currentUser = user;
});

socket.on("userCount", (data) => {
  const $usersCount = document.querySelectorAll(".userCount");
  $usersCount.forEach((userCount) => (userCount.innerHTML = `(${data}) <i class="fa-solid fa-user"></i>`));
});

function formatDate(date) {
  const newDate = new Date(date);
  const hour = newDate.getHours();
  const ampm = hour > 12 ? 'p.m' : 'a.m'
  const minutes = newDate.getMinutes();
  return `${hour}:${minutes} ${ampm}`;
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

socket.on("messages", (data) => {
  actions.innerHTML = ``;
  chatMessages.innerHTML = "";
  const chatRender = data
    .map((msg) => {
      return `
      <div class="message ${
        msg.user._id == currentUser._id
          ? "justify-content-end"
          : "justify-content-start"
      }">
        <small style="font-size: 10px;">
            ${msg.user.firstName} ${msg.user.lastName}
        </small>
        <div>
            <div class=${msg.user._id == currentUser._id ? "sender" : "other"}>
                <div class="text-message">${msg.message}</div>
                <div class="date-message">${formatDate(msg.date)}</div>
            </div>
        </div>
      </div>
      `;
    })
    .join(" ");
  chatMessages.innerHTML = chatRender;
  scrollToBottom()
});

message.addEventListener("keypress", () => {
  socket.emit("chat:typing", {});
});

socket.on("chat:typing", (data) => {
  actions.innerHTML = `<p><en>Alguien está escribiendo...</en></p>`;
});
