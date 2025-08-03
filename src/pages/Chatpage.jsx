import { useState, useEffect } from "react";
import ChatBox from "../components/Chatbox";
import Sidebar from "../components/Sidebar";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // Check if it's wrapped as res.data.user
        const rawUser = parsed.user || parsed;

        const user = {
          ...rawUser,
          _id: rawUser.id, // attach _id for Mongo-based logic
        };

        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user");
        window.location.href = "/register";
      }
    } else {
      window.location.href = "/register";
    }
  }, []);

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {currentUser && (
          <>
            <Sidebar
              currentUser={currentUser}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
            <div className="col-9 p-0 d-flex flex-column">
              {selectedUser ? (
                <ChatBox
                  currentUser={currentUser}
                  selectedUser={selectedUser}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                  Select a user to start chatting
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
