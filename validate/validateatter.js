function validateAttributes(inputAttributes, definitions) {
  // keys المسموحة
  const allowedKeys = definitions.map(d => d.key);

  // 1️⃣ ممنوع keys زيادة
  // for (const key of Object.keys(inputAttributes)) {
  //   if (!allowedKeys.includes(key)) {
  //     throw new Error(`Invalid attribute key: ${key}`);
  //   }
  // }

  // 2️⃣ فحص كل تعريف
  for (const def of definitions) {
    const value = inputAttributes[def.key];

    // required
    if (def.required && value === undefined) {
      throw new Error(`${def.key} is required`);
    }

    if (value === undefined) continue;

    // type validation
    switch (def.type) {
      case "number":
        if (typeof value !== "number") {
          throw new Error(`${def.key} must be a number`);
        }
        break;

      case "select":
        if (typeof value !== "string") {
          throw new Error(`${def.key} must be string`);
        }
        const allowedValues = def.options.map(o => o.value);
        if (!allowedValues.includes(value)) {
          throw new Error(`${def.key} has invalid value`);
        }
        break;

      case "date":
        if (isNaN(Date.parse(value))) {
          throw new Error(`${def.key} must be a valid date`);
        }
        break;

      default:
        throw new Error(`Unsupported attribute type: ${def.type}`);
    }
  }
}



module.exports ={validateAttributes}