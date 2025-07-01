const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000
// const admin = require("firebase-admin");

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

// let serviceAccount = null;

// try {
//   const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8');
//   serviceAccount = JSON.parse(decoded);
// } catch (e) {
//   console.error("Failed to parse Firebase service account:", e.message);
// }

// if (serviceAccount) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
// } else {
//   console.error("Firebase Admin SDK not initialized due to service account error.");
// }

// if (!process.env.FB_SERVICE_KEY) {
//   throw new Error("Missing FB_SERVICE_KEY in environment variables");
// }



const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log('decoded token ', decoded);
    req.decoded = decoded;
    next();
  }
  catch (err) {
    return res.status(401).send({ message: 'unauthorized access' })
  }

}


const verifyTokenEmail = (req, res, next) => {
  if (req.params.email !== req.decoded.email) {
    return res.status(403).send({ message: 'forbidden access' })
  }
  next();
}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@am.ochad9p.mongodb.net/?retryWrites=true&w=majority&appName=AM`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {

    const queriesCollection = client.db('QueriesDB').collection('Queries')
    const usersCollection = client.db('QueriesDB').collection('Users')
    const recommendationCollection = client.db('QueriesDB').collection('recommendations')



    app.post('/jwt', async (req, res) => {
      const { email } = req.body;
      const user = { email };
      const token = jwt.sign(user, 'secret', { expiresIn: '3d' });
      res.send({ token })
    })




    app.post('/users', async (req, res) => {
      const user = req.body
      try {
        const existingUser = await usersCollection.findOne({ email: user.email })
        if (existingUser) {
          return res.send({ message: 'User already exists' })
        }
        const result = await usersCollection.insertOne(user)
        res.send(result)
      } catch (error) {
        res.status(500).send({ message: 'Failed to save user' })
      }
    });


    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().sort({ createdAt: -1 }).toArray()
      res.send(result)
    });



    app.get('/queries', async (req, res) => {
      const result = await queriesCollection.find().sort({ createdAt: -1 }).toArray()
      res.send(result)
    })


    app.get('/my-queries/:email', verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
      const userEmail = req.params.email;
      try {
        const result = await queriesCollection.find({ userEmail }).sort({ createdAt: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch user queries' });
      }
    });


    app.get('/queries/:id', async (req, res) => {
      const id = req.params.id
      try {
        const query = await queriesCollection.findOne({ _id: new ObjectId(id) })
        if (!query) {
          return res.status(404).send({ error: 'Query not found' })
        }
        res.send(query)
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch the query' })
      }
    });


    app.post('/queries', verifyFirebaseToken, async (req, res) => {
      const queries = {
        ...req.body,
        createdAt: new Date().toISOString(),
        recommendationCount: 0,
        userEmail: req.body.userEmail,
      }
      const result = await queriesCollection.insertOne(queries)
      res.send(result)
    });


    app.patch('/queries/:id', verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      try {
        const existingQuery = await queriesCollection.findOne({ _id: new ObjectId(id) });

        if (!existingQuery) {
          return res.status(404).send({ success: false, message: 'Query not found' });
        }

        if (existingQuery.userEmail !== req.decoded.email) {
          return res.status(403).send({ message: 'forbidden access' });
        }

        const result = await queriesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        res.send({ success: true, message: 'Query updated successfully' });
      } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to update query' });
      }
    });



    app.delete('/queries/:id', verifyFirebaseToken, async (req, res) => {
      const id = req.params.id
      try {
        const query = await queriesCollection.findOne({ _id: new ObjectId(id) })
        if (!query) {
          return res.status(404).send({ success: false, message: 'Query not found' })
        }
        if (query.userEmail !== req.decoded.email) {
          return res.status(403).send({ message: 'forbidden access' })
        }
        const result = await queriesCollection.deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 0) {
          return res.status(404).send({ success: false, message: 'Query not found' })
        }
        res.send({ success: true, message: 'Query deleted successfully' })
      } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to delete query' })
      }
    })




    app.get('/recommendations/:queryId', async (req, res) => {
      const queryId = req.params.queryId
      const result = await recommendationCollection.find({ queryId }).toArray()
      res.send(result)
    });


    app.get('/recommendations-by-user/:email', verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
      const email = req.params.email;
      const result = await recommendationCollection.find({ recommenderEmail: email }).toArray();
      res.send(result);
    });


    app.get('/recommendations-for-user/:email', verifyFirebaseToken, verifyTokenEmail, async (req, res) => {
      const email = req.params.email;
      try {
        const userQueries = await queriesCollection.find({ userEmail: email }).toArray();
        const queryIds = userQueries.map(q => q._id.toString());
        const recommendations = await recommendationCollection.find({
          queryId: { $in: queryIds }
        }).toArray();
        res.send(recommendations);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch recommendations" });
      }
    });




    app.post('/recommendations', async (req, res) => {
      const recommendation = {
        ...req.body,
        queryId: req.body.queryId.toString(),
        createdAt: new Date().toISOString(),
      };

      try {
        const insertResult = await recommendationCollection.insertOne(recommendation);
        const updateResult = await queriesCollection.updateOne(
          { _id: new ObjectId(req.body.queryId) },
          { $inc: { recommendationCount: 1 } }
        );
        res.send({ success: true, insertResult, updateResult });
      } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong' });
      }
    });



    app.delete('/recommendations/:id', verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      try {
        const recommendation = await recommendationCollection.findOne({ _id: new ObjectId(id) });
        if (!recommendation) {
          return res.status(404).send({ success: false, message: 'Recommendation not found' });
        }
        if (recommendation.recommenderEmail !== req.decoded.email) {
          return res.status(403).send({ success: false, message: 'Forbidden access' });
        }
        const deleteResult = await recommendationCollection.deleteOne({ _id: new ObjectId(id) });
        const updateResult = await queriesCollection.updateOne(
          { _id: new ObjectId(recommendation.queryId) },
          { $inc: { recommendationCount: -1 } }
        );
        res.send({ success: true, deleteResult, updateResult });
      } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to delete recommendation' });
      }
    });




    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {


  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Query server is running!')
})

app.listen(port, () => {
  console.log(`Query server is running on port ${port}`)
})