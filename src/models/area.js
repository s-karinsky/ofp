import mongoose from 'mongoose'

const areaSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    polygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
            default: 'Polygon'
        },
        coordinates: {
            type: [[[Number]]],
            required: true
        }
    },
    price: {
        type: Number
    },
    preview: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shootDate: {
        type: Date
    },
    metadata: {
        type: Object
    }
})

export default mongoose.models.Area || mongoose.model('Area', areaSchema)