const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    warehouses: [{
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        stok: { type: Number },
    }]
});

productSchema.plugin(timestamps);
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
