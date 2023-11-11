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

const handleError = (res, statusCode, massage) => {
  res.status(statusCode).send(massage);
};

app.get("/", (req, res) => {
  try {
    res.status(200).send("<h1>Hello, World</h1>");
  } catch {
    handleError(res, 500, "Server Error");
  }
});

app.post("/", (req, res) => {
  try {
    const data = req.body;
    console.log("Received Data :", data);
    res.status(200).send("Data is Received and logged");
  } catch {
    handleError(res, 500, "Server Error");
  }
});

app.get("/products", (req, res) => {
  try {
    res.status(200).json(products);
  } catch {
    handleError(res, 500, "Server Error");
  }
});
app.post("/products", (req, res) => {
  try {
    const data = req.body;
    const newProducts = {
      id: new Date().getTime().toString(),
      name: data.name,
      description: data.description,
      price: data.price,
    };
    const existingProducts = JSON.parse(
      fs.readFileSync("products.json", "utf8")
    );
    existingProducts.push(newProducts);
    fs.writeFileSync("products.json", JSON.stringify(existingProducts));
    res.status(201).send("New Product is Created");
  } catch {
    handleError(res, 500, "Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
