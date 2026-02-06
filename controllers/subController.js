const { prisma } = require("../prismastep");
const { route } = require("../routes/subCategory");


//create subcategory
//post 
// /api/subCategory

const createSubCategory = async (req, res) => {
  try {
    const { key, categoryName, translations } = req.body;

    // 1️⃣ basic validation
    if (!key || !categoryName || !Array.isArray(translations)) {
      return res.status(400).json({ mes: "invalid input data" });
    }

    // 2️⃣ check duplicate (logic-based)
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        key,
        categoryName
      }
    });

    if (existingSubCategory) {
      return res.status(400).json({
        mes: "subcategory already exists"
      });
    }

    // 3️⃣ create subcategory + translations
    const newSubCategory = await prisma.subCategory.create({
      data: {
        key,
        categoryName,
        translations: {
          create: translations.map(t => ({
            lang: t.lang,
            name: t.name
          }))
        }
      },
      include: {
        translations: true
      }
    });

    res.status(201).json({
      mes: "subcategory created",
      data: newSubCategory
    });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


const updateSubCategoryKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { key } = req.body;

    // 1️⃣ validation
    if (!key) {
      return res.status(400).json({
        mes: "key is required"
      });
    }

    // 2️⃣ get current subcategory
    const subCategory = await prisma.subCategory.findUnique({
      where: { id }
    });

    if (!subCategory) {
      return res.status(404).json({
        mes: "subcategory not found"
      });
    }

    // 3️⃣ check duplicate key داخل نفس categoryName
    const exists = await prisma.subCategory.findFirst({
      where: {
        key,
        categoryName: subCategory.categoryName,
        NOT: { id }
      }
    });

    if (exists) {
      return res.status(400).json({
        mes: "key already exists in this category"
      });
    }

    // 4️⃣ update key
    const updated = await prisma.subCategory.update({
      where: { id },
      data: { key }
    });

    res.status(200).json({
      mes: "subcategory key updated",
      data: updated
    });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


//update subcategory
//put
// /api/subCategory/:id
const upsertSubCategoryTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang, name } = req.body;

    // 1️⃣ validation
    if (!lang || !name) {
      return res.status(400).json({
        mes: "lang and name are required"
      });
    }

    // 2️⃣ check subcategory
    const subCategory = await prisma.subCategory.findUnique({
      where: { id }
    });

    if (!subCategory) {
      return res.status(404).json({
        mes: "subcategory not found"
      });
    }

    // 3️⃣ upsert translation
    const translation = await prisma.subCategoryTranslation.upsert({
      where: {
        subCategoryId_lang: {
          subCategoryId: id,
          lang
        }
      },
      update: {
        name
      },
      create: {
        lang,
        name,
        subCategoryId: id
      }
    });

    res.status(200).json({
      mes: "translation saved",
      data: translation
    });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};



//delete subcategory 
//delete
// /api/subCategory/:id

const deleteSubCategory = async(req,res)=>{

    try{

        const id = req.params.id

        //check if subcategory exists
        const existingSubCategory = await prisma.subCategory.findUnique({
            where:{
                id:id
            }
        })

        if(!existingSubCategory){
            return res.status(400).json({mes:"cannot find subcategory"})
        }

        //delete subcategory from db
        await prisma.subCategory.delete({
            where:{
                id:id
            }
        })

        res.status(200).json({mes:"subcategory deleted"})
    }
     catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }

}

//get all subcategories for a specific category
//get
// /api/subCategory/category/:categoryName

