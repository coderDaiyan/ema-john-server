const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eahzv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(process.env.DB_USER);

client.connect((err) => {
  const productCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products);
    productCollection.insertOne(products).then((result) => {
      console.log(result);
      res.send(result.insertedCount);
      console.log(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    productCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    productCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  console.log("db connection success");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
