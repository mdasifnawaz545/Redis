import express from 'express';
import {EmailQueue} from './queue.js';
import Redis from 'ioredis';

const app = express();
const redis = new Redis();

app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { email, subject, body } = req.body;
    const emailData = { email, subject, body };

    await EmailQueue.add('send-email-one', emailData, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        }
    });
    res.json({ message: 'Email queued successfully' });
});

app.get('/queue-length', async (req, res) => {
    const length = await EmailQueue.getWaitingCount();
    res.json({ queueLength: length });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});