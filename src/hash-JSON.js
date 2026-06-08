import express from 'express';
import Redis from 'ioredis';

// Initializing Express
const app = express();

// Adding middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Creating a Redis Client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const hashObject = {
    name: "Md Asif Nawaz",
    age: 23,
    city: "Madina"
};

// Endpoint to set a hash in Redis
app.post('/set-hash', async (req,res) => {
    await redisClient.hset('user:1', hashObject);
    res.json({message: "Hash is set successfully"});
});

// Endpoint to retrieve a hash from Redis
app.get('/get-hash/:key', async (req,res) => {
    const {key} = req.params;
    const hash = await redisClient.hgetall(key);
    res.json({message: "Hash is retrieved successfully", hash});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});