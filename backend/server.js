require("dotenv").config();
require("./db/connect")();

const express = require('express');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 8000;

app.use(cors())
app.use('/', express.static(__dirname + '/public'))
app.use(express.json({ extended: false }))

app.use("/api", require("./routes/api.route"));
app.use(require("./middleware/errorHandler"));


app.get('*',function(req,res){
    res.sendFile(__dirname + "/public/index.html")
});



app.listen(PORT, function() {
    console.log('Express server listening on port ', PORT);
});