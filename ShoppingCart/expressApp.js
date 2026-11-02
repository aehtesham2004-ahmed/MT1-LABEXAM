import express from 'express';

const PORT = 4000;
const app = express();

app.use(express.json({ limit: '100kb' }));

const cart = [
  { id: 1, productName: 'Wireless Mouse', price: 799, quantity: 2, category: 'Electronics' },
  { id: 2, productName: 'Notebook', price: 120, quantity: 3, category: 'Stationery' },
  { id: 3, productName: 'Desk Lamp', price: 999, quantity: 1, category: 'Home' },
];

function presentProduct(product) {
  return { ...product, totalPrice: product.price * product.quantity };
}

function validateProduct(product, { requireId = false } = {}) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return 'The request body must be a JSON object.';
  }
  if (requireId && (product.id === undefined || product.id === null || String(product.id).trim() === '')) {
    return 'id is required.';
  }
  if (requireId && (typeof product.category !== 'string' || product.category.trim() === '')) {
    return 'category must be a non-empty string.';
  }
  if (product.productName !== undefined && (typeof product.productName !== 'string' || product.productName.trim() === '')) {
    return 'productName must be a non-empty string.';
  }
  if (product.price !== undefined && (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0)) {
    return 'price must be a non-negative number.';
  }
  if (product.quantity !== undefined && (!Number.isInteger(product.quantity) || product.quantity < 1)) {
    return 'quantity must be a positive integer.';
  }
  if (product.category !== undefined && (typeof product.category !== 'string' || product.category.trim() === '')) {
    return 'category must be a non-empty string.';
  }
  if (requireId && (!Number.isInteger(Number(product.id)) || Number(product.id) < 1)) {
    return 'id must be a positive integer.';
  }
  return null;
}

function findProductIndex(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return -1;
  return cart.findIndex((product) => product.id === numericId);
}

app.get('/cart', (request, response) => {
  response.json({ items: cart.map(presentProduct) });
});

app.get('/cart/:id', (request, response) => {
  const product = cart[findProductIndex(request.params.id)];
  if (!product) {
    return response.status(404).json({ error: 'Product not found.' });
  }
  return response.json({ product: presentProduct(product) });
});

app.post('/cart', (request, response) => {
  const validationMessage = validateProduct(request.body, { requireId: true });
  if (validationMessage) {
    return response.status(400).json({ error: validationMessage });
  }

  const newProduct = {
    id: Number(request.body.id),
    productName: request.body.productName.trim(),
    price: request.body.price,
    quantity: request.body.quantity,
    category: request.body.category.trim(),
  };
  if (cart.some((product) => product.id === newProduct.id)) {
    return response.status(409).json({ error: 'A product with this id already exists.' });
  }

  cart.push(newProduct);
  return response.status(201).json({ message: 'Product added successfully', product: presentProduct(newProduct) });
});

app.put('/cart/:id', (request, response) => {
  const index = findProductIndex(request.params.id);
  if (index === -1) {
    return response.status(404).json({ error: 'Product not found.' });
  }

  const updates = request.body;
  const validationMessage = validateProduct(updates);
  if (validationMessage) {
    return response.status(400).json({ error: validationMessage });
  }
  if (!['productName', 'price', 'quantity', 'category'].some((field) => updates[field] !== undefined)) {
    return response.status(400).json({ error: 'Provide at least one product field to update.' });
  }

  const currentProduct = cart[index];
  const updatedProduct = {
    ...currentProduct,
    ...(updates.productName !== undefined ? { productName: updates.productName.trim() } : {}),
    ...(updates.price !== undefined ? { price: updates.price } : {}),
    ...(updates.quantity !== undefined ? { quantity: updates.quantity } : {}),
    ...(updates.category !== undefined ? { category: updates.category.trim() } : {}),
  };
  cart[index] = updatedProduct;
  return response.json({ message: 'Product updated successfully', product: presentProduct(updatedProduct) });
});

app.delete('/cart/:id', (request, response) => {
  const index = findProductIndex(request.params.id);
  if (index === -1) {
    return response.status(404).json({ error: 'Product not found.' });
  }

  const [removedProduct] = cart.splice(index, 1);
  return response.json({ message: 'Product removed successfully', product: presentProduct(removedProduct) });
});

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: 'Request body must contain valid JSON.' });
  }
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body is too large.' });
  }
  return response.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.use((request, response) => {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
