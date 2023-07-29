import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    areaId: {
        type: mongoose.ObjectId,
        ref: 'Area'
    },
    polygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            default: 'Polygon'
        },
        coordinates: {
            type: [[[Number]]]
        }
    },
    price: {
        type: Number
    },
    done: {
        type: Boolean
    }
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    number: {
        type: String,
    },
    status: {
        type: String,
        enum: ['order', 'processed', 'success'],
        default: 'order'
    },
    payStatus: {
        type: String,
        enum: ['created', 'sent', 'paid', 'expired']
    },
    items: {
        type: [orderItemSchema]
    },
    details: {
        name: String,
        email: String,
        phone: String,
        company: {
            legalForm: {
                type: String
            },
            name: String,
            email: String,
            phone: String,
            inn: String,
            kpp: String,
            bank: String,
            checkingAccount: String
        },
        shootParams: {
            resolution: Number,
            longOverlap: Number,
            crossOverlap: Number,
            accuracy: String,
            light: String
        }
    },
    invoiceId: {
        type: String
    }
})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)