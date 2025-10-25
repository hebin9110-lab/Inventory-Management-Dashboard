// inventory-dashboard.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

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
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Inventory Dashboard</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; background: #f4f6f8; }
      h1 { color: #0043ce; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; }
      th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
      form { display: inline; }
      input[type="text"], input[type="number"] {
        padding: 6px;
        margin-right: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      button {
        padding: 6px 12px;
        background-color: #0043ce;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #002d9c;
      }
      .container {
        max-width: 800px;
        margin: auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Inventory Management Dashboard</h1>
      <table>
        <tr><th>ID</th><th>Name</th><th>Quantity</th><th>Actions</th></tr>
        ${inventory.map(item => `
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
              <form action="/delete/${item.id}" method="POST" onsubmit="return confirm('Delete ${item.name}?');">
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
    </div>
  </body>
  </html>
  `;
  res.send(html);
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

app.listen(PORT, () => {
  console.log(`Inventory Dashboard running at https://inventory-management-dashboard-0h2z.onrender.com`);
});