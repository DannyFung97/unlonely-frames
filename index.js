const express = require('express');
const Jimp = require('jimp');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;

async function generateCountdownImage() {
  const imageUrl = 'https://i.imgur.com/30AZsvg.png'; // URL of the background image

  // Load the external image
  const background = await Jimp.read(imageUrl);

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
  const countdownText = `next stream in ${diff.hours()}h:${diff.minutes()}m:${diff.seconds()}s`;

  // Calculate the position for the text
  const width = background.bitmap.width;
  const height = background.bitmap.height;

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  background.print(font, width / 2 - 190, height / 2 + 50, countdownText);

  // Convert the image to a Buffer
  const buffer = await background.getBufferAsync(Jimp.MIME_PNG);

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