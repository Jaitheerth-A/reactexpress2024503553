const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'data', 'inventory.json');

const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const writeData = (data) =>
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

app.get('/api/products', (req, res) => {
  const data = readData();
  const { q } = req.query;
  const results = q
    ? data.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      )
    : data;

  res.json(results);
});

app.post('/api/products', (req, res) => {
  const data = readData();
  const stockInput = Number(req.body.stock);

  if (stockInput < 0) {
    return res.status(400).json({ error: "Stock cannot be negative" });
  }

  const newId =
    data.length > 0
      ? Math.max(...data.map(p => p.id)) + 1
      : 1;

  const newProduct = {
    id: newId,
    name: req.body.name,
    stock: stockInput
  };

  data.push(newProduct);
  writeData(data);

  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  let data = readData();
  const id = parseInt(req.params.id);

  const index = data.findIndex(p => p.id === id);

  if (index !== -1) {
    if (data[index].stock > 1) {
      data[index].stock -= 1;
    } else {
      data.splice(index, 1);
    }

    writeData(data);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);