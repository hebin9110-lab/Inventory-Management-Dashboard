// inventory-dashboard.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const path = require("path");
a


// In-memory inventory store
let inventory = [
  { id: 1, name: 'Laptop', quantity: 10 },
  { id: 2, name: 'Mouse', quantity: 50 },
  { id: 3, name: 'Keyboard', quantity: 30 }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home - Inventory Dashboard
app.get('/', (req, res) => {
  res.render('dashboard', { inventory });
});

// Add new item
app.post('/add', (req, res) => {
  const { name, quantity } = req.body;
  const newItem = {
    id: inventory.length ? inventory[inventory.length - 1].id + 1 : 1,
    name,
    quantity: parseInt(quantity)
  };
  inventory.push(newItem);
  res.redirect('/');
});

// Update item quantity
app.post('/update/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;
  const item = inventory.find(i => i.id === id);
  if (item) {
    item.quantity = parseInt(quantity);
  }
  res.redirect('/');
});

// Delete item
app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  inventory = inventory.filter(i => i.id !== id);
  res.redirect('/');
});

// EJS template (inline for simplicity)
app.engine('ejs', (filePath, options, callback) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Inventory Dashboard</title>
    <style>
      body { font-family: Arial; margin: 40px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
      form { display: inline; }
    </style>
  </head>
  <body>
    <h1>Inventory Management Dashboard</h1>
    <table>
      <tr><th>ID</th><th>Name</th><th>Quantity</th><th>Actions</th></tr>
      ${options.inventory.map(item => `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>
            <form action="/update/${item.id}" method="POST">
              <input type="number" name="quantity" value="${item.quantity}" min="0" required>
              <button type="submit">Update</button>
            </form>
          </td>
          <td>
            <form action="/delete/${item.id}" method="POST">
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>
      `).join('')}
    </table>
    <h2>Add New Item</h2>
    <form action="/add" method="POST">
      <input type="text" name="name" placeholder="Item name" required>
      <input type="number" name="quantity" placeholder="Quantity" min="0" required>
      <button type="submit">Add Item</button>
    </form>
  </body>
  </html>
  `;
  return callback(null, html);
});

app.listen(PORT, () => {
  console.log(`Inventory Dashboard running at https://inventory-management-dashboard-0h2z.onrender.com/`);
});