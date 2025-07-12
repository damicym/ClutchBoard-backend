import mongoose from 'mongoose'

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
})

const Card = mongoose.model('Card', cardSchema)

export default Card