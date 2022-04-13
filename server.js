#! /c/Progra~1/nodejs/node
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

app.post('/join', async (req, res) => {
  const { characterId, characterName } = req.body;
  const token = serverSideClient.createToken(characterId);

  try {
    await serverSideClient.upsertUser({ id: characterId, name: characterName }, token);
  } catch (err) {
    console.log(err);
  }

  const channel = serverSideClient.channel('team', 'dicerollerchatchannel', { name: 'Dice Roller Channel' });

  try {
    await channel.create();
    await channel.addMembers([characterId]);
  } catch (err) {
    console.log(err);
  }

  return res.status(200).json({ token, api_key: process.env.STREAM_API_KEY });
});

app.post('/delete-message', async (req, res) => {
  const { messageId } = req.body;

  try {
    serverSideClient.deleteMessage(messageId, true);
  } catch (err) {
    console.log(err);
  }

  return res.status(200).json(null);
});

const server = app.listen(5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});