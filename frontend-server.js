const express = require('express');
const path = require('path');
const app = express();

const PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));

// Always serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}/`);
});
