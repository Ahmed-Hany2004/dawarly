const express = require("express")

const router = express.Router()

const {createBooking,Getbookingsbyproperty,Getbookingsbyuser,Updatebookingstatus,Updatebookingdates,Cancelbooking} = require("../controllers/BookingController")

const {veriy_Token} = require("../fun/verifyToken")

router.post("/create/Properties/:Propertiesid",veriy_Token,createBooking)

router.get("/Properties/:Propertiesid",Getbookingsbyproperty)

router.get("/user/:userid",Getbookingsbyuser)

router.put("/:bookingid", veriy_Token, Updatebookingstatus)

router.put("/:bookingid/Properties/:Propertiesid",veriy_Token,Updatebookingdates)

router.put("/:bookingid/Cancel", veriy_Token, Cancelbooking)

module.exports = router