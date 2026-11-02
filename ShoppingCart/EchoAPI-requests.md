# EchoAPI request guide

The VS Code EchoAPI extension can import cURL requests. In the EchoAPI view, open the dropdown beside **Create New Request**, choose **Import Data → cURL**, paste one command below, and import it. Start the Express server first with `npm run start:express`.

After importing each request, click **Send** and capture the request method, URL, response status, and body. Save the genuine EchoAPI screenshots in `screenshots/`.

## GET all cart items

```sh
curl -X GET "http://localhost:4000/cart" -H "Accept: application/json"
```

## GET one cart item

```sh
curl -X GET "http://localhost:4000/cart/1" -H "Accept: application/json"
```

## POST a product

```sh
curl -X POST "http://localhost:4000/cart" -H "Content-Type: application/json" -H "Accept: application/json" --data-raw '{"id":4,"productName":"Bluetooth Headphones","price":1499,"quantity":1,"category":"Electronics"}'
```

Expect `201 Created`.

## PUT an update

```sh
curl -X PUT "http://localhost:4000/cart/1" -H "Content-Type: application/json" -H "Accept: application/json" --data-raw '{"productName":"Wireless Mouse","price":899,"quantity":3,"category":"Electronics"}'
```

## DELETE a product

```sh
curl -X DELETE "http://localhost:4000/cart/1" -H "Accept: application/json"
```

The cart is stored in memory. Restarting the server restores the three sample products.
