const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();
const PORT = "8080";

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let products = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop for all your needs.",
    price: `320 ${"SR"} `,
  },
  {
    id: 2,
    name: "Smartphone",
    description: "Latest smartphone with advanced features.",
    price: `1000 ${"SR"} `,
  },
];

// Function to handle errors asynchronously
const handleError = async (res, statusCode, message) => {
  try {
    await res.status(statusCode).send(message);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Server Error");
  }
};

// Root path ("/") GET request
app.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>Hello, World</h1>");
  } catch {
    await handleError(res, 500, "Server Error");
  }
});

// Root path ("/") POST request
app.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received Data:", data);
    res.status(200).send("Data is Received and logged");
  } catch {
    await handleError(res, 500, "Server Error");
  }
});

// "/products" GET request
app.get("/products", async (req, res) => {
  try {
    res.status(200).json(products);
  } catch {
    await handleError(res, 500, "Server Error");
  }
});

// "/products" POST request
app.post("/products", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newProduct = {
      id: new Date().getTime().toString(),
      name,
      description,
      price,
    };

    // Read existing products from the JSON file
    const existingProducts = JSON.parse(
      fs.readFileSync("products.json", "utf8")
    );

    // Push the new product to the existing products array
    existingProducts.push(newProduct);

    // Write the updated array back to the JSON file
    fs.writeFileSync("products.json", JSON.stringify(existingProducts));

    res.status(201).send("New Product is Created");
  } catch {
    await handleError(res, 500, "Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
