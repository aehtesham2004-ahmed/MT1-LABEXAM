import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3000;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const homePagePath = path.join(currentDirectory, 'public', 'index.html');

const cart = [
  { id: 1, productName: 'Wireless Mouse', price: 799, quantity: 2 },
  { id: 2, productName: 'Notebook', price: 120, quantity: 3 },
  { id: 3, productName: 'Desk Lamp', price: 999, quantity: 1 },
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Request body must contain valid JSON.'));
      }
    });
    request.on('error', reject);
  });
}

function validateProduct(product) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return 'The request body must be a JSON object.';
  }

  if (product.id === undefined || product.id === null || String(product.id).trim() === '') {
    return 'id is required.';
  }
  if (typeof product.productName !== 'string' || product.productName.trim() === '') {
    return 'productName must be a non-empty string.';
  }
  if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0) {
    return 'price must be a non-negative number.';
  }
  if (!Number.isInteger(product.quantity) || product.quantity < 1) {
    return 'quantity must be a positive integer.';
  }

  return null;
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const { pathname } = requestUrl;

  if (request.method === 'GET' && pathname === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shopping Cart | HTTP Server</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:760px;margin:10vh auto;padding:0 24px;color:#172033;background:#f4f7fb}main{background:white;border:1px solid #dce4ef;border-radius:18px;padding:36px;box-shadow:0 16px 40px #17203312}h1{margin-top:0}a{color:#2257c7}li{margin:8px 0}.tag{color:#53627a}</style></head><body><main><p class="tag">NODE.JS HTTP MODULE · PORT 3000</p><h1>Shopping cart server</h1><p>Welcome! This server uses Node's built-in HTTP and FS modules.</p><ul><li><a href="/cart">GET /cart</a> — view cart items as JSON</li><li><a href="/about">GET /about</a> — application information</li><li><a href="/home">GET /home</a> — serve the static home page with FS</li></ul><p>POST product JSON to <code>/add-to-cart</code>.</p></main></body></html>`);
    return;
  }

  if (request.method === 'GET' && pathname === '/cart') {
    sendJson(response, 200, { items: cart });
    return;
  }

  if (request.method === 'POST' && pathname === '/add-to-cart') {
    try {
      const product = await readJsonBody(request);
      const validationMessage = validateProduct(product);
      if (validationMessage) {
        sendJson(response, 400, { error: validationMessage });
        return;
      }
      if (cart.some((item) => String(item.id) === String(product.id))) {
        sendJson(response, 409, { error: 'A product with this id already exists.' });
        return;
      }

      const newProduct = {
        id: product.id,
        productName: product.productName.trim(),
        price: product.price,
        quantity: product.quantity,
        ...(typeof product.category === 'string' && product.category.trim()
          ? { category: product.category.trim() }
          : {}),
      };
      cart.push(newProduct);
      sendJson(response, 201, { message: 'Product added to cart successfully.', product: newProduct });
    } catch (error) {
      if (!response.headersSent && !response.destroyed) {
        sendJson(response, 400, { error: error.message });
      }
    }
    return;
  }

  if (request.method === 'GET' && pathname === '/about') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>About | Shopping Cart</title></head><body><h1>About this application</h1><p>A simple in-memory shopping cart demonstrating Node.js HTTP routing, JSON requests, and static file serving with the FS module.</p><p><a href="/">Back to welcome page</a></p></body></html>');
    return;
  }

  if (request.method === 'GET' && pathname === '/home') {
    fs.readFile(homePagePath, 'utf8', (error, html) => {
      if (error) {
        sendJson(response, 500, { error: 'The home page could not be read.' });
        return;
      }
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(html);
    });
    return;
  }

  sendJson(response, 404, { error: `Route not found: ${request.method} ${pathname}` });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
