import experss from 'express';
import Redis from 'ioredis';
import { EMAIL_OTP_KEY } from './constants.js';

// Initializing Express
const app = experss();

// Adding middleware to parse JSON bodies in incoming requests
app.use(experss.json());

// Creating a Redis Client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// This funtion is used to generate 6 digit number between 100000 and 999999
function generateRandomSixDigitNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
}

// This functoin is used to simply create a unique key for the redis for Email OTP storage.
function emailOTPKey(email){
    return `${EMAIL_OTP_KEY}+${email}`
}

// Endpoint to send an OTP to the user mobile number and store it in Redis with a TTL of 5 minutes
app.post('/send-otp', async (req,res) => {
    const {emailId} = req.body;
    if(!emailId) {
        res.json({message: "Mobile number is required"});
        return;
    }
    const otp = generateRandomSixDigitNumber();
    console.log("OTP is : ",otp);
    await redisClient.set(emailOTPKey(emailId), otp, 'EX', 30);
    res.json({message: "OTP sent successfully to you Email ID"});
});

// This endpoint is used to verify the user entered OTP with the generated or Stored OTP from the Redis.
app.post('/verify-otp', async (req,res) => {
    const {emailId, otp} = req.body;
    const verifiedOTP = await redisClient.get(emailOTPKey(emailId));
    console.log(verifiedOTP)
    if(verifiedOTP !== otp){
        res.json({message : "Wrong or No OTP found"});
        return;
    }
    res.json({message: "OTP Verified Successfully"});
});

app.listen(3000, ()=>{
    console.log("Port is Listening on 3000");
})


