import express from "express";

const app = express();

// B1: Configure middleware to parse incoming JSON requests
app.use(express.json());

// B1 & B3: Initialize array containing at least three sample shopping cart items
let cart = [
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
  {
    id: 3,
    productName: "USB-C Hub",
    price: 1599,
    quantity: 1,
    category: "Electronics",
  },
];

// B2 & B4: GET /cart - Retrieve all cart items with calculated item totals
app.get("/cart", (req, res) => {
  const detailedCart = cart.map((item) => ({
    ...item,
    totalPrice: item.price * item.quantity,
  }));
  res.status(200).json(detailedCart);
});

// B2 & B4: GET /cart/:id - Retrieve a cart item by ID
app.get("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = cart.find((p) => p.id === itemId);

  if (!item) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json({
    ...item,
    totalPrice: item.price * item.quantity,
  });
});

// B2 & B4: POST /cart - Add a new product to the cart (Status code 201)
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (!id || !productName || price === undefined || quantity === undefined) {
    return res
      .status(400)
      .json({
        error: "Missing required fields (id, productName, price, quantity)",
      });
  }

  const newProduct = {
    id,
    productName,
    price,
    quantity,
    category: category || "General",
  };
  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: {
      ...newProduct,
      totalPrice: newProduct.price * newProduct.quantity,
    },
  });
});

// B2 & B4: PUT /cart/:id - Update product details
app.put("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = cart.findIndex((p) => p.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { productName, price, quantity, category } = req.body;

  cart[itemIndex] = {
    id: itemId,
    productName:
      productName !== undefined ? productName : cart[itemIndex].productName,
    price: price !== undefined ? price : cart[itemIndex].price,
    quantity: quantity !== undefined ? quantity : cart[itemIndex].quantity,
    category: category !== undefined ? category : cart[itemIndex].category,
  };

  res.status(200).json({
    message: "Product updated successfully",
    product: {
      ...cart[itemIndex],
      totalPrice: cart[itemIndex].price * cart[itemIndex].quantity,
    },
  });
});

// B2 & B4: DELETE /cart/:id - Remove a product from the cart
app.delete("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = cart.findIndex((p) => p.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deletedProduct = cart.splice(itemIndex, 1)[0];

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// B1: Configure application to listen on port 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
