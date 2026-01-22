import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatDashboard.css";
import { useNavigate } from "react-router-dom";

const ChatDashboard = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // ✅ use env variable

  // Fetch current logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/checkAuth`, {
          withCredentials: true,
        });
        setCurrentUserId(res.data.user.id);
      } catch (err) {
        console.error("Auth error:", err);
        navigate("/login");
      }
    };
    fetchCurrentUser();
  }, []);

  // Logout
  const Logout = async () => {
    try {
      await axios.delete(`${backendUrl}/logout`, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Fetch chat users
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/chat-history-users`, { withCredentials: true });
        setUserList(res.data.users || []);
      } catch (err) {
        console.error("Error fetching chat users:", err);
      }
    };
    fetchChatUsers();
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/getMessage/${selectedUser._id}`, {
          withCredentials: true,
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Search users
  useEffect(() => {
    if (searchKey.length < 3) {
      setSearchResults([]);
      return;
    }
    const fetchSearch = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user-search/${searchKey}`, {
          withCredentials: true,
        });
        setSearchResults(res.data.users || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    };
    fetchSearch();
  }, [searchKey]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      await axios.post(
        `${backendUrl}/sendMessage`,
        { receiverId: selectedUser._id, receiverName: selectedUser.name, message: newMessage },
        { withCredentials: true }
      );

      setMessages((prev) => [
        ...prev,
        { senderId: currentUserId, senderName: "You", receiverId: selectedUser._id, receiverName: selectedUser.name, message: newMessage },
      ]);

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-dashboard">
      <header className="chat-header">
        <div className="username">Welcome</div>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search users..."
            className="search-bar"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    setSearchKey("");
                    setSearchResults([]);
                  }}
                >
                  <div className="avatar">{user.name.charAt(0)}</div>
                  <span className="user-name">{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="logout-btn" onClick={Logout}>Logout</button>
      </header>

      <div className="chat-body">
        <aside className="chat-sidebar">
          <ul>
            {userList.map((user) => (
              <li
                key={user._id}
                className={selectedUser?._id === user._id ? "active" : ""}
                onClick={() => setSelectedUser(user)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </aside>

        <main className="chat-main">
          {selectedUser && <div className="chat-topbar">{selectedUser.name}</div>}

          <div className="chat-history">
            {selectedUser ? (
              messages.map((msg, idx) => {
                const isSent = msg.senderId === currentUserId;
                return (
                  <div key={idx} className={`message ${isSent ? "sent" : "received"}`}>
                    {msg.message}
                  </div>
                );
              })
            ) : (
              <p className="no-chat">Select a user to start chatting</p>
            )}
          </div>

          {selectedUser && (
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          )}
        </main>
      </div>

      <footer className="footer-text">Developed By HARENDRA BHATI</footer>
    </div>
  );
};

export default ChatDashboard;
