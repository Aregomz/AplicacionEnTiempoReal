import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './components/Chat';

function App() {
  const [votes, setVotes] = useState(0);

  const fetchVotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/votes');
      setVotes(response.data.votes);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleVote = async () => {
    try {
      await axios.post('http://localhost:5000/api/vote');
      fetchVotes();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchVotes, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="voting-section">
        <h1>SISTEMA DE VOTACION SHORT POLLING</h1>
        <p>TOTAL DE VOTOS: {votes}</p>
        <button onClick={handleVote}>VOTAR</button>
      </div>
      <div className="chat-section">
        <Chat />
      </div>
    </div>
  );
}

export default App;
