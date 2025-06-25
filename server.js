const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

// Helper to read and write
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all items
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data.items);
});

// POST new item
app.post('/items', (req, res) => {
  const newItem = req.body;
  const data = readData();
  data.items.push(newItem);
  writeData(data);
  res.json({ message: 'Item added successfully' });
});

// PUT update item
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const data = readData();

  const index = data.items.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Item not found' });

  data.items[index] = { ...data.items[index], ...updatedItem };
  writeData(data);
  res.json({ message: 'Item updated successfully' });
});

// DELETE item
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();

  const filteredItems = data.items.filter(item => item.id !== id);
  if (filteredItems.length === data.items.length) {
    return res.status(404).json({ message: 'Item not found' });
  }

  data.items = filteredItems;
  writeData(data);
  res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
