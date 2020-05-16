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

const dbUser = process.env.DB_USER;
const pass = process.env.DB_PASS;

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

app.listen(4200, () => console.log("Listening 4200"));
