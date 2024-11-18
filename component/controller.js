const service = require('./service');
const CONFIG = require('../config/config');
const { productValidation, productUpdateValidation } = require('./validation');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    try {
        const { error, value } = await productValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        value.warehouses = await new Promise((resolve, reject) => {
            value.warehouses.map(async (item) => {
                item.warehouseId = new mongoose.Types.ObjectId(item.warehouseId);
                const warehouse = await service.findWarehouse(item.warehouseId);
                if (!warehouse) return reject({ message: "Warehouse not found" });
                return resolve(item);
            });
        });

        await service.create(value);
        return res.status(201).json({ message: 'created', status: true });
    } catch (error) {
        if (error.message === "Warehouse not found") return res.status(404).json({ message: error.message, status: false });
        return res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { error, value } = await productValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // const product = await service.findOne(new mongoose.Types.ObjectId(req.params.productId), new mongoose.Types.ObjectId(value.warehouses._id));
        const product = await service.findOne(new mongoose.Types.ObjectId(req.params.productId));
        if (!product) return res.status(404).json({ message: 'Product not found', status: false });

        // await product.warehouses.map((item) => {
        //     if (item._id == value.warehouses._id) {
        //         item.stok = value.warehouses.stok;
        //     }
        //     return item;
        // });

        value.warehouses = await new Promise((resolve, reject) => {
            value.warehouses.map(async (item) => {
                item.warehouseId = new mongoose.Types.ObjectId(item.warehouseId);
                const warehouse = await service.findWarehouse(item.warehouseId);
                if (!warehouse) return reject({ message: "Warehouse not found" });
                return resolve(item);
            });
        });

        product.name = value.name;
        product.warehouses = value.warehouses;

        await product.save();
        return res.status(200).json({ message: 'created', status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.find = async (req, res) => {
    try {
        const user = await service.find(req.query.keyword);
        return res.status(200).json({ message: 'success', user });
    } catch (error) {
        console.log('ERR = ', 'edot-shop-service', 'find', error);
        return res.status(500).json({ message: 'unsuccess' });
    }
};
