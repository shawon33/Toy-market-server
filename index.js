const express = require("express");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
// const toy = require("./Data/toy.json");

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("toy collection is coming");
});

const uri =`mongodb+srv://${process.env.TC_NAME}:${process.env.TC_PASS}@cluster0.qkjph1d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("Toy-shop").collection("toys");

    const sellerCollection = client.db("Toy-shop").collection("sellerToys");

    //  get section all toys

    app.get("/toys", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/sellerToys",async(req,res)=>{
      const cursor = sellerCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    });

    app.get("/sellerToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sellerCollection.findOne(query);
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });


    // post section

    app.get("/sellerToys", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await sellerCollection.find(query).toArray();
      res.send(result);
    });

    //   post new toy
    app.post("/sellerToys", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await sellerCollection.insertOne(toy);
      res.send(result);
    });


    // toy Update
    app.get("/sellerToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sellerCollection.findOne(query);
      res.send(result);
    });

    app.put("/sellerToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToy = req.body;
      const toy = {
        $set: {
          picture: updateToy.photo,
          name: updateToy.name,
          category: updateToy.subCategory,
          price: updateToy.price,
          details_description: updateToy.details,
          available_quantity: updateToy.quantity,
          rating: updateToy.rating,
        }
      };
      const result = await sellerCollection.updateOne(query, toy, options);
      res.send(result)
    });

    // DeleteToy

    app.delete("/sellerToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sellerCollection.deleteOne(query);
      res.send(result);
    });

  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`toy collection is running  port : ${port}`);
});
