import express from 'express';
import Redis from 'ioredis';
import { EMAIL_QUEUE } from './constants.js';

const app = express();
const redis = new Redis();

app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { email, subject, body } = req.body;
    const emailData = { email, subject, body };

    // Push the email data to the Redis queue from left side and worker will pop from right side
    await redis.lpush(EMAIL_QUEUE, JSON.stringify(emailData));
    
    res.json({ message: 'Email queued successfully' });
});

app.get('/queue-length', async (req, res) => {
    const length = await redis.llen(EMAIL_QUEUE);
    res.json({ queueLength: length });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

