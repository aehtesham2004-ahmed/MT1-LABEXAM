# MT1 Lab Examination — Shopping Cart

A small full stack lab project demonstrating Node.js routing, the built-in HTTP and FS modules, and an Express REST API. Both servers keep their cart data in a JavaScript array, so data resets when a server restarts.

## Requirements

- Node.js 18 or newer
- npm

## Setup

From this project directory, install Express:

```sh
npm install
```

## Run the native HTTP server

```sh
npm run start:http
```

Open `http://localhost:3000/`. The server also provides `GET /cart`, `GET /about`, and `GET /home`. The `/home` route reads `public/index.html` with Node's FS module.

To add an item, send `POST http://localhost:3000/add-to-cart` with `Content-Type: application/json`:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1
}
```

## Run the Express REST API

Open a second terminal and run:

```sh
npm run start:express
```

The API listens at `http://localhost:4000` and provides:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/cart` | List all products, including each item's `totalPrice` |
| GET | `/cart/:id` | Get one product |
| POST | `/cart` | Add a product (requires `id`, `productName`, `price`, `quantity`, and `category`) |
| PUT | `/cart/:id` | Update one or more product fields |
| DELETE | `/cart/:id` | Remove a product |

Example POST body:

```json
{
  "id": 4,
  "productName": "Bluetooth Headphones",
  "price": 1499,
  "quantity": 1,
  "category": "Electronics"
}
```

For API requests in VS Code EchoAPI and the screenshots requested by the brief, see [`EchoAPI-requests.md`](EchoAPI-requests.md) and [`screenshots/README.md`](screenshots/README.md).
