import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_SERVER); //backend url when deplyed

export default socket;
