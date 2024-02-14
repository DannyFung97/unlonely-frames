const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>My first express app</title>
    <meta property="og:image" content="https://i.imgur.com/G9GNlPR.png">

    <meta property="fc:frame" content="vNext">
    <meta property="fc:frame:image" content="https://i.imgur.com/G9GNlPR.png">

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

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`)
    })