const getSubCategoriesByCategoryOnly = async (req, res) => {
  try {
    const  categoryName  = req.params.categoryName;
    const lang = req.query.lang || "en";

    const subcategories = await prisma.subCategory.findMany({
      where: { categoryName },
      include: { translations: true }
    });

    const getTranslation = (translations, lang) =>
      translations.find(t => t.lang === lang) ||
      translations.find(t => t.lang === "en") ||
      null;

    const response = subcategories.map(sub => {
      const subTr = getTranslation(sub.translations, lang);
      return {
        id: sub.id,
        key: sub.key,
        categoryName: sub.categoryName,
        name: subTr ? subTr.name : sub.key
      };
    });

    res.status(200).json(response);

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};




//create filter 
//post 
// /api/subCategory/:id/filter

const createAttribute = async (req, res) => {
  try {
    const subCategoryId = req.params.id;
    const { key, type, required, filterable, translations, options } = req.body;

    // 1️⃣ تحقق من البيانات الأساسية
    if (!key || !type) {
      return res.status(400).json({ mes: "key and type are required" });
    }

    // 2️⃣ تحقق من وجود SubCategory
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId }
    });
    if (!subCategory) {
      return res.status(404).json({ mes: "SubCategory not found" });
    }

    // 3️⃣ تجهيز بيانات الـ AttributeDefinition
    const data = {
      key,
      type,
      required: required ?? false,
      filterable: filterable ?? true,
      subCategoryId,
      translations: {
        create: translations?.map(t => ({ lang: t.lang, label: t.label })) || []
      },
      options: {
        create: options?.map(opt => ({
          value: opt.value,
          translations: {
            create: opt.translations?.map(tr => ({
              lang: tr.lang,
              label: tr.label
            })) || []
          }
        })) || []
      }
    };

    // 4️⃣ إنشاء AttributeDefinition مع الـ translations والـ options كلها
    const newAttribute = await prisma.attributeDefinition.create({
      data,
      include: {
        translations: true,
        options: {
          include: { translations: true }
        }
      }
    });

    res.status(201).json({ mes: "Attribute created successfully", data: newAttribute });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};



//update filter 
//put 
// /api/subCategory/filter/:id

const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, type, required, filterable } = req.body;

    // 1️⃣ تحقق من وجود الفلتر
    const attribute = await prisma.attributeDefinition.findUnique({
      where: { id }
    });

    if (!attribute) {
      return res.status(404).json({ mes: "Attribute not found" });
    }

    // 2️⃣ تجهيز البيانات للتحديث
    const updateData = {};
    if (key !== undefined) updateData.key = key;
    if (type !== undefined) updateData.type = type;
    if (required !== undefined) updateData.required = required;
    if (filterable !== undefined) updateData.filterable = filterable;

    // 3️⃣ تحديث الفلتر
    const updatedAttribute = await prisma.attributeDefinition.update({
      where: { id },
      data: updateData,
      include: { translations: true, options: { include: { translations: true } } }
    });

    res.status(200).json({ mes: "Attribute updated successfully", data: updatedAttribute });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};



//delete filter 
//put 
// /api/subCategory/filter/:id

