const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
  origin: 'http://localhost:3000', // Actualiza con la URL de tu cliente
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

let votes = 0;

app.get('/api/votes', (req, res) => {
  res.json({ votes });
});

app.post('/api/vote', (req, res) => {
  votes++;
  broadcastVotes(); // Envía actualización a todos los clientes
  res.json({ success: true });
});

const broadcastVotes = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'votes', data: votes }));
    }
  });
};

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
