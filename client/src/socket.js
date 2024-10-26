import { SVC_ENDPOINTS } from "./consts/api";
import { io } from 'socket.io-client';

export const matchingSocket = io(SVC_ENDPOINTS.matching, {
  autoConnect: false
})

export const collaborationSocket = io(SVC_ENDPOINTS.collaboration, {
  autoConnect: false
})