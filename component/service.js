const product = require('./model');
const warehouse = require('./relation/warehouse-model');

exports.create = (body) => {
    return product.create(body);
};

exports.findOne = (productId, warehouseId) => {
    return product.findById(productId);
    // return product.findOne({
    //     $and: [
    //         { _id: productId },
    //         { warehouses: { $elemMatch: { _id: warehouseId } } }
    //     ]
    // });
};

exports.findWarehouse = (_id) => {
    return warehouse.findById(_id);
}

exports.find = (query) => {
    return product.aggregate([
        {
            $match: {
                $text: { $search: query }
            }
        },
        {
            $unwind: {
                path: '$warehouses'
            }
        },
        {
            $lookup: {
                from: "warehouses",
                localField: "warehouses.warehouseId",
                foreignField: '_id',
                as: 'warehouses.warehouse'
            },
        },
        {
            $match: { 'warehouses.warehouse.status': true }
        },
        {
            $unwind: {
                path: '$warehouses.warehouse'
            }
        },
        {
            $lookup: {
                from: "shops",
                localField: "warehouses.warehouse.shop",
                foreignField: '_id',
                as: 'warehouses.warehouse.shop'
            },
        },
        {
            $unwind: {
                path: '$warehouses.warehouse.shop'
            }
        },
        {
            $group: {
                _id: '$_id',
                warehouses: {
                    $push: '$warehouses'
                },
                total: { $sum: '$warehouses.stok' }
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind: {
                path: '$productDetails'
            }
        },
        {
            $addFields: {
                'productDetails.warehouses': '$warehouses',
                'productDetails.total': '$total'
            }
        },
        {
            $replaceRoot: {
                newRoot: '$productDetails'
            }
        }
    ]);
};
