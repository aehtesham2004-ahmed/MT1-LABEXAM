import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory array for Part A
let cartItems = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1299,
    quantity: 1,
    category: "Electronics",
  },
];

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // A1 & A2: Routing and Methods
  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to the Shopping Cart HTTP Server</h1>");
  } else if (req.method === "GET" && pathname === "/cart") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cartItems));
  } else if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        application: "Shopping Cart Management Web Application",
        description: "Built using Node.js HTTP and FS modules for Part A.",
      }),
    );
  } else if (req.method === "GET" && pathname === "/home") {
    // A4: Static File Serving Using FS Module
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error: File not found");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && pathname === "/add-to-cart") {
    // A3 & A5: Accept product details and validate required fields
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const newProduct = JSON.parse(body);
        const { id, productName, price, quantity } = newProduct;

        // Validation check for required fields
        if (
          !id ||
          !productName ||
          price === undefined ||
          quantity === undefined
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error:
                "Validation failed: Required fields are id, productName, price, and quantity.",
            }),
          );
          return;
        }

        cartItems.push(newProduct);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: newProduct,
          }),
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
  } else {
    // A5: Error Handling for invalid routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "404 Not Found: Route does not exist" }));
  }
});

// A1: Configure server to listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
