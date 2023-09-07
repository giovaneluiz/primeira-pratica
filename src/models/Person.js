import mongoose from 'mongoose'

export const PersonModel = mongoose.model('Person', {
    nome: String,
    salario: Number,
    aprovado: Boolean
})

