const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send(`
    <DOCTYPE html>
    <html>
    <head>
    <title>My first express app</title>
    <meta property="og:image" content="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">

    <meta property="fc:frame" content="vNext">
    <meta property="fc:frame:image" content="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">

    <meta property="fc:frame:button:1" content="See time">
    <meta property="fc:frame:button:1:action" content="Action1">
    <meta property="fc:frame:button:1:target" content="target1Url">

    <meta property="fc:frame:button:2" content="Watch now">
    <meta property="fc:frame:button:2:action" content="link">
    <meta property="fc:frame:button:2:target" content="https://www.unlonely.app/channels/loveonleverage">
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