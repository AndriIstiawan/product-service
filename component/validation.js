//Validation
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

//Ar Validation
exports.productValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        warehouses: Joi.array().items(warehouses),
    }).options({ allowUnknown: true });
    return schema.validate(data);
};

let warehouses = Joi.object().keys({
    warehouseId: Joi.objectId().required(),
    stok: Joi.number().default(0),
})


exports.productUpdateValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        warehouses: Joi.object({
            _id: Joi.objectId().required(),
            stok: Joi.number().default(0),
        }),
    }).options({ allowUnknown: true });
    return schema.validate(data);
};
