    import { io } from "socket.io-client";

    const socket = io(import.meta.env.VITE_SOCKET_SERVER); 

    export default socket;
