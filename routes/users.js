const { Router } = require('express')
const userRouter = Router()
const { User, Show } = require('../models/index.js')

userRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})
userRouter.get('/:id', async (req, res) => {
  const param = req.params.id
  const users = await User.findByPk(param)
  res.json(users)
})
userRouter.get('/:userId/shows', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: {
        model: Show
      }
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.json(user.shows)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching shows' })
  }
})

userRouter.post('/users/:userId/shows/:showId', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})
userRouter.put('/:userId/shows/:showId', async (req, res) => {
  const userId = parseInt(req.params.userId) // Get the user ID from the URL
  const showId = parseInt(req.params.showId) // Get the show ID from the URL
  try {
    // Check if user and show exist
    const user = await User.findByPk(userId)
    const show = await Show.findByPk(showId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (!show) {
      return res.status(404).json({ message: 'Show not found' })
    }
    // Associate the user with the show (assuming a many-to-many relationship)
    await user.addShow(show)// Assuming `addShow` is a method created by Sequelize for a many-to-many relationship
    res.json({ message: 'User has been associated with the show.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to associate user with show' })
  }
})

userRouter.delete('/:id', async (req, res) => {
  const param = req.params.id
  const deletedUser = await User.destroy({ where: { id: param } })
  res.json(deletedUser)
})

module.exports = userRouter
