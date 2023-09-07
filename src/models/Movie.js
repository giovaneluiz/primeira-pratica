import mongoose from 'mongoose'

export const MovieModel = mongoose.model('Movie', {
    titulo: String,
    sinopse: String,
    duracao: Number,
    dataLancamento: Date,
    imagem: String,
    categorias: Array
})