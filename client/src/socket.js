import { SVC_ENDPOINTS } from "./consts/api";
import { io } from 'socket.io-client';

export const socket = io(SVC_ENDPOINTS.matching, {
  autoConnect: false
})