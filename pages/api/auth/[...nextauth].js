import NextAuth  from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@models/user'
import Order from '@models/order'
import dbConnect from '@lib/dbConnect'

export default async function auth(req, res) {
    return await NextAuth(req, res, {
        secret: process.env.NEXTAUTH_SECRET,
        session: {
            jwt: true
        },
        providers: [
            CredentialsProvider({
                name: "credentials",
                credentials: {
                    email: {
                        label: "Email",
                        type: "email"
                    },
                    password: {
                        label: "Password",
                        type: "password"
                    }
                },
                authorize: async (credentials) => {
                    dbConnect()
                    const user = await User.findOne({ email: credentials.email }).select('+password')
                    if (!user) {
                        throw new Error('No user with a matching email was found.')
                    }
                    const pwValid = await user.comparePassword(credentials.password)
                    if (!pwValid) {
                        throw new Error("Your password is invalid")
                    }
                    if (user.confirmationCode) {
                        throw new Error("Unconfirmed")
                    }
                    return user
                }            
            })
        ],
        callbacks: {
            jwt: async({ token, user }) => {
                if (user) {
                    token.user = {
                        _id: user._id,
                        email: user.email,
                        role: user.role
                    }
                }
                return token
            },
            session: async({ session, token }) => {
                dbConnect()
                if (token) {
                    session.user = token.user

                    const order = await Order.findOne({ userId: token.user._id, status: 'order' })
                    session.user.orderCount = !order ? 0 : order.items.length
                }
                return session
            }
        },
        pages: {
            // Here you can define your own custom pages for login, recover password, etc.
            signIn: '/', // we are going to use a custom login page (we'll create this in just a second)
        },
    })
}