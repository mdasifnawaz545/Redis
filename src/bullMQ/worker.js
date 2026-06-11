import {connection, EmailQueue} from './queue.js';
import {Worker} from 'bullmq'; 

const emailWorker = new Worker('emailQueue', async job => {
    const { email, subject, body } = job.data;
    console.log(`Sending email to ${email} with subject "${subject}" and body "${body}"`);
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 20000));
    console.log(`Email sent to ${email}`);
}, { connection });

emailWorker.on('completed', job => {
    console.log(`Job with id ${job.id} has been completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error: ${err.message}`);
}); 