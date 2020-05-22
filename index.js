const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

// Create app
const app = express();
app.use(cors());
app.use(bodyParser.json());

//sample data
let fruit = [
  {
    product: "ada",
    price: 20,
  },
  {
    product: "alu",
    price: 51,
  },
  {
    product: "potol",
    price: 51,
  },
  {
    product: "lau",
    price: 51,
  },
  {
    product: "tomato",
    price: 51,
  },
];

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

//database connection

// create API
//get - read data from server
app.get("/product/:id", (req, res) => {
  const id = req.params.id;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("products");
    collection.find({ id }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents[0]); //return
      }
    });
    client.close();
  });
});

app.post("/getProductsById", (req, res) => {
  const productsId = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("products");
    collection.find({ id: { $in: productsId } }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents); //return
      }
    });
    client.close();
  });
});

app.get("/product", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("products");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents); //return
      }
    });
    client.close();
  });
});

//post - post to server
app.post("/addProduct", (req, res) => {
  const product = req.body;
  client.connect((err) => {
    const collection = client.db("redOnion").collection("products");
    collection.insert(product, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result); //return
      }
    });
    client.close();
  });
});

app.post("/placeOrder", (req, res) => {
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  console.log(orderDetails);
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("orders");
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]); //return
      }
    });
    client.close();
  });
});

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", function () {
  console.log("Server started.......");
});
//app.listen(port, () => console.log("Listening 3000"));
