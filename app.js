const express = require("express");
const morgan = require("morgan");
var cors = require('cors');
const bodyparser = require("body-parser");

const app = express();


app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use(cors())



userpath = require("./routes/userRoute")

app.use("/api/users", userpath )

app.listen(3000, () => console.log('Server running on http://localhost:3000'));