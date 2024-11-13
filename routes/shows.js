const { Router } = require('express')
const showRouter = Router()
const { Show } = require('../models/index.js')

showRouter.get('/', async (req, res) => {
  const shows = await Show.findAll()
  res.json(shows)
})
showRouter.get('/:id', async (req, res) => {
  const param = req.params.id
  const shows = await Show.findByPk(param)
  res.json(shows)
})
showRouter.post('/', async (req, res) => {
  const show = await Show.create(req.body)
  res.json(show)
})
showRouter.put('/:id', async (req, res) => {
  const param = req.params.id
  const updatedShow = await Show.update(req.body, { where: { id: param } })
  res.json(updatedShow)
})
showRouter.delete('/:id', async (req, res) => {
  const param = req.params.id
  const deletedShow = await Show.destroy({ where: { id: param } })
  res.json(deletedShow)
})

module.exports = showRouter
