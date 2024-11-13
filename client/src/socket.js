import { SVC_ENDPOINTS } from "./consts/api";
import { io } from "socket.io-client";

const isProduction =
  process.env.REACT_APP_API_BASE_URL &&
  process.env.REACT_APP_API_BASE_URL !== "http://localhost";

export const matchingSocket = isProduction
  ? io(process.env.REACT_APP_API_BASE_URL, {
      path: "/matching",
      autoConnect: false,
    })
  : io(SVC_ENDPOINTS.matching, {
      autoConnect: false,
    });

export const collaborationSocket = isProduction
  ? io(process.env.REACT_APP_API_BASE_URL, {
      path: "/collaboration",
      autoConnect: false,
    })
  : io(SVC_ENDPOINTS.collaboration, {
      autoConnect: false,
    });

export const chatSocket = isProduction
  ? io(process.env.REACT_APP_API_BASE_URL, {
      path: "/chat",
      autoConnect: false,
    })
  : io(SVC_ENDPOINTS.chat, {
      autoConnect: false,
    });
