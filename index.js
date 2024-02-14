const express = require('express')
const puppeteer = require('puppeteer');
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>My first express app</title>
    <meta property="og:image" content="/schedule.png">

    <meta property="fc:frame" content="vNext">
    <meta property="fc:frame:image" content="/schedule.png">

    <meta property="fc:frame:button:1" content="Watch now">
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

app.get('/image', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`
        <html>
        <head><style>body { display: flex; justify-content: center; align-items: center; height: 100vh; }</style></head>
        <body>
        <div style="font-size: 48px; color: red;">Hello, World!</div>
        </body>
        </html>
    `, {waitUntil: 'networkidle0'});

    const screenshot = await page.screenshot({type: 'png'});
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
});

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`)
    })