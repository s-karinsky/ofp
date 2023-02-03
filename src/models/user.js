import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { isValidEmail } from '@lib/utils'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Account already exist'],
        validate: [isValidEmail, 'Please enter a valid e-mail']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
    },
    phone: {
        type: String
    },
    legalForm: {
        type: String
    },
    birthdate: {
        type: String
    },
    confirmationCode: {
        type: String
    },
    restoreCode: {
        type: String
    },
    restoreDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.models.User || mongoose.model('User', userSchema)