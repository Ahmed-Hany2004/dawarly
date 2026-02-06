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
subCategorypath = require("./routes/subCategory")
productpath = require("./routes/Product") 
Bookingpath = require("./routes/Booking")
prforrenetpath = require("./routes/prforrenet")

app.use("/api/users", userpath )
app.use("/api/subCategory", subCategorypath)
app.use("/api/product", productpath)
app.use("/api/Booking",Bookingpath)
app.use("/api/rent",prforrenetpath)

app.listen(3000, () => console.log('Server running on http://localhost:3000'));