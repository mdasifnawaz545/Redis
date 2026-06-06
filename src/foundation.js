// In this file we will simply store a key value pair in the redis database and then we are simply going to retrieve it.

// Importing all the required packages and constants
import Redis from 'ioredis';
import Express from 'express';
import {BANNER_KEY} from './constants'

// Initializing Express
const app = Express();

// Adding middleware to parse JSON bodies in incoming requests
app.use(Express.json());

// Creating a Redis Client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Endpoint to set a key value pair in Redis in which the value is coming from the user
app.post('/set-banner', async (req,res) => {
    const {banner} = req.body;
    if(!banner) {
        res.json({message: "Banner is required"});
        return;
    }
    await redis.set(BANNER_KEY, banner);
    res.json({message: "Banner is set successfully"});
});

// Endpoint to retrieve the value of the key from Redis
app.get('/get-banner', async (req,res) => {
    const {key} = req.body;
    const banner = await redis.get(key);
    res.json({message: "Banner is retrieved successfully", banner});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

app.get('/banner-exists', async(req,res) =>{
    const {key} = req.body;
    const exists = await redis.exists(key);
    res.json({message: "Banner existence checked successfully", exists: exists === 1});
});

app.get('/delete-banner', async(req,res) =>{
    const {key} = req.body;
    await redis.del(key);
    res.json({message: "Banner is deleted successfully"});
});

