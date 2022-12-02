const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const leaveButton = document.getElementById("leave");
const nickNameForm = document.getElementById("nickNameForm");

room.hidden = true;

let roomName = "";

function setRoomTitle(roomName, count) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${count})`;
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNickNameSubmit(event) {
  event.preventDefault();
  const nicknameInput = document.querySelector("input#nickname");
  const value = nicknameInput.value;
  socket.emit("nickname", value, roomName);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function leaveRoom() {
  room.hidden = true;
  welcome.hidden = false;
  roomName = "";
}

function handleLeaveButton(event) {
  event.preventDefault();
  socket.emit("leave_room", roomName, leaveRoom);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomnameInput = document.querySelector("input#roomname");
  socket.emit("enter_room", roomnameInput.value, showRoom);
  roomName = roomnameInput.value;
  roomnameInput.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
leaveButton.addEventListener("click", handleLeaveButton);
nickNameForm.addEventListener("submit", handleNickNameSubmit);

socket.on("welcome", (user, newCount) => {
  setRoomTitle(roomName, newCount);
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
  setRoomTitle(roomName, newCount);
  addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");

  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
