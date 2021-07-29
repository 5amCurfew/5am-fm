const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const http = require('http').Server(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/song', (req, res) => {
    res.sendFile(__dirname + '/lib/song.mp3');
});

http.listen(PORT, () => {
  console.log(`5am-fm server running on http://localhost:${PORT}/`);
});