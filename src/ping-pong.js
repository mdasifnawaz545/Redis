import express from 'express';
import mongoose from 'mongoose';
import Redis from 'ioredis';

// Initializing Express
const app = express();

// Exposing a port in order to listen or recieve request from the client.
app.listen(3000, ()=>{
    console.log("Port is listen on 3000");
})

// Creating a Redis Client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Creating a MongoDB Client
const mongoClient = async () =>{
    if(mongoose.connection.readyState === 1 && process.env.MONGODB_URL){
        try{
            await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/redis_db');
            console.log("MongoDB is connected");
        }
        catch(err){
            console.error("Error connecting to MongoDB:", err);
        }
    }
    else{
        console.log("MongoDB is already connected");
    }

}

// Ping Endpoint for Redis
app.get('/redis', async (req,res) => {
    const pong = await redisClient.ping();
    res.json({message: "Redis is connected", Response: pong});
})

// Connection Endpoint for MongoDB
app.get('/mongodb', async (req,res) => {
    await mongoClient();
    res.json({message: "MongoDB is connected", Database: mongoose.connection.name});
});

