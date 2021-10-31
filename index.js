const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')


const app = express();
const port = process.env.PORT || 5000


const ObjectId = require('mongodb').ObjectId
app.use(cors())
app.use(express.json())

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvkzg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try {
        await client.connect();
        console.log('database connected')
        const database = client.db('foodMaster');
        const offerCollection = database.collection('users');
        const userCollection = database.collection('client');

        // get offers from database
        app.get('/offers', async (req, res) => {
            console.log('sdsadsad');
            const query = offerCollection.find({})
            const result = await query.toArray()
            res.json(result)
        })

        // post user information
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            res.json(result)
        })

        // get all user
        app.get('/users', async (req, res) => {
            const query = userCollection.find({})
            const result = await query.toArray()
            res.json(result)
        })


        // delete 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.json(result)
        })


        // add new service post method
        app.post('/admin', async (req, res) => {
            const newService = req.body;
            const result = await offerCollection.insertOne(newService)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {

    res.send('server running');
});


app.listen(port, () => {
    console.log('listening from port', port);
})