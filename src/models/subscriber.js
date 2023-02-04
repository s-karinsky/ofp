import mongoose from 'mongoose'
import { isValidEmail } from '@lib/utils'

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Account already exist'],
        validate: [isValidEmail, 'Please enter a valid e-mail']
    },
    unsubscribeCode: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema)