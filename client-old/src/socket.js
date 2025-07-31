import { io } from "socket.io-client";

const settings = {
  autoConnect: false,
  transports: ["websocket"],
};

export const matchingSocket = io(process.env.REACT_APP_API_BASE_URL, {
  path: "/matching",
  ...settings,
});

export const collaborationSocket = io(process.env.REACT_APP_API_BASE_URL, {
  path: "/collaboration",
  ...settings,
});

export const chatSocket = io(process.env.REACT_APP_API_BASE_URL, {
  path: "/chat",
  ...settings,
});
