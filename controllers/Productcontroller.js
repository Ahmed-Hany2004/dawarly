const { prisma } = require("../prismastep");

const createproduct = async (req, res) => {
  try {
    const { title, display, dawarlyphone, attributes, price , tags ,location } = req.body;
    const id = req.params.id;

   
    
    if (!title || display == null || !attributes || !price || !tags || !location) {
      return res
        .status(400)
        .json({ mes: "title , display and attribtes is require " });
    }

    const Pdata = {
      title:title,
      display:display,
      attributes:attributes,
      userId:req.user.id,
      subCategoryId:id,
      price:price,
      tags:tags,
      location:location,
    }

    if (display == true) {
      if (dawarlyphone == null) {
     return   res
          .status(400)
          .json({ mes: "if  display = true  dawarlyphone is require " });
      }
      Pdata["dawarlyphone"] =dawarlyphone
    }

    // get filters

    const filters = await prisma.attributeDefinition.findMany({
      where: {
        subCategoryId: id,
      },
      select:{
        key:true,
        required:true
      }
    });

      for (const def of filters) {
        if (def.required && attributes[def.key] === undefined) {
          return res.status(400).json({mes:`${def.key} is required`})
        }
      }


  

    //insert product in db 
    const newproduct = await prisma.house.create({

     data:Pdata  
    })

    res.status(200).json({mes:"newproduct created",data:newproduct})
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};


const getproduct = async(req,res)=>{

  try{

   
   const data = await prisma.house.findMany({where:{pinding:true}}) 

   res.status(200).json({mes:"house data",data:data})
  }
  catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
} 


//get pinding data
// /get
// product/pinding

const getpinding = async(req,res)=>{
  try{
 
      if(req.user.isAdmin != true){

        return res.status(400).json({"mes":"only for admins"})
      }

      const pindingproduct = await prisma.house.findMany({where:{pinding:false}})

     res.status(200).json({mes:"pinding product",data:pindingproduct})

  }
  catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}

// update pinding data
// put 
// product/:id/pinding

const updatepinding = async(req,res)=>{
  try{

      const id = req.params.id
    if(req.user.isAdmin != true){

        return res.status(400).json({"mes":"only for admins"})
      }

      const updatepinding = await prisma.house.update({where:{id:id},data:{pinding:true}})

      res.status(200).json({mes:"product updated", data:updatepinding})

  }
   catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}

 
const createProperties_for_rent = async (req, res) => {
  try {
    const { title, display, dawarlyphone, attributes, price , tags ,location } = req.body;
    const id = req.params.id;

   
    
    if (!title || display == null || !attributes || !price || !tags || !location) {
      return res
        .status(400)
        .json({ mes: "title , display and attribtes is require " });
    }

    const Pdata = {
      title:title,
      display:display,
      attributes:attributes,
      userId:req.user.id,
      subCategoryId:id,
      price:price,
      tags:tags,
      location:location,
    }

    if (display == true) {
      if (dawarlyphone == null) {
     return   res
          .status(400)
          .json({ mes: "if  display = true  dawarlyphone is require " });
      }
      Pdata["dawarlyphone"] =dawarlyphone
    }

    // get filters

    const filters = await prisma.attributeDefinition.findMany({
      where: {
        subCategoryId: id,
      },
      select:{
        key:true,
        required:true
      }
    });

      for (const def of filters) {
        if (def.required && attributes[def.key] === undefined) {
          return res.status(400).json({mes:`${def.key} is required`})
        }
      }


  

    //insert product in db 
    const newproduct = await prisma.Properties_for_rent.create({

     data:Pdata  
    })

    res.status(200).json({mes:"newproduct created",data:newproduct})
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};

module.exports = {
  createproduct,
  getproduct,
  getpinding,
  updatepinding,
  createProperties_for_rent
}