import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Si el mensaje proviene del servidor (administrador)
      if (message.sender === 'admin') {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        // Si el mensaje proviene de un usuario
        setMessages((prevMessages) => [...prevMessages, { text: message.text, sender: 'user' }]);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      ws.send(JSON.stringify({ text: newMessage, sender: 'admin' }));
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'admin' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={newMessage} onChange={handleMessageChange} placeholder="Escribe tu mensaje..." />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
