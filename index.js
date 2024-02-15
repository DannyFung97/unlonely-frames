const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 3000;


//oh my god, thank you for your help: https://github.com/Automattic/node-canvas/issues/2248

/**

First You need to set the Environment variable for your current Build
i) Go to setting --> on left in side menu click on Environment Variables
ii) in key field enter the value LD_LIBRARY_PATH and in value field enter the following line

/vercel/path0/node_modules/canvas/build/Release:/var/task/node_modules/canvas/build/Release

iii) Press Save button (you may want to set this environment variable for production, development environment or you can check all values) by default all values will be selected you can go with them

If the above steps are completed now you need to downgrade your node version to "16" in Vercel app by default at the time of writing this comment is 18 version you need to downgrade this to 16 simply by following the below steps

i) Click on setting and go to general tab from left side menu
ii) Scroll down a bit and you will see Node.js version box you can see the current version if its already 16 redeploy the server or set the version to 16 after redeploying the server your problem will be resolved.

Note: my current version of canvas library is "canvas": "^2.11.0" in my package.json

Enjoy I hope it helps

*/

async function generateCountdownImage() {
  const imageUrl = 'https://i.imgur.com/30AZsvg.png'; // URL of the background image

  // Load the external image
  const background = await loadImage(imageUrl);

  // Create a canvas with the same dimensions as the background image
  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext('2d');

  // Draw the background image
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const timeZone = 'America/New_York';

  // Determine the next stream date
  let now = moment().tz(timeZone);
  let nextStreamDate;
  // Assuming you want to set the next stream date in EST
  if (now.isoWeekday() <= 3) { // Today is Wednesday or before
    nextStreamDate = moment.tz('2024-02-14 20:00:00', timeZone);
  } else if (now.isoWeekday() === 4) { // Thursday
    nextStreamDate = moment.tz('2024-02-15 15:00:00', timeZone);
  } else if (now.isoWeekday() === 5) { // Friday
    nextStreamDate = moment.tz('2024-02-16 15:00:00', timeZone);
  }

  const diff = moment.duration(nextStreamDate.diff(now));
  const countdownText = `Next stream in ${diff.hours()}h:${diff.minutes()}m:${diff.seconds()}s`;

  // Set text properties
  ctx.fillStyle = 'blue'; // Text color
  ctx.font = '25px Arial'; // Font size and family
  ctx.textAlign = 'center'; // Center the text horizontally
  ctx.textBaseline = 'middle'; // Center the text vertically

  // Draw the text onto the canvas
  ctx.fillText(countdownText, canvas.width / 2, canvas.height / 4 * 3);

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
    <meta property="og:title" content="My First Express App" />
    <meta property="og:description" content="This is a simple HTML document" />
    <meta property="og:image" content="${imageUrl}" />

    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />

    <meta property="fc:frame:button:1" content="refresh timer" />
    <meta property="fc:frame:button:1:action" content="post_redirect" />
    <meta property="fc:frame:button:1:target" content="${imageUrl}" />

    <meta property="fc:frame:button:2" content="watch now" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://www.unlonely.app/channels/loveonleverage" />
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