import openSocket from "socket.io-client";

let socket;

export default function connect(url, eventHandler) {
  socket = openSocket(url);

  socket.on("getTree", eventHandler.handleGetTree);

  socket.on("generateChildren", eventHandler.handleGenerateChildren);

  socket.on("changeFactoryName", eventHandler.handleChangeFactoryName);
}

export function emit(event, payload) {
  socket.emit(event, payload);
}
