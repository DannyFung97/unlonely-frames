const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'));

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const moment = require('moment');

// Function to generate the countdown image
async function updateCountdownImage() {
    // Determine the next stream date based on current day
    const now = moment();
    let nextStreamDate;
    // Example: Selecting next stream date based on logic similar to your needs
    if (now.isoWeekday() <= 3) { // If today is Wednesday or before
        nextStreamDate = moment.utc('2024-02-14T20:00:00-05:00'); // 8 PM EST
    } else if (now.isoWeekday() === 4) { // Thursday
        nextStreamDate = moment.utc('2024-02-15T15:00:00-05:00'); // 3 PM EST
    } else if (now.isoWeekday() === 5) { // Friday
        nextStreamDate = moment.utc('2024-02-16T15:00:00-05:00'); // 3 PM EST
    } else {
        // Adjust logic as needed
    }

    // Generate countdown text
    const diff = moment.duration(nextStreamDate.diff(now));
    const countdownText = `${diff.hours()}h:${diff.minutes()}m:${diff.seconds()}s`;
    const nextStreamText = "next stream"; // Text for the second line

    const imageWidth = 3000;
    const imageHeight = 1570;

    const textOverlay = `
    <svg width="${imageWidth}" height="${imageHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
            @font-face {
                font-family: 'Comic Sans MS';
                src: url('fonts/ComicSansMS.ttf') format('truetype');
            }
            text { 
                font-family: 'Comic Sans MS', sans-serif;
            }
        </style>
        <text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" font-size="167" fill="blue">${nextStreamText}</text>
        <text x="50%" y="95%" dominant-baseline="middle" text-anchor="middle" font-size="200" fill="blue">${countdownText}</text>
    </svg>`;

    const originalImagePath = path.join(__dirname, 'public', 'original.png');
    const outputImagePath = path.join(__dirname, 'public', 'countdown.png');

    try {
        await sharp(originalImagePath)
            .composite([{ input: Buffer.from(textOverlay), top: 0, left: 0, blend: 'over' }])
            .toFile(outputImagePath);
        console.log('Countdown image updated with text overlay.');
    } catch (error) {
        console.error('Error updating countdown image with text overlay:', error);
    }
}

setInterval(updateCountdownImage, 5 * 1000);

// Update immediately on start
updateCountdownImage();

app.get('/', (req, res) => {
    const url = process.env.VERCEL_URL || `http://localhost:${port}`;
    const imageUrl = `${url}/countdown.png`;
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>My first express app</title>
    <meta http-equiv="refresh" content="5">
    <meta property="og:image" content="${imageUrl}">

    <meta property="fc:frame" content="vNext">
    <meta property="fc:frame:image" content="${imageUrl}">

    <meta property="fc:frame:button:1" content="watch now">
    <meta property="fc:frame:button:1:action" content="link">
    <meta property="fc:frame:button:1:target" content="https://www.unlonely.app/channels/loveonleverage">
    </head>
    <body>
    <h1>Welcome to my first express app</h1>
    <p>This is a simple HTML document</p>
    </body>
    </html>`)
    }
)

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`)
    })