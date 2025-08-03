import { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../socket";

const ChatBox = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

useEffect(() => {
  const fetchMessages = async () => {
    if (!currentUser?._id || !selectedUser?._id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/${currentUser._id}/${selectedUser._id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  fetchMessages();
}, [selectedUser]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      if (data.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, { sender: data.senderId, message: data.message }]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      sender: currentUser._id,
      receiver: selectedUser._id,
      message: newMessage,
    };

    try {
        console.log("Sending message payload:", payload);
      await axios.post("https://chatnest-backend-xv6h.onrender.com/api/messages", payload);
      socket.emit("sendMessage", payload);
      setMessages((prev) => [...prev, payload]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1 h-100">
      {/* Header */}
      <div className="p-3 border-bottom">
        <h5>Chatting with {selectedUser.username}</h5>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3 bg-white">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              m.sender === currentUser._id ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                m.sender === currentUser._id ? "bg-success text-white" : "bg-light"
              }`}
              style={{ maxWidth: "60%" }}
            >
              {m.message}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-top d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={newMessage}
          placeholder="Type a message..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
