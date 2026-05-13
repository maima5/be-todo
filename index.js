const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

//get
app.get('/todos', async (req, res) => {
  try {
    const { search, category } = req.query
    const todos = await prisma.todo.findMany({
      where: {
        ...(search && { text: { contains: search } }),
        ...(category && category !== 'All' && { category }),
      },
      orderBy: { deadline: 'asc' },
    })
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data todos' })
  }
})

//post
app.post('/todos', async (req, res) => {
  try {
    const { text, category, deadline } = req.body
    if (!text) return res.status(400).json({ error: 'Text tidak boleh kosong' })
    const newTodo = await prisma.todo.create({
      data: { text, category: category || 'Personal', deadline: deadline || null }
    })
    res.status(201).json(newTodo)
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambah todo' })
  }
})

//path
app.patch('/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo) return res.status(404).json({ error: 'Todo tidak ditemukan' })
    const updated = await prisma.todo.update({
      where: { id },
      data: { 
        done: !todo.done,
        completedAt: !todo.done ? new Date() : null
      }
    })
    res.json(updated)
  } catch (error) {
    console.error(error) 
    res.status(500).json({ error: 'Gagal update todo' })
  }
})

//delete
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.todo.delete({ where: { id } })
    res.json({ message: 'Todo berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus todo' })
  }
})

//error handling MIddleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000')
})