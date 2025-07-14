import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import Card from './src/models/Card.js'
import { connectDB } from './src/database.js'

// Inicializamos la app
const app = express()
app.use(cors())
app.use(express.json({ limit: '30mb' }))
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
        if(req.body.povSrc.size >= '5mb'){
            throw new Error('El archivo POV es demasiado grande')
        }
        else if(req.body.mapSrc.size >= '5mb'){
            throw new Error('El archivo MAP es demasiado grande')
        }
        const newCard = new Card(req.body)
        try {
            await newCard.save()
        } catch (error) {
            res.status(500).json({ error: 'No se pudo guardar la card' })
        }
        res.status(200).json(newCard)
    } catch (err) {
        // res.status(400).json({ error: 'No se pudo guardar la card' })
        res.status(400).json({ error: err.message })
    }
})


app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))