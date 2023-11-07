const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.70brgql.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('farmTradeDB').collection('services');
    const userCollection = client.db('farmTradeDB').collection('users');
    const reviewCollection = client.db('farmTradeDB').collection('review');

     //auth api
     app.post('/jwt', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
      res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
      })
      .send({success: true});
    })

    //get user
    app.get('/users/:id', async (req, res) => {
      const currentUser = req.params.id;
      const query = { email: currentUser }
      const result = await userCollection.findOne(query);
      res.send(result);
    })


    // post user
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    //get service
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
     res.send(result);
   })

    //post service 
    app.post('/services', async (req, res) => {
        const newService = req.body;
        console.log(newService);
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
    })

    //get review 
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
     res.send(result);
   })

    //post review 
    app.post('/reviews', async (req, res) => {
        const review = req.body;
        console.log(review);
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    })

    
    
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Farm Trade server is running')
})

app.listen(port, () => {
  console.log(`Farm Trade server is running on port ${port}`)
})