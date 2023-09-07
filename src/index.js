import express from 'express'
import { PersonModel } from './models/Person.js'
import { env } from './config/env.js'
import mongoose from 'mongoose'


const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.post('/person', async (req, res) => {
    const { nome, salario, aprovado } = req.body
    const person = {
        nome,
        salario,
        aprovado
    }
    try {
        await mongoose.connect(env.mongoCon)
        const personDb = await PersonModel.create(person)
        res.json({ message: 'Pessoa inserida no sistema com sucesso!', data: personDb })
    } catch (error) {
        res.json({ erro: error })
    }
})

app.get('/person', async (req, res) => {
    try {
        await mongoose.connect(env.mongoCon)
        const personDb = await PersonModel.find()
        res.json({ data: personDb })
    } catch (error) {
        res.json({ erro: error })
    }
})

app.get('/person/:id', async (req, res) => {
    const id = req.params.id
    try {
        await mongoose.connect(env.mongoCon)
        const person = await PersonModel.findOne({ _id: id })
        if (!person) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }
        res.json(person)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.patch('/person/:id', async (req, res) => {
    const id = req.params.id
    const { nome, salario, aprovado } = req.body
    const person = {
        nome,
        salario,
        aprovado,
    }
    try {
        await mongoose.connect(env.mongoCon)
        const updatedPerson = await PersonModel.updateOne({ _id: id }, person)
        if (updatedPerson.matchedCount === 0) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }
        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.delete('/person/:id', async (req, res) => {
    const id = req.params.id
    await mongoose.connect(env.mongoCon)
    const person = await PersonModel.findOne({ _id: id })
    if (!person) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
    }
    try {
        await PersonModel.deleteOne({ _id: id })
        res.status(200).json({ message: 'Usuário removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.listen(3333, console.log('Servidor rodando'))