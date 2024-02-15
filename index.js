const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;

async function generateCountdownImage() {
  const imageUrl = 'https://i.imgur.com/30AZsvg.png'; // URL of the background image

  // Load the external image
  const background = await loadImage(imageUrl);

  // Create a canvas with the same dimensions as the background image
  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext('2d');

  // Draw the background image
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Determine the next stream date
  const now = moment();
  let nextStreamDate;
  if (now.isoWeekday() <= 3) { // If today is Wednesday or before
    nextStreamDate = moment.utc('2024-02-14T20:00:00-05:00');
  } else if (now.isoWeekday() === 4) { // Thursday
    nextStreamDate = moment.utc('2024-02-15T15:00:00-05:00');
  } else if (now.isoWeekday() === 5) { // Friday
    nextStreamDate = moment.utc('2024-02-16T15:00:00-05:00');
  }

  const diff = moment.duration(nextStreamDate.diff(now));
  const countdownText = `Next stream in ${diff.hours()}h:${diff.minutes()}m:${diff.seconds()}s`;

  // Set text properties
  ctx.fillStyle = 'blue'; // Text color
  ctx.font = '32px Arial'; // Font size and family
  ctx.textAlign = 'center'; // Center the text horizontally
  ctx.textBaseline = 'middle'; // Center the text vertically

  // Draw the text onto the canvas
  ctx.fillText(countdownText, canvas.width / 2, canvas.height / 2);

  // Convert the canvas to a Buffer
  const buffer = canvas.toBuffer('image/png');

  return buffer;
}

app.get('/countdown-image', async (req, res) => {
  try {
    const imageBuffer = await generateCountdownImage();
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
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