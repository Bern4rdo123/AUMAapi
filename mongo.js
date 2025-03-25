const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config();
const uri = process.env.MONGO_CONNECTION;

// Arquivo só para pingar conexão com o mongo

// mongodb+srv://felipefseganfredo:<senha>@aumacluster.c8rfr.mongodb.net/?retryWrites=true&w=majority&appName=AUMACluster

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);