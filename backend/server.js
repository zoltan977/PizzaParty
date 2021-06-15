const express = require('express');
const app = express();
const fs = require('fs');

const PORT = 8000;

app.use('/', express.static(__dirname + '/public'))

app.get('/data', function(req, res) {
    res.set('Access-Control-Allow-Origin', "http://localhost:3000");

    const jsonFilePath = __dirname + '/data/' + 'data.json';

    let data;

    try {
        data = fs.readFileSync(jsonFilePath);
        jsonData = JSON.parse(data);
    } catch (err) {
        console.error(err);

        res.status(400).send('Server Error');
    }

    res.json(jsonData);
});
  


app.listen(PORT, function() {
    console.log('Express server listening on port ', PORT);
});