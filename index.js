const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config')

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 😎');
});

const cardSchema = new mongoose.Schema({
    titleText: { type: String, required: true },
    mapSrc: String,
    povSrc: { type: String, required: true },
    desc: String,
    nombre: { type: String, required: true },
    fecha: String,
    mapa: String,
    agente: { type: String, required: true },
    habilidad: String
});
const Card = mongoose.model('Card', cardSchema);

mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));
// mongoose.disconnect()

app.post('/cards', async (req, res) => {
    try {
        // mongoose.connect(process.env.MONGODB_URI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // })
        // .then(() => console.log('✅ Conectado a MongoDB'))
        // .catch(err => console.error('❌ Error al conectar a MongoDB:', err));
        const newCard = new Card(req.body);
        // mongoose.disconnect()
        await newCard.save();
        res.status(201).json(newCard);
    } catch (err) {
        res.status(400).json({ error: 'No se pudo guardar la card' });
    }
});

app.get('/cards', async (req, res) => {
  try {
    // mongoose.connect(process.env.MONGODB_URI, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     })
    //     .then(() => console.log('✅ Conectado a MongoDB'))
    //     .catch(err => console.error('❌ Error al conectar a MongoDB:', err));
        const cards = await Card.find();
        // mongoose.disconnect()
        res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener las cards' });
  }
});

