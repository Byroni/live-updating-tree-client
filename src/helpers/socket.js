import openSocket from "socket.io-client";

let socket;

export default function connect(url, eventHandler) {
  socket = openSocket(url);

  socket.on("getTree", eventHandler.handleGetTree);

  socket.on("onError", eventHandler.handleError);

  socket.on("unlockGenerateButton", eventHandler.handleUnlockGenerateButton);
}

export function emit(event, payload) {
  socket.emit(event, payload);
}
