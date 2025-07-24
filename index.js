import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import Card from './src/models/Card.js'
import { connectDB } from './src/database.js'

// Inicializamos la app
const app = express()
app.use(cors({
  origin: 'https://damicym.github.io'
}))
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

app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});


app.get('/cards', async (req, res) => {
    try {
        const cards = await Card.find()
        res.status(200).json(cards)
    } catch (err) {
        res.status(400).json({ error: 'No se pudieron obtener las cards' })
    }
})

function calcularTamanoBase64(base64String) {
  const longitud = base64String.length;
  const sinCabecera = base64String.indexOf(',') >= 0
    ? base64String.split(',')[1].length
    : longitud;

  return Math.ceil((sinCabecera * 3) / 4); // bytes
}

app.post('/cards', async (req, res) => {
    const base64pov = req.body.povSrc;
    const tamanopov = calcularTamanoBase64(base64pov);
    const base64map = req.body.mapSrc;
    const tamanomap = calcularTamanoBase64(base64map);

    try {
        if(tamanopov >= 5 * 1024 * 1024){
            throw new Error('Error: La imagen POV es demasiado pesada')
        }
        else if(tamanomap >= 5 * 1024 * 1024){
            throw new Error('Error: La imagen MAP es demasiado pesada')
        }
        const newCard = new Card(req.body)
        try {
            await newCard.save()
            res.status(200).json(newCard)
        } catch (error) {
            res.status(500).json({ error: 'No se pudo guardar el artículo' })
        }
    } catch (err) {
        // res.status(400).json({ error: 'No se pudo guardar la card' })
        res.status(400).json({ error: err.message })
    }
})

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))