import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';

import express from 'express';
import { fileURLToPath } from 'url';
import { saveUser, loginUser } from './userHandler.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 8080;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });

  app.post('/saveuser', async (req,res,next)=>{
    saveUser(req.body).then(id=>{
        res.send({id:id});
    }).catch(err=>{
        res.status(500).send(err.message);
    }

    );
})
// app.get('/login', async (req,res)=>{
//     console.log(res.body)
//     let id = await loginUser(req.body);
//     res.send({id:id});
// })



app.post('/login', async (req,res)=>{
    console.log(res.body)
    let id = await loginUser(req.body);
    res.send({id:id});
})


app.listen(port, ()=>{
    console.log(`App listening on port ${port}!`);
  })

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  });
