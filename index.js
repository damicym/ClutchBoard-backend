import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import Card from './src/models/Card.js'
import { connectDB } from './src/database.js'

// Inicializamos la app
const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.set('port', process.env.PORT)
app.listen(app.get('port'), () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${app.get('port')}`)
})

await connectDB()

// Rutas
app.get('/', (req, res) => {
    res.json({ message: 'Servidor funcionando 😎' })
})

app.get('/cards', async (req, res) => {
    try {
        const cards = await Card.find()
        res.status(200).json(cards)
    } catch (err) {
        res.status(400).json({ error: 'No se pudieron obtener las cards' })
    }
})


app.post('/cards', async (req, res) => {
    try {
        const newCard = new Card(req.body)
        await newCard.save()
        res.status(200).json(newCard)
    } catch (err) {
        res.status(400).json({ error: 'No se pudo guardar la card' })
    }
})


app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))