const deleteAttribute = async (req, res) => {
  try {
    const  id  = req.params.id;

    // 1️⃣ تحقق من وجود الفلتر
    const attribute = await prisma.attributeDefinition.findUnique({
      where: { id }
    });

    if (!attribute) {
      return res.status(404).json({ mes: "Attribute not found" });
    }

    // 2️⃣ حذف الفلتر مع كل الخيارات والترجمات
    // ⚠️ لازم تكون علاقة Prisma عندك cascade delete للترجمات والـ options أو تحذفهم يدويًا
    await prisma.attributeDefinition.delete({
      where: { id }
    });

    res.status(200).json({ mes: "Attribute deleted successfully" });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


//get all filters for a specific subCategory
//get
// /api/subCategory/:id/filter
const getAttributesBySubCategory = async (req, res) => {
  try {
    const  id  = req.params.id;
    const lang = req.query.lang || "en";

    // 1️⃣ جلب كل الفلاتر مع الترجمات والخيارات
    const attributes = await prisma.attributeDefinition.findMany({
      where: { subCategoryId: id },
      include: {
        translations: true,
        options: { include: { translations: true } }
      }
    });

    // 2️⃣ وظيفة لاختيار الترجمة المطلوبة أو fallback للإنجليزي
    const getTranslation = (translations) =>
      translations.find(t => t.lang === lang) || translations.find(t => t.lang === "en") || null;

    // 3️⃣ ترتيب الداتا للفرونت
    const response = attributes.map(attr => {
      const attrTr = getTranslation(attr.translations);

      return {
        id: attr.id,
        key: attr.key,
        type: attr.type,
        required: attr.required,
        filterable: attr.filterable,
        label: attrTr ? attrTr.label : attr.key,
        options: attr.options.map(opt => {
          const optTr = getTranslation(opt.translations);
          return {
            id: opt.id,
            value: opt.value,
            label: optTr ? optTr.label : opt.value
          };
        })
      };
    });

    res.status(200).json(response);

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const addAttributeTranslation = async (req, res) => {
  try {
    const  id  = req.params.id;
    const { lang, label } = req.body;

    if (!lang || !label) {
      return res.status(400).json({ mes: "lang and label are required" });
    }

    // 1️⃣ تحقق من وجود الفلتر
    const attribute = await prisma.attributeDefinition.findUnique({
      where: { id }
    });

    if (!attribute) {
      return res.status(404).json({ mes: "Attribute not found" });
    }

    // 2️⃣ تحقق إذا الترجمة موجودة لنفس اللغة
    const existingTranslation = await prisma.attributeTranslation.findUnique({
      where: {
        attributeId_lang: { attributeId: id, lang } // unique constraint في schema
      }
    });

    if (existingTranslation) {
      return res.status(400).json({ mes: `Translation for ${lang} already exists` });
    }

    // 3️⃣ إنشاء الترجمة
    const newTranslation = await prisma.attributeTranslation.create({
      data: {
        attributeId: id,
        lang,
        label
      }
    });

    res.status(201).json({ mes: "Translation added successfully", data: newTranslation });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const updateAttributeTranslation = async (req, res) => {
  try {
    const  id  = req.params.id;
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ mes: "label is required" });
    }

    // 1️⃣ تحقق من وجود الترجمة
    const translation = await prisma.attributeTranslation.findUnique({
      where: { id }
    });

    if (!translation) {
      return res.status(404).json({ mes: "Translation not found" });
    }

    // 2️⃣ تحديث الـ label
    const updatedTranslation = await prisma.attributeTranslation.update({
      where: { id },
      data: { label }
    });

    res.status(200).json({ mes: "Translation updated successfully", data: updatedTranslation });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


const deleteAttributeTranslation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ تحقق من وجود الترجمة
    const translation = await prisma.attributeTranslation.findUnique({
      where: { id }
    });

    if (!translation) {
      return res.status(404).json({ mes: "Translation not found" });
    }

    // 2️⃣ حذف الترجمة
    await prisma.attributeTranslation.delete({
      where: { id }
    });

    res.status(200).json({ mes: "Translation deleted successfully" });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const addAttributeOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, translations } = req.body;

    if (!value || !translations || !Array.isArray(translations) || translations.length === 0) {
      return res.status(400).json({ mes: "value and translations are required" });
    }

    // 1️⃣ تحقق من وجود الفلتر
    const attribute = await prisma.attributeDefinition.findUnique({
      where: { id }
    });

    if (!attribute) {
      return res.status(404).json({ mes: "Attribute not found" });
    }

    // 2️⃣ إنشاء الخيار مع الترجمات
    const newOption = await prisma.attributeOption.create({
      data: {
        value,
        attributeId: id,
        translations: {
          create: translations.map(t => ({
            lang: t.lang,
            label: t.label
          }))
        }
      },
      include: { translations: true }
    });

    res.status(201).json({ mes: "Option added successfully", data: newOption });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const updateAttributeOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ mes: "value is required" });
    }

    // 1️⃣ تحقق من وجود الـ Option
    const option = await prisma.attributeOption.findUnique({
      where: { id }
    });

    if (!option) {
      return res.status(404).json({ mes: "Option not found" });
    }

    // 2️⃣ تحقق من عدم وجود قيمة مكررة لنفس الـ attribute
    const existingOption = await prisma.attributeOption.findUnique({
      where: {
        attributeId_value: { attributeId: option.attributeId, value }
      }
    });

    if (existingOption) {
      return res.status(400).json({ mes: `Option with value "${value}" already exists for this attribute` });
    }

    // 3️⃣ تحديث القيمة
    const updatedOption = await prisma.attributeOption.update({
      where: { id },
      data: { value }
    });

    res.status(200).json({ mes: "Option updated successfully", data: updatedOption });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


const deleteAttributeOption = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ تحقق من وجود الـ Option
    const option = await prisma.attributeOption.findUnique({
      where: { id }
    });

    if (!option) {
      return res.status(404).json({ mes: "Option not found" });
    }

    // 2️⃣ حذف الـ Option مع كل الترجمات
    await prisma.attributeOption.delete({
      where: { id }
    });

    res.status(200).json({ mes: "Option deleted successfully" });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


const getAttributeOptions = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || "en";

    // 1️⃣ تحقق من وجود الفلتر
    const attribute = await prisma.attributeDefinition.findUnique({
      where: { id }
    });

    if (!attribute) {
      return res.status(404).json({ mes: "Attribute not found" });
    }

    // 2️⃣ جلب كل Options مع الترجمات
    const options = await prisma.attributeOption.findMany({
      where: { attributeId: id },
      include: { translations: true }
    });

    // 3️⃣ تجهيز البيانات مع ترجمة fallback
    const optionsWithTranslation = options.map(opt => {
      const tr = opt.translations.find(t => t.lang === lang)
              || opt.translations.find(t => t.lang === "en"); // fallback
      return {
        id: opt.id,
        value: opt.value,
        label: tr ? tr.label : opt.value
      };
    });

    res.status(200).json({ data: optionsWithTranslation });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const addOptionTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang, label } = req.body;

    if (!lang || !label) {
      return res.status(400).json({ mes: "lang and label are required" });
    }

    // 1️⃣ تحقق من وجود الـ Option
    const option = await prisma.attributeOption.findUnique({
      where: { id }
    });

    if (!option) {
      return res.status(404).json({ mes: "Option not found" });
    }

    // 2️⃣ تحقق إن نفس اللغة مش موجودة مسبقًا
    const existingTranslation = await prisma.attributeOptionTranslation.findUnique({
      where: { optionId_lang: { optionId: id, lang } }
    });

    if (existingTranslation) {
      return res.status(400).json({ mes: `Translation for language "${lang}" already exists` });
    }

    // 3️⃣ إنشاء الترجمة الجديدة
    const newTranslation = await prisma.attributeOptionTranslation.create({
      data: {
        lang,
        label,
        optionId: id
      }
    });

    res.status(201).json({ mes: "Translation added successfully", data: newTranslation });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const updateOptionTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ mes: "label is required" });
    }

    // 1️⃣ تحقق من وجود الترجمة
    const translation = await prisma.attributeOptionTranslation.findUnique({
      where: { id }
    });

    if (!translation) {
      return res.status(404).json({ mes: "Translation not found" });
    }

    // 2️⃣ تحديث الـ label
    const updatedTranslation = await prisma.attributeOptionTranslation.update({
      where: { id },
      data: { label }
    });

    res.status(200).json({ mes: "Translation updated successfully", data: updatedTranslation });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


