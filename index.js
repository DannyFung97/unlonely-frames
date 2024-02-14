const express = require('express');
const sharp = require('sharp');
const moment = require('moment');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Function to generate SVG content for the countdown image
function generateCountdownSVG() {
    const now = moment();
    let nextStreamDate;
    if (now.isoWeekday() <= 3) {
        nextStreamDate = moment.utc('2024-02-14T20:00:00-05:00');
    } else if (now.isoWeekday() === 4) {
        nextStreamDate = moment.utc('2024-02-15T15:00:00-05:00');
    } else if (now.isoWeekday() === 5) {
        nextStreamDate = moment.utc('2024-02-16T15:00:00-05:00');
    }

    const diff = moment.duration(nextStreamDate.diff(now));
    const countdownText = `${diff.hours()}h:${diff.minutes()}m:${diff.seconds()}s`;
    const nextStreamText = "Next Stream";

    const imageWidth = 3000;
    const imageHeight = 1570;

    return `
    <svg width="${imageWidth}" height="${imageHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
            @font-face {
                font-family: 'Comic Sans MS';
            }
            text { 
                font-family: 'Comic Sans MS', sans-serif;
            }
        </style>
        <text x="50%" y="77%" dominant-baseline="middle" text-anchor="middle" font-size="147" fill="blue">${nextStreamText}</text>
        <text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-size="200" fill="blue">${countdownText}</text>
    </svg>`;
}

app.get('/countdown-image', async (req, res) => {
    try {
        // Get the SVG content
        const svgContent = generateCountdownSVG();
        
        // Path to the original image
        const originalImagePath = path.join(__dirname, 'public', 'original.png');
        
        // Convert the SVG content to a PNG buffer
        const overlayBuffer = await sharp(Buffer.from(svgContent))
            .toFormat('png')
            .toBuffer();
        
        // Composite the overlay onto the original image
        const imageWithText = await sharp(originalImagePath)
            .composite([{ input: overlayBuffer, gravity: 'southeast' }]) // Adjust gravity as needed
            .toBuffer();
        
        res.setHeader('Content-Type', 'image/png');
        res.send(imageWithText);
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