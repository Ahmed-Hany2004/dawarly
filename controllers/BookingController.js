const { prisma } = require("../prismastep");

const createBooking = async(req,res)=>{

    try{
      const Propertiesid = req.params.Propertiesid

      const {startDate , endDate} = req.body

      if(!startDate || !endDate){
       return res.status(400).json({mes:"startDate and endDate is require "})
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  return res.status(400).json({ message: "Invalid date format" });
}

if (start >= end) {
  return res.status(400).json({ message: "startDate must be before endDate" });
}

if (new Date() > start) {
    return  res.status(400).json({mes:"Cannot create a booking that already started"});
    }
 
      const checkProperties = await prisma.properties_for_rent.findUnique({where:{
        id:Propertiesid
      },
      select:{
        id:true
      }
    })

      if(!checkProperties){
      return res.status(400).json({mes:"this Propertie not found "})
      }
    const checkdateavailabe = await prisma.booking.findFirst({
        where:{
            propertyId:Propertiesid,
            AND:[
                { startDate: { lt: end } }, 
                { endDate: { gt: start } },
            ]
        }
    })

   if(checkdateavailabe){
    return res.status(400).json({mes:"This date is not available"})
   }

 const newdata = await prisma.booking.create({
  data: {
    propertyId: Propertiesid,
    userId: req.user.id,
    startDate: start,
    endDate: end,
  },
  select: {
    id: true,
    startDate: true,
    endDate: true,
    status: true,

    user: {
      select: {
        name: true,
        email: true
      }
    },

    property: {
      select: {
        id: true,
        title: true,
        price: true,
        location: true
      }
    }
  }
});



    res.status(200).json({mes:"create boking",data:newdata})

    }
    catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}


const Getbookingsbyproperty = async(req,res)=>{
    try{

        const Propertiesid = req.params.Propertiesid

        const checkProperties = await prisma.properties_for_rent.findUnique({where:{
        id:Propertiesid
      },
      select:{
        id:true
      }
    })

      if(!checkProperties){
      return res.status(400).json({mes:"this Propertie not found "})
      }

      // get booking

      const data = await prisma.booking.findMany({
        where:{
           propertyId: Propertiesid,
           status:{not:"canceled"}
        },
         select: {
    id: true,
    startDate: true,
    endDate: true,
    status: true,

    user: {
      select: {
        name: true,
        email: true
      }
    },

    property: {
      select: {
        id: true,
        title: true,
        price: true,
        location: true
      }
    }
  }
      })

      res.status(200).json({mes:"boiking", data:data})
    }
    catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}


const Getbookingsbyuser = async(req,res)=>{

    try{

        const userid = req.params.userid

        //get data 

        const data = await prisma.booking.findMany({
            where:{
                userId:userid,
                status:{not:"canceled"}
            },
             select: {
    id: true,
    startDate: true,
    endDate: true,
    status: true,

    user: {
      select: {
        name: true,
        email: true
      }
    },

    property: {
      select: {
        id: true,
        title: true,
        price: true,
        location: true
      }
    }
  }
        }) 
        res.status(200).json({mes:"boiking", data:data})

    }
    catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}

const Updatebookingstatus = async(req,res)=>{
    try{

         const bookingid = req.params.bookingid

         const {status} = req.body

         if(status != "confirmed" && status != "canceled" && status != "completed" ){
          return  res.status(400).json({mes:"status must == confirmed or  or completed or canceled"})
         }

        if(req.user.isAdmin != true){

        return res.status(400).json({"mes":"only for admins"})
      }

     const checkbooking = await prisma.booking.findUnique({
        where:{
            id:bookingid
        }
     })

     if(!checkbooking){
       return res.status(400).json({mes:" this booking not found"})
     }

     const updatestatus = await prisma.booking.update({
        where:{
             id:bookingid
        },
        data:{
          status:status
        },
         select: {
    id: true,
    startDate: true,
    endDate: true,
    status: true,

    user: {
      select: {
        name: true,
        email: true
      }
    },

    property: {
      select: {
        id: true,
        title: true,
        price: true,
        location: true
      }
    }
  }
     })

     res.status(200).json({mes:"status updated",data:updatestatus})
    }
    catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}


const Updatebookingdates = async(req,res)=>{

    try{

        const bookingid = req.params.bookingid
         const Propertiesid = req.params.Propertiesid

        const {startDate , endDate} = req.body

      if(!startDate || !endDate){
       return res.status(400).json({mes:"startDate and endDate is require "})
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  return res.status(400).json({ message: "Invalid date format" });
}

if (start >= end) {
  return res.status(400).json({ message: "startDate must be before endDate" });
}


 const checkbooking = await prisma.booking.findUnique({
        where:{
            id:bookingid
        }
     })

     if(!checkbooking){
       return res.status(400).json({mes:" this booking not found"})
     }

     if (new Date() > checkbooking.startDate) {
    return  res.status(400).json({mes:"Cannot update a booking that already started"});
    }

     if(checkbooking.userId != req.user.id){
       return res.status(400).json({mes:"must be owner"})
     }

     // check date Availability

     const checkdateavailabe = await prisma.booking.findFirst({
        where:{
            propertyId:Propertiesid,
             id: { not: bookingid },
              status: {
             not: "canceled" 
            },
            AND:[
                { startDate: { lt: end } }, 
                { endDate: { gt: start } },
            ]
        }
    })



   if(checkdateavailabe){
    return res.status(400).json({mes:"This date is not available"})
   }

   const updatedate = await prisma.booking.update({
    where:{
      id:bookingid
    },
    data:{
         startDate:start,
         endDate:end,
    },
     select: {
    id: true,
    startDate: true,
    endDate: true,
    status: true,

    user: {
      select: {
        name: true,
        email: true
      }
    },

    property: {
      select: {
        id: true,
        title: true,
        price: true,
        location: true
      }
    }
  }
   })

   res.status(200).json({mes:"date updated ", data:updatedate})
    }
    catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}

const Cancelbooking = async(req,res)=>{

    try{

        const bookingid = req.params.bookingid

         const checkbooking = await prisma.booking.findUnique({
        where:{
            id:bookingid
        }
     })

     if(!checkbooking){
       return res.status(400).json({mes:" this booking not found"})
     }

     if (new Date() > checkbooking.startDate) {
    return  res.status(400).json({mes:"Cannot update a booking that already started"});
    }

     if(checkbooking.userId != req.user.id){
      return  res.status(400).json({mes:"must be owner"})
     }

     //cancel booking
     const cancelbooking = await prisma.booking.update({where:{id:bookingid},
    data:{
        status:"canceled"
    },
     select: {
    id: true,
    startDate: true,
    endDate: true,
    status: true,

    user: {
      select: {
        name: true,
        email: true
      }
    },

    property: {
      select: {
        id: true,
        title: true,
        price: true,
        location: true
      }
    }
  }
  })

    res.status(200).json({mes:"booking canceled", data:cancelbooking})
    }
    catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }

}

module.exports = {createBooking,Getbookingsbyproperty,Getbookingsbyuser, Updatebookingstatus, Updatebookingdates,Cancelbooking}