const deleteOptionTranslation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ تحقق من وجود الترجمة
    const translation = await prisma.attributeOptionTranslation.findUnique({
      where: { id }
    });

    if (!translation) {
      return res.status(404).json({ mes: "Translation not found" });
    }

    // 2️⃣ حذف الترجمة
    await prisma.attributeOptionTranslation.delete({
      where: { id }
    });

    res.status(200).json({ mes: "Translation deleted successfully" });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const getallSubCategory = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const allData = await prisma.subCategory.findMany({
      include: {
        translations: true
      }
    });

    // helper لاختيار الترجمة مع fallback
    const getTranslation = (translations, lang) =>
      translations.find(t => t.lang === lang) ||
      translations.find(t => t.lang === "en") ||
      null;

    const response = allData.map(sub => {
      const tr = getTranslation(sub.translations, lang);

      return {
        id: sub.id,
        key: sub.key,
        categoryName: sub.categoryName,
        name: tr ? tr.name : sub.key
      };
    });

    res.status(200).json({
      mes: "all subcategories",
      data: response
    });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};

const getOneSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            lang: { in: ["ar", "en"] }
          }
        }
      }
    });

    if (!subCategory) {
      return res.status(404).json({ mes: "SubCategory not found" });
    }

    // نحول الترجمات لشكل أوضح
    const translationsMap = {
      ar: null,
      en: null
    };

    subCategory.translations.forEach(t => {
      translationsMap[t.lang] = t.name;
    });

    const response = {
      id: subCategory.id,
      key: subCategory.key,
      categoryName: subCategory.categoryName,
      translations: translationsMap
    };

    res.status(200).json({
      mes: "subCategory",
      data: response
    });

  } catch (err) {
    console.log("=========>", err);
    res.status(500).send("err");
  }
};


module.exports={ createSubCategory ,updateSubCategoryKey, upsertSubCategoryTranslation, deleteSubCategory,getSubCategoriesByCategoryOnly , createAttribute   ,updateAttribute, deleteAttribute,getAttributesBySubCategory,
    addAttributeTranslation,updateAttributeTranslation, deleteAttributeTranslation , addAttributeOption , updateAttributeOption,
deleteAttributeOption, getAttributeOptions , addOptionTranslation ,updateOptionTranslation ,deleteOptionTranslation,getallSubCategory ,getOneSubCategory
}