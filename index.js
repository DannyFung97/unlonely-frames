const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

async function generateCountdownImage(callback) {
    const imageUrl = 'https://i.imgur.com/30AZsvg.png'; // URL of the background image

    // Load the external image
    const background = await loadImage(imageUrl);

    // Setup canvas dimensions to match the background image
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    // Draw the background image first
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Determine the next stream date
    const now = moment();
    let nextStreamDate;
    if (now.isoWeekday() <= 3) {
        nextStreamDate = moment.utc('2024-02-14T20:00:00-05:00');
    } else if (now.isoWeekday() === 4) {
        nextStreamDate = moment.utc('2024-02-15T15:00:00-05:00');
    } else if (now.isoWeekday() === 5) {
        nextStreamDate = moment.utc('2024-02-16T15:00:00-05:00');
    }    // Logic to determine nextStreamDate as previously

    const diff = moment.duration(nextStreamDate.diff(now));
    const countdownText = `${diff.hours()}h:${diff.minutes()}m:${diff.seconds()}s`;
    const nextStreamText = "Next Stream";

    // Text styling
    ctx.fillStyle = 'blue'; // Text color
    ctx.font = 'bold 25px Arial'; // Font size and family
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw the texts over the image
    ctx.fillText(nextStreamText, canvas.width / 2, canvas.height * 0.77);
    ctx.font = 'bold 32px Arial'; // Font size and family
    ctx.fillText(countdownText, canvas.width / 2, canvas.height * 0.9);

    // Convert the canvas to a Buffer
    const buffer = canvas.toBuffer('image/png');
    callback(buffer);
}

app.get('/countdown-image', async (req, res) => {
    try {
        await generateCountdownImage(buffer => {
            res.setHeader('Content-Type', 'image/png');
            res.send(buffer);
        });
    } catch (error) {
        console.error('Error generating countdown image:', error);
        res.status(500).send('Error generating image');
    }
});
app.get('/', (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/countdown-image`;
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>My first express app</title>
    <meta property="og:image" content="${imageUrl}">
    </head>
    <body>
    <h1>Welcome to my first express app</h1>
    <p>This is a simple HTML document</p>
    </body>
    </html>`);
});

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`);
});