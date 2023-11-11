const http = require("http");
const fs = require("fs");
const { parse } = require("querystring");

const PORT = "8080";

let products = [
  {
    id: 1,
    name: "Laptop",
    description: "High-performance laptop for all your needs.",
    price: `390 ${"SR"} `,
  },
  {
    id: 2,
    name: "Smartphone",
    description: "Latest smartphone with advanced features.",
    price: `1000 ${"SR"} `,
  },
];

const handleError = (res, statusCode, massage) => {
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.write(massage);
  res.end();
};

const saveProducts = () => {
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if (err) {
      console.error("Error in saving file", err);
    } else {
      console.log("Product save in file");
    }
  });
};

http
  .createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h1>Hello, World!</h1>");
        res.end();
      } catch {
        handleError(res, 500, "Server Error");
      }
    } else if (req.url === "/" && req.method === "POST") {
      try {
        let body = "";
        req.on("data", (chunk) => {
          body = body + chunk;
        });
        req.on("end", () => {
          console.log("Received Data :", body);
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.write("Data is Received and logged");
          res.end();
        });
      } catch {
        handleError(res, 500, "Server Error");
      }
    }
    //get the product
    else if (req.url === "/products" && req.method === "GET") {
      try {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(products));
        res.end();
      } catch {
        handleError(res, 500, "Server Error");
      }
    }

    //create new product
    else if (req.url === "/products" && req.method === "POST") {
      try {
        let body = "";
        req.on("data", (chunk) => {
          body = body + chunk;
        });
        req.on("end", () => {
          const data = parse(body);
          const newProducts = {
            id: new Date().getTime().toString(),
            name: data.name,
            description: data.description,
            price: data.price,
          };

          products.push(newProducts);
          saveProducts();
          res.writeHead(201, { "Content-Type": "text/plain" });
          res.write("New Product is Created");
          res.end();
        });
      } catch {
        handleError(res, 500, "Server Error");
      }
    }
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);