# Screenshots for submission

This folder contains browser captures for the HTTP routes:

- `http-server-home.png` shows the native HTTP server responding at `/`.
- `static-page-fs-home.png` shows `/home` serving `public/index.html` through the FS module.

API-client screenshots are required by the submission brief. Start the Express server with `npm run start:express`. Use the EchoAPI requests in [`EchoAPI-requests.md`](../EchoAPI-requests.md), then save a screenshot showing each request and response in this folder.

The API can also be demonstrated from PowerShell. Start the Express server with `npm run start:express`, then run:

```powershell
# GET all products and one product
Invoke-RestMethod http://localhost:4000/cart
Invoke-RestMethod http://localhost:4000/cart/1

# POST a product
$body = @{ id = 4; productName = 'Bluetooth Headphones'; price = 1499; quantity = 1; category = 'Electronics' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:4000/cart -ContentType 'application/json' -Body $body

# Update and then delete that product
$update = @{ quantity = 2 } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri http://localhost:4000/cart/4 -ContentType 'application/json' -Body $update
Invoke-RestMethod -Method Delete -Uri http://localhost:4000/cart/4
```

Capture the GitHub repository page and its commit history after pushing the project. A local Git commit history does not appear on GitHub until the repository is pushed.
