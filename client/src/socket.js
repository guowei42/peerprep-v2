import { SVC_ENDPOINTS } from "./consts/api";
import { io } from "socket.io-client";

const isProduction =
  process.env.REACT_APP_API_BASE_URL &&
  process.env.REACT_APP_API_BASE_URL !== "http://localhost";

let settings = {
  autoConnect: false,
  reconnectionAttempts: 5,
};

export const matchingSocket = isProduction
  ? io(process.env.REACT_APP_API_BASE_URL, {
      path: "/matching",
      ...settings,
    })
  : io(SVC_ENDPOINTS.matching, {
      ...settings,
    });

export const collaborationSocket = isProduction
  ? io(process.env.REACT_APP_API_BASE_URL, {
      path: "/collaboration",
      ...settings,
    })
  : io(SVC_ENDPOINTS.collaboration, {
      ...settings,
    });

export const chatSocket = isProduction
  ? io(process.env.REACT_APP_API_BASE_URL, {
      path: "/chat",
      ...settings,
    })
  : io(SVC_ENDPOINTS.chat, {
      ...settings,
    });
