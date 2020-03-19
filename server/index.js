const express = require('express');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 5000;
const EDITAIS_FOLDER = __dirname + '/editais';

app.get('/editais', async (_, res) => {
  const editais = fs.readdirSync(EDITAIS_FOLDER);
  res.send(editais);
});

app.use(express.static('build'));

app.listen(port, () => console.log(`proxy listening on port ${port}!`));
