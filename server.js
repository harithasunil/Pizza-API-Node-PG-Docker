const express = require("express");
const logger = require("morgan");
var fs = require('fs');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.NODE_ENV || 8010

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(logger('common', {
  stream: fs.createWriteStream('./app/logs/access.log', {
    flags: 'a'
  })
}));


require("./app/routes")(app);
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Pizza API"
  })
);
app.listen(port, () => console.log(`${__dirname} App listening on port ${port}!`))
