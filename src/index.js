import express from 'express'
import { MovieModel } from './models/Movie.js'
import { env } from './config/env.js'
import mongoose from 'mongoose'


const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.post('/movie', async (req, res) => {
    const { titulo, sinopse, duracao, dataLancamento, imagem, categorias } = req.body
    const movie = {
        titulo,
        sinopse,
        duracao,
        dataLancamento,
        imagem,
        categorias,
    }
    try {
        await mongoose.connect(env.mongoCon)
        const movieDb = await MovieModel.create(movie)
        res.json({ message: 'Filme inserido com sucesso!', data: movieDb })
    } catch (error) {
        res.json({ erro: error })
    }
})

app.get('/movie', async (req, res) => {
    try {
        await mongoose.connect(env.mongoCon)
        const movieDb = await MovieModel.find()
        res.json({ data: movieDb })
    } catch (error) {
        res.json({ erro: error })
    }
})

app.get('/movie/:id', async (req, res) => {
    const id = req.params.id
    try {
        await mongoose.connect(env.mongoCon)
        const movie = await MovieModel.findOne({ _id: id })
        if (!movie) {
            res.status(422).json({ message: 'Filme não encontrado!' })
            return
        }
        res.json(movie)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.patch('/movie/:id', async (req, res) => {
    const id = req.params.id
    const { titulo, sinopse, duracao, dataLancamento, imagem, categorias } = req.body
    const movie = {
        titulo,
        sinopse,
        duracao,
        dataLancamento,
        imagem,
        categorias
    }
    try {
        await mongoose.connect(env.mongoCon)
        const updatedMovie = await MovieModel.updateOne({ _id: id }, movie)
        if (updatedMovie.matchedCount === 0) {
            res.status(422).json({ message: 'Filme não encontrado!' })
            return
        }
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.delete('/movie/:id', async (req, res) => {
    const id = req.params.id
    await mongoose.connect(env.mongoCon)
    const movie = await MovieModel.findOne({ _id: id })
    if (!movie) {
        res.status(422).json({ message: 'Filme não encontrado!' })
        return
    }
    try {
        await MovieModel.deleteOne({ _id: id })
        res.status(200).json({ message: 'Filme removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.listen(3333, console.log('Servidor rodando'))