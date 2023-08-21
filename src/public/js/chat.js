const socket = io();

// Obtener elementos del DOM
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("modalBtn");
const container = document.getElementById("container");
const sendMessage = document.getElementById("sendMessage");
const message = document.getElementById("message");
const input = document.getElementById("name");
const output = document.getElementById("output");
const actions = document.getElementById("actions");
const userConnect = document.getElementById("user-connect");
const main = document.getElementById("main");

let user = null;

if (!user) {
  modal.style.display = "block";
}

// Abrir el modal
modalBtn.addEventListener("click", () => {
  user = input.value;
  const $error = document.getElementById("error");
  if (user) {
    $error.classList.add("d-none");
    container.classList.remove("d-none");
    modal.style.display = "none";
    main.innerHTML = user;
    socket.emit("newUser", user);
  } else {
    $error.classList.remove("d-none");
  }
});

sendMessage.addEventListener("click", () => {
  socket.emit("chat:message", {
    user,
    message: message.value,
  });
  message.value = "";
});

socket.on("messages", (data) => {
  actions.innerHTML = "";
  const chatRender = data
    .map((msg) => {
      return `<p><strong>${msg.user}</strong>: ${msg.message}</p>`;
    })
    .join(" ");
  output.innerHTML = chatRender;
});

socket.on("newUser", (user) => {
  userConnect.innerHTML += `<li>${user}</li>`;
});

message.addEventListener("keypress", () => {
  socket.emit("chat:typing", user);
});

socket.on("chat:typing", (data) => {
  actions.innerHTML = `<p><en>${data} esta escribiendo un mensaje...</en></p>`;
});
