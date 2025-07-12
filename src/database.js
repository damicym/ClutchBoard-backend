import { connect, disconnect } from 'mongoose'
import 'dotenv/config'

export const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('✅ Conectado a MongoDB')
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err)
    }
}

export const disconnectDB = async () => {
    try {
        await disconnect()
        console.log('✅ Desconectado de MongoDB')
    } catch (err) {
        console.error('❌ Error al desconectar de MongoDB:', err)
    }
}