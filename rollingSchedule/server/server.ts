import * as dotenv from 'dotenv';
dotenv.config();
import { MongoClient} from 'mongodb';
import { repository  } from './repo.js';
import express from 'express';
const port = 8080;
const initApi= ()=>{
  const app = express();
  app.use(express.static('./dist/public'));
  app.use(express.json());
  // app.get('/',(req,res)=>{
  //   res.send("{ok:true}");
  // })
  app.get('/schedulez',async (req:any,res:any)=>{
    var result = await repository.getAll();
    res.send(result);
  })

  app.get('/schedule/:id',async (req:any,res:any)=>{
    var result = await repository.findScheduleItem(req.params.id);
    res.send(result);
  })


  app.post('/schedule', async (req:any,res:any)=>{
    //get schedule from mongo
    let id = await repository.addSchedule(req.body);
    res.send({id:id});
  })


  app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}!`);
  })

}

const uri = process.env.MONGODB_CONNECTION;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri!
  // , {
  // serverApi: {
  //   version: ServerApiVersion.v1,
  //   strict: true,
  //   deprecationErrors: true,
  // }
  //}
);
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    repository.initDb(client.db("rolling-schedule"));
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    initApi();

  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);

    // //"start": "npx tsc && node dist\\server.